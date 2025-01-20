
<script setup>
import { UploadFilled } from '@element-plus/icons-vue'
import axios from 'axios'
import { ref } from 'vue'

// 定义上传 URL 和额外的请求数据
const uploadUrl = '/py-api/upload'
const uploadData = ref({
  studyId: 12345
})
// const uploadHeaders = ref({
//   Authorization: 'Bearer your-token'
// })

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
      const progress = (progressEvent.loaded / progressEvent.total) * 100
      console.log(`上传进度：${progress}%`)
      // Todo 引入进度条组件
    }
  })
      .then((response) => {
        console.log('上传成功', response)
      })
      .catch((error) => {
        console.log('上传失败', error)
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
      <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
      <div class="el-upload__text">
        将文件拖到此处，或 <em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          支持文件类型：zip, rar
        </div>
      </template>
    </el-upload>
  </div>
</template>

<style scoped>

</style>
