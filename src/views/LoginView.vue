<script setup>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useUserStore } from '@/stores/user'
import { login } from "@/api/user.js";
import {useRouter} from "vue-router";

const router = useRouter()

// 创建一个登录表单的响应式对象
const loginForm = reactive({
  username: "",
  password: "",
});

// 创建表单的引用
const loginFormRef = ref();

// 定义表单校验规则
const rules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

// 登录逻辑
const handleLogin = () => {
  loginFormRef.value?.validate((valid) => {
    if (valid) {
      const { username, password} = loginForm
      const data = {
        username,
        password
      }
      console.log(data)
      login(data).then(res => {
        const token = res.data
        console.log(res)
        if (res.success) {
          ElMessage.success("登录成功！");
          useUserStore().setUserInfo({username, token})
          router.push('/home')
        } else {
          ElMessage.error(res.msg);
        }
      }).catch(err => {
        ElMessage.error(err);
      })
    } else {
      ElMessage.error("请完善登录信息");
    }
  });
};
</script>

<template>
  <div id="login" class="box">
    <div class="content">
      <div class="login-wrapper">
        <h1>肺CT图像处理分析系统</h1>
        <el-form
            :model="loginForm"
            :rules="rules"
            ref="loginFormRef"
            class="login-form"
            label-width="80px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名"
                ref="username"
            />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
                v-model="loginForm.password"
                placeholder="请输入密码"
                ref="password"
                show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button
                type="primary"
                class="login-btn"
                @click="handleLogin"
                block
            >
              登 录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>


<style scoped>
* {
  margin: 0;
  padding: 0;
}

.box {
  width: 100vw;
  height: 100vh;
  background-color: rgb(29, 67, 89);
}

.content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.login-wrapper {
  width: 450px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: rgb(81, 100, 115);
}

.login-form {
  .el-form-item {
    margin-bottom: 20px;
  }

  .login-btn {
    height: 40px;
    width: 120px;
    margin-left: 60px;
  }
}
</style>
