<script setup>
import {ref, onMounted} from 'vue'
import {Search, Upload, Picture, Document, Delete} from "@element-plus/icons-vue";
import {
  deleteStudy,
  insertStudy,
  list,
  updateStudy,
  imageProcessWithStudyId, reportGenerateWithStudyId,
  getTaskStatus, queryByPatientId, dataClear
} from "@/api/study.js";
import {ElMessage, ElMessageBox} from "element-plus";
import dayjs from "dayjs";
import DataImportView from "@/views/DataImportView.vue";
import VueOfficePdf from '@vue-office/pdf'
import ImagePreviewView from "@/views/ImagePreviewView.vue";  // 确保已安装并正确配置该组件


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
  {prop: 'pixelPSum', label: '血灌注像素值'},
  {prop: 'pixelVSum', label: '通气像素值'},
  {prop: 'ventilationPerfusionRatio', label: '通气血流比'},
  {prop: 'fileNum', label: '文件数量'},
  {prop: 'executeTime', label: '图像处理时长（单位：秒）'},
  {prop: 'processStatus', label: '数据处理状态'},
])
const input = ref('')
const insertDialogFormVisible = ref(false)
const updateDialogFormVisible = ref(false)
const uploadDialogVisible = ref(false)
const imagePreviewDialogVisible = ref(false)
const reportDialogVisible = ref(false)
const insertForm = ref({
  patientId: '',
  studyDate: '',
  description: '',
})
const updateForm = ref({
  id: '',
  patientId: '',
  studyDate: '',
  description: '',
})
const selectedRows = ref([])
let selectStudyId = ref(0)
const pdfUrl = ref('')
const showPreview = ref(false)

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
  queryByPatientId(input.value).then(res => {
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
  insertStudy(insertForm.value).then((data) => {
    if (data.success) {
      ElMessage.success("添加成功")
      getList()
      insertDialogFormVisible.value = false
    } else {
      ElMessage.error("请选择可用的患者编码")
    }
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

const displayClearDialog = () => {
  selectStudyId.value = selectedRows.value[0].id
  if (selectedRows.value.length !== 1) {
    ElMessage.error('请选择一行进行数据清空')
    return
  }

  ElMessageBox.confirm('请确认是否要清空已导入的数据?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    dataClear({studyId: selectStudyId.value}).then((res) => {
      if (res.success) {
        console.log("后端传回了任务id");
        const taskId = res.data.task_id; // 假设后端返回任务ID
        ElMessage.success('数据清空任务已提交,请等待');
        checkTaskStatus(taskId, '数据清空'); // 开始轮询任务状态
      } else {
        console.log(1)
        ElMessage.error(res.data.msg);
        console.log(res);
      }
      getList()
    }).catch(() => {
      ElMessage.error('数据清空失败')
    })
  }).catch(() => {
    ElMessage.error('已取消清空')
  })
}

const imageProcess = () => {
  selectStudyId.value = selectedRows.value[0].id;
  if (selectedRows.value.length !== 1) {
    ElMessage.error('请选择一行进行图像处理');
    return;
  }

  // 发起图像处理任务
  imageProcessWithStudyId({ studyId: selectStudyId.value }).then((res) => {
    if (res.success) {
      console.log("后端传回了任务id");
      const taskId = res.data.task_id; // 假设后端返回任务ID
      ElMessage.success('图像处理任务已提交,请等待');
      checkTaskStatus(taskId, '图像处理'); // 开始轮询任务状态
    } else {
      console.log(1)
      ElMessage.error(res.data.msg);
      console.log(res);
    }
  }).catch(err => {
    ElMessage.error(err);
  });
};

// 轮询任务状态
const checkTaskStatus = (taskId, taskName) => {
  const interval = setInterval(() => {
    getTaskStatus(taskId).then((res) => {
      if (res.success) {
        const task = res.data;
        console.log(res.data)
        console.log(task)
        if (task.status === 'finished') {
          clearInterval(interval); // 停止轮询
          console.log('任务处理完成');
          ElMessage.success(`${taskName}处理完成`);
          getList()
        } 
        // 如果任务仍在处理中，继续轮询
      } else {
        clearInterval(interval); // 停止轮询
        ElMessage.error('获取任务状态失败: ' + res.msg);
      }
    }).catch(err => {
      clearInterval(interval); // 停止轮询
      ElMessage.error('获取任务状态失败: ' + err);
    });
  }, 3000);
};


const reportGenerate = () => {
  selectStudyId.value = selectedRows.value[0].id
  if (selectedRows.value.length !== 1) {
    ElMessage.error('请选择一行进行图像处理')
    return
  }
  reportGenerateWithStudyId({ studyId: selectStudyId.value })
      .then((res) => {
        if (res.success) {
          const pdfData = res.data.pdf
          // 将 base64 解码为字节数据
          const byteCharacters = atob(pdfData)
          const byteArrays = []
          for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
            const slice = byteCharacters.slice(offset, offset + 1024)
            const byteNumbers = new Array(slice.length)
            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i)
            }
            const byteArray = new Uint8Array(byteNumbers)
            byteArrays.push(byteArray)
          }
          const pdfBlob = new Blob(byteArrays, { type: 'application/pdf' })
          const url = URL.createObjectURL(pdfBlob)
          pdfUrl.value = url
          showPreview.value = true
          reportDialogVisible.value = true
          ElMessage.success('报告生成成功，请预览报告')
        } else {
          ElMessage.error(res.data.msg)
        }
      })
      .catch(err => {
        console.error(err)
        ElMessage.error(err)
      })
}

const imagePreview = () => {
  selectStudyId.value = selectedRows.value[0].id
  if (selectedRows.value.length !== 1) {
    ElMessage.error('请选择一行进行图像处理')
    return
  }
  imagePreviewDialogVisible.value = true
}

const downloadPdf = () => {
  // 创建临时 a 标签并触发下载
  const link = document.createElement('a')
  link.href = pdfUrl.value
  link.download = 'report.pdf'
  link.click()
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
      <el-button type="primary" @click="displayClearDialog">
        数据清空
        <el-icon class="el-icon--right">
          <Delete/>
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
      <el-button type="primary" @click="imagePreview">
        可视化预览
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

    <el-dialog fullscreen title="可视化预览" v-model="imagePreviewDialogVisible" class="preview">
      <ImagePreviewView :studyId="selectStudyId"/>
    </el-dialog>
  </div>

  <el-dialog title="报告预览" v-model="reportDialogVisible" fullscreen>
    <!-- 预览区域，仅当 pdfUrl 有值时显示 -->
    <div v-if="showPreview" style="margin-top:20px;">
      <!-- 使用 @vue-office/pdf 组件展示 PDF -->
      <vue-office-pdf :src="pdfUrl" style="width:100%; height:600px;" />
      <!-- 下载按钮 -->
      <el-button type="success" style="margin-top:10px;" @click="downloadPdf">下载报告</el-button>
    </div>
  </el-dialog>
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

/* 处理报告预览灰边 */
:deep(.vue-office-pdf-wrapper) {
  padding-top: 0 !important;
  background-color: transparent !important;;
}

.preview {
  margin-top: -20px;
}
</style>
