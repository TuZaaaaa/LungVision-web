<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { ElSlider, ElIcon } from 'element-plus';
import { Loading } from '@element-plus/icons-vue';
import {imagePreview, imagePreviewCount} from "@/api/study.js";
import {debounce, throttle} from "lodash-es";
import {onUnmounted} from "vue-demi";

// 默认返回邻近 5 张
const defaultWindowSize = 5;
// 默认维度类型，冠切 | r,s,a
const orientation = ref('r');

const queryData = ref({
  studyId: '',
  orientation: orientation.value,
  offset: 0,
  limit: defaultWindowSize,
})
const meta = reactive({ total: 0 });
const windowImgs = reactive({});
const current = ref(0);
const loading = ref(false);

const selectOrientationName = ref('r')
const OrientationNameOptions = ref([{value: 'r', label: '冠切面'}, {value: 's', label: '矢切面'}, {value: 'a', label: '轴切面'}])

const props = defineProps(['studyId'])

// 获取总切片数
const fetchMeta = async () => {
  imagePreviewCount({studyId: props.studyId, orientation: orientation.value}).then(res => {
    meta.total = res.data.total;
  }).catch(err => {
    console.error('获取元数据失败', err);
  })
};

// 根据当前索引拉取邻近切片
let fetchSeq = 0;
const fetchWindow = async () => {
  // 请求加入序号
  const mySeq = ++fetchSeq;
  const half = Math.floor(queryData.value.limit / 2);
  const start = Math.max(0, current.value - half);
  loading.value = true;
  queryData.value.studyId = props.studyId
  queryData.value.offset = start
  imagePreview(queryData.value).then(res => {
    if (mySeq !== fetchSeq) return;
    console.log('>> images from server', res.data.images.map(i => i.sliceIndex));
    res.data.images.forEach(img => {
      windowImgs[img.sliceIndex] = img.data;
    });
  }).catch(err => {
    console.error('加载图像失败', err);
  }).finally(() => {
    loading.value = false;
  })
};


// 防抖包装
// 延迟 300ms，只有在 300ms 内没有新请求才执行，避免抖动时多次请求
const debouncedFetchWindow = debounce(fetchWindow, 300);

// 滚轮处理
const onWheel = (e) => {
  e.preventDefault(); // 阻止页面滚动
  if (e.deltaY > 0) {
    // 向下滚：index+1
    current.value = Math.min(meta.total - 1, current.value + 1);
  } else {
    // 向上滚：index-1
    current.value = Math.max(0, current.value - 1);
  }
};

// 节流包装
// 限制滚轮事件每 100ms 触发一次，防止滚动过快
const throttledOnWheel = throttle(onWheel, 100);

onMounted(() => {
  fetchMeta();
  fetchWindow();
  window.addEventListener('wheel', onWheel, { passive: false });
});

// 卸载时清理监听
onUnmounted(() => {
  window.removeEventListener('wheel', throttledOnWheel);
});

watch(
    () => [current.value, props.studyId],
    () => {
      debouncedFetchWindow();
    }
);

const thumbnailIndices = computed(() => {
  const size = queryData.value.limit;
  const half = Math.floor(size / 2);
  const start = Math.max(0, current.value - half);
  const arr = [];
  for (let i = 0; i < size; i++) {
    const idx = start + i;
    if (idx < meta.total) arr.push(idx);
  }
  return arr;
});

const onSliderChange = val => {
  console.log(val)
  current.value = val;
};

const handleTaskNameSelectionChange = (val) => {
  console.log(val)
  if (val === '' || val === undefined) {
    return
  }
  // 更新维度取值
  orientation.value = val
  queryData.value.orientation = val
  fetchMeta();
  fetchWindow();
}

</script>

<template>
  <el-row id="flex flex-wrap gap-4 items-cente">
    <el-select
        v-model="selectOrientationName"
        @change="handleTaskNameSelectionChange"
        clearable
        placeholder="维度"
        size="large"
        style="margin-left: 20px;width: 150px"
    >
      <el-option
          v-for="item in OrientationNameOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      />
    </el-select>
  </el-row>
  <div id="imagePreview" @wheel.prevent="throttledOnWheel" style="overflow: hidden;">
    <!-- 只有当总切片数大于 0 时渲染滑块 -->
    <div v-if="meta.total > 0">
      <el-slider
          v-model="current"
          :min="0"
          :max="meta.total - 1"
          @input="onSliderChange"
      />
    </div>
    <div v-else class="loading-wrapper">
      <el-icon>
        <Loading />
      </el-icon>
      <p>正在加载切片数量...</p>
    </div>

    <!-- 主图预览 -->
    <div class="image-preview" style="text-align: center; margin: 16px 0;">
      <div v-if="loading" class="loading-wrapper">
        <el-icon>
          <Loading />
        </el-icon>
      </div>
      <img
          v-else-if="windowImgs[current]"
          :src="windowImgs[current]"
          :alt="`Slice ${current + 1}`"
          class="main-image"
      />
      <p v-if="meta.total > 0">Slice #{{ current + 1 }} / {{ meta.total }}</p>
    </div>

    <!-- 邻近缩略图列表 -->
    <div class="thumbnail-list" v-if="meta.total > 0">
      <div
          v-for="idx in thumbnailIndices"
          :key="idx"
          class="thumb-wrapper"
      >
        <img
            v-if="windowImgs[idx]"
            :src="windowImgs[idx]"
            :class="['thumb-image', { 'active-thumb': idx === current }]"
            @click="current = idx"
        />
        <div v-else class="thumb-placeholder"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-image {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  border-radius: 8px;
}
.thumbnail-list {
  display: flex;
  justify-content: center;
  gap: 8px;
}
.thumb-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.active-thumb {
  border-color: var(--el-color-primary);
  border-width: 2px;
}
.thumb-placeholder {
  width: 60px;
  height: 60px;
  background: #f0f0f0;
  border-radius: 4px;
}
.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
}
</style>
