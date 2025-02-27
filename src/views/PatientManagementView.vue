<script setup>
import {ref, onMounted} from 'vue'
import {Search} from "@element-plus/icons-vue";
import {deletePatient, insertPatient, list, queryByName, updatePatient} from "@/api/patient.js";
import {ElMessage, ElMessageBox} from "element-plus";


const loading = ref(false)
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
const tableData = ref([])
const tabColumn = ref([
  {prop: 'id', label: '患者ID'},
  {prop: 'name', label: '患者名字'},
  {prop: 'age', label: '患者年龄'},
  {prop: 'gender', label: '患者性别'},
])
const input = ref('')
const insertDialogFormVisible = ref(false)
const updateDialogFormVisible = ref(false)
const insertForm = ref({
  name: '',
  age: '',
  gender: '',
})
const updateForm = ref({
  id: '',
  name: '',
  age: '',
  gender: '',
})
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
    total.value = res.data.length
  }).catch(err => {
    ElMessage.error(err);
  })
}

const search = () => {
  console.log(input.value)
  queryByName(input.value).then(res => {
    loading.value = false
    tableData.value = res.data.map(item => ({
      ...item,
    }))
    total.value = res.data.length
  }).catch(err => {
    ElMessage.error(err);
  })
}

const displayInsertDialog = () => {
  console.log(insertForm.value)
  insertDialogFormVisible.value = true
  insertPatient(insertForm.value).then(() => {
    ElMessage.success("添加成功")
    getList()
    insertDialogFormVisible.value = false
  }).catch(err => {
    ElMessage.error(err);
  })
}

const handleSelectionChange = (selectedItems) => {
  selectedRows.value = selectedItems
}

const displayUpdateDialog = () => {
  if (selectedRows.value.length !== 1) {
    ElMessage.error('请选择一行进行修改')
  } else {
    updateDialogFormVisible.value = true
    updateForm.value = selectedRows.value[0]
  }
}

const update = () => {
  updateDialogFormVisible.value = false
  updatePatient(updateForm.value).then(() => {
    ElMessage.success('更新成功')
    getList()
  }).catch(err => {
    ElMessage.error(err);
  })
}

const del = () => {
  ElMessageBox.confirm('请确认是否要删除?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const idList = selectedRows.value.map(item => item.id)
    deletePatient(idList).then(() => {
      ElMessage.success('删除成功')
      getList()
    }).catch(() => {
      ElMessage.error('删除失败')
    })
  }).catch(() => {
    ElMessage.error('已取消删除')
  })
}
</script>

<template>
  <div>
    <el-row id="button-row">
      <el-col :span="5">
        <el-input
            id="search"
            v-model="input"
            placeholder="请输入患者名字"
            :prefix-icon="Search"
            clearable
        />
      </el-col>
      <el-button id="search-button" type="primary" @click="search">搜索</el-button>
      <el-button type="success" @click="displayInsertDialog">添加</el-button>
      <el-button type="warning" @click="displayUpdateDialog">修改</el-button>
      <el-button type="danger" @click="del">删除</el-button>
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

    <div style="text-align:center;margin-top: 20px;margin-left: 1450px">
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

    <!-- 新增 -->
    <el-dialog title="新增患者信息" v-model="insertDialogFormVisible">
      <el-form :model="insertForm">
        <el-form-item label="患者名字：" label-width="120px">
          <el-input v-model="insertForm.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="患者年龄：" label-width="120px">
          <el-input v-model="insertForm.age" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="患者性别：" label-width="120px">
          <el-radio-group v-model="insertForm.gender">
            <el-radio value="MALE" size="large">男</el-radio>
            <el-radio value="FEMALE" size="large">女</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="insertDialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="insert">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog title="修改患者信息" v-model="updateDialogFormVisible">
      <el-form :model="updateForm">
        <el-form-item label="患者名字：" label-width="120px">
          <el-input v-model="updateForm.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="患者年龄：" label-width="120px">
          <el-input v-model="updateForm.age" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="患者性别：" label-width="120px">
          <el-radio-group v-model="updateForm.gender">
            <el-radio value="MALE" size="large">男</el-radio>
            <el-radio value="FEMALE" size="large">女</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="updateDialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="update">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
#table {
  margin-top: 20px;
  margin-left: 20px;
}

#button-row {
  margin-top: 20px;
  margin-left: 20px;
}

#search-button {
  margin-left: 20px;
}

.el-form-item {
  align-items: center;
}
</style>
