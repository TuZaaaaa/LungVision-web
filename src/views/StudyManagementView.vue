<script setup>
import {ref, onMounted} from 'vue'
import {Search, Upload, Picture, Document} from "@element-plus/icons-vue";
import {
  deleteStudy,
  insertStudy,
  list,
  queryByName,
  updateStudy,
  imageProcessWithStudyId, reportGenerateWithStudyId
} from "@/api/study.js";
import {ElMessage, ElMessageBox} from "element-plus";
import dayjs from "dayjs";
import DataImportView from "@/views/DataImportView.vue";


const loading = ref(false)
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
const tableData = ref([])
const tabColumn = ref([
  {prop: 'id', label: '检查记录ID'},
  {prop: 'patientId', label: '患者ID'},
  {prop: 'studyDate', label: '检查日期'},
  {prop: 'description', label: '检查描述'},
  {prop: 'pixelSum', label: '总像素数'},
])
const input = ref('')
const insertDialogFormVisible = ref(false)
const updateDialogFormVisible = ref(false)
const uploadDialogVisible = ref(false)
const insertForm = ref({
  patientId: '',
  studyDate: '',
  description: '',
  pixelSum: '',
})
const updateForm = ref({
  id: '',
  patientId: '',
  studyDate: '',
  description: '',
  pixelSum: '',
})
const selectedRows = ref([])
let selectStudyId = ref(0)

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
      studyDate: dayjs(item.studyDate).format('YYYY-MM-DD HH:mm:ss'),
    }))
    console.log(tableData.value)
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
      studyDate: dayjs(item.studyDate).format('YYYY-MM-DD HH:mm:ss'),
    }))
    total.value = res.data.length
  }).catch(err => {
    ElMessage.error(err);
  })
}

const displayInsertDialog = () => {
  console.log(insertForm.value)
  insertDialogFormVisible.value = true
}

const insert = () => {
  insertStudy(insertForm.value).then(() => {
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
  console.log(updateForm.value.studyDate)
  updateStudy(updateForm.value).then(() => {
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
    deleteStudy(idList).then(() => {
      ElMessage.success('删除成功')
      getList()
    }).catch(() => {
      ElMessage.error('删除失败')
    })
  }).catch(() => {
    ElMessage.error('已取消删除')
  })
}

const displayUploadDialog = () => {
  selectStudyId.value = selectedRows.value[0].id
  if (selectedRows.value.length !== 1) {
    ElMessage.error('请选择一行进行上传')
  } else {
    uploadDialogVisible.value = true
  }
}

const imageProcess = () => {
  selectStudyId.value = selectedRows.value[0].id
  if (selectedRows.value.length !== 1) {
    ElMessage.error('请选择一行进行图像处理')
    return
  }
  imageProcessWithStudyId({studyId: selectStudyId.value}).then((res) => {
    if (res.data.success) {
      ElMessage.success('图像任务处理完成')
    } else {
      ElMessage.error(res.data.msg)
      console.log(res)
    }
  }).catch(err => {
    ElMessage.error(err)
  })
}

const reportGenerate = () => {
  selectStudyId.value = selectedRows.value[0].id
  if (selectedRows.value.length !== 1) {
    ElMessage.error('请选择一行进行图像处理')
    return
  }
  reportGenerateWithStudyId({studyId: selectStudyId.value}).then((res) => {
    // console.log(res.data.pdf)
    console.log(res)
    // Get the PDF data (encoded as base64 or binary)
    const pdfData = res.data.pdf;

    // Convert the PDF data to a Blob
    const byteCharacters = atob(pdfData); // Decode the base64 data
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const pdfBlob = new Blob(byteArrays, {type: 'application/pdf'});

    // Create an Object URL for the Blob
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Create a link element to download the PDF
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'report.pdf';  // Optional: Specify the filename for the download
    link.click();  // Trigger the download

    if (res.success) {
      ElMessage.success('报告生成任务处理完成')
    } else {
      ElMessage.error(res.data.msg)
    }
  }).catch(err => {
    console.log('bb')
    console.log(err)
    ElMessage.error(err)
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
            placeholder="请输入患者ID"
            :prefix-icon="Search"
            clearable
        />
      </el-col>
      <el-button id="search-button" type="primary" @click="search">搜索</el-button>
      <el-button type="success" @click="displayInsertDialog">添加</el-button>
      <el-button type="warning" @click="displayUpdateDialog">修改</el-button>
      <el-button type="danger" @click="del">删除</el-button>
      <el-button type="primary" @click="displayUploadDialog">
        数据导入
        <el-icon class="el-icon--right">
          <Upload/>
        </el-icon>
      </el-button>
      <el-button type="primary" @click="imageProcess">
        图像处理
        <el-icon class="el-icon--right">
          <Picture/>
        </el-icon>
      </el-button>
      <el-button type="primary" @click="reportGenerate">
        报告生成
        <el-icon class="el-icon--right">
          <Document/>
        </el-icon>
      </el-button>
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
    <el-dialog title="新增检查记录" v-model="insertDialogFormVisible">
      <el-form :model="insertForm">
        <el-form-item label="患者编码：" label-width="120px">
          <el-input v-model="insertForm.patientId" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="检查日期：" label-width="120px">
          <el-date-picker
              v-model="insertForm.studyDate"
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="检查描述：" label-width="120px">
          <el-mention
              v-model="insertForm.description"
              type="textarea"
              style="width: 320px"
          />
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
    <el-dialog title="修改检查记录" v-model="updateDialogFormVisible">
      <el-form :model="updateForm">
        <el-form-item label="患者编码：" label-width="120px">
          <el-input v-model="updateForm.patientId" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="检查日期：" label-width="120px">
          <el-date-picker
              v-model="updateForm.studyDate"
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="检查描述：" label-width="120px">
          <el-mention
              v-model="updateForm.description"
              type="textarea"
              style="width: 320px"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="updateDialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="update">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="数据导入" v-model="uploadDialogVisible">
      <DataImportView :studyId="selectStudyId"/>
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
