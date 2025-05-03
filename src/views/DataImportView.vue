<script setup>
import {UploadFilled} from '@element-plus/icons-vue'
import axios from 'axios'
import {ref} from 'vue'
import {ElMessage} from "element-plus";

const props = defineProps(['studyId'])

// 定义上传 URL 和额外的请求数据
const uploadUrl = '/py-api/upload'
const uploadData = ref({
  studyId: props.studyId,
})
// const uploadHeaders = ref({
//   Authorization: 'Bearer your-token'
// })
let uploadProgress = ref(0)
const handleBeforeUpload = (file) => {
  // 使用 axios 自行发请求
  const formData = new FormData()
  formData.append('file', file)
  formData.append('studyId', uploadData.value.studyId)

  // 使用 axios 发送请求
  axios.post(uploadUrl, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      // ...uploadHeaders.value
    },
    onUploadProgress: (progressEvent) => {
      uploadProgress.value = ((progressEvent.loaded / progressEvent.total) * 100).toFixed(2)
    }
  })
      .then((res) => {
        if (res.data.success) {
          ElMessage.success('上传成功，请在任务管理页面查看导入任务状态')
        } else {
          ElMessage.error('上传失败：' + res.data.msg)
        }

      })
      .catch((err) => {
        ElMessage.error(err)
      })

  // 阻止 el-upload 默认的上传行为
  return false
}
</script>

<template>
  <div id="dataImport">
    <el-upload
        class="upload-demo"
        drag
        :before-upload="handleBeforeUpload"
        :multiple="true"
    >
      <el-icon class="el-icon--upload">
        <UploadFilled/>
      </el-icon>
      <div class="el-upload__text">
        将文件拖到此处，或 <em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          支持文件类型：zip， rar
        </div>
        <div class="el-upload__tip">
          压缩包需要包含一个根目录 data，下面包含 3 个子目录：dicom（用于存放导出的 CT 源文件）<br /> img_p（用于存放血灌注的 CT 图像） ，img_v（用于存放通气的 CT 图像），3 个目录需保持文件数量一致
        </div>
      </template>
    </el-upload>
    <el-Text>上传进度：</el-Text>
    <el-progress :text-inside="true" :stroke-width="26" :percentage="uploadProgress"/>
  </div>
</template>

<style scoped>

</style>
