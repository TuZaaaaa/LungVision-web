<script setup>
import {ref, onMounted} from 'vue'
import {list} from "@/api/task.js";
import {ElMessage} from "element-plus";


const loading = ref(false)
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
const tableData = ref([])
const tabColumn = ref([
  {prop: 'id', label: '任务ID'},
  {prop: 'name', label: '任务名称'},
  {prop: 'type', label: '任务类型'},
  {prop: 'createdAt', label: '任务创建时间'},
  {prop: 'finishedAt', label: '任务完成时间'},
  {prop: 'taskStatus', label: '任务状态'},
])
const selectedRows = ref([])

onMounted(() => {
  getList()
})

const current_change = (newPage) => {
  currentPage.value = newPage
}

const getList = () => {
  loading.value = true
  list().then(res => {
    loading.value = false
    tableData.value = res.data.map(item => ({
      ...item,
    }))

    // 留存一份完整，用与筛选
    tableDataFull.value = tableData.value
    total.value = res.data.length
  }).catch(err => {
    ElMessage.error(err);
  })
}

const handleSelectionChange = (selectedItems) => {
  selectedRows.value = selectedItems
}

const selectTaskName = ref('')
const taskNameOptions = ref([{value: '数据导入', label: '数据导入'}, {value: '图像处理', label: '图像处理'}, {value: '报告生成', label: '报告生成'}])
const tableDataFull = ref([])

const handleTaskNameSelectionChange = (val) => {
  console.log(val)
  if (val === '' || val === undefined) {
    tableData.value = tableDataFull.value
  } else {
    tableData.value = tableDataFull.value.filter((item) => {
      if (val === item.name) {
        return true
      }
    })
  }
  total.value = tableData.value.length
}
</script>

<template>
  <div>
    <el-row id="flex flex-wrap gap-4 items-cente">
<!--      Todo: 完善筛选 -->
      <el-select
          v-model="selectTaskName"
          @change="handleTaskNameSelectionChange"
          clearable
          placeholder="任务名称"
          size="large"
          style="margin-left: 20px;width: 150px"
      >
        <el-option
            v-for="item in taskNameOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
    </el-row>
    <el-table
        id="table"
        v-loading="loading"
        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        border
        size="default"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"/>
      <!--      <el-table-column align="center" label="序号" type="index" width="70px" show-overflow-tooltip />-->
      <el-table-column
          v-for="item in tabColumn"
          :key="item.index"
          :prop="item.prop"
          :label="item.label"
          align="center"
          show-overflow-tooltip
          sortable
      />
    </el-table>

    <div style="text-align:center;margin-top: 20px;margin-left: 20px">
      <el-pagination
          id="pagination"
          hide-on-single-page
          background
          layout="prev, pager, next, total"
          :total="total"
          :page-size="pageSize"
          @current-change="current_change"
      />
    </div>
  </div>
</template>

<style scoped>
#table {
  margin-top: 20px;
  margin-left: 20px;
}
</style>
