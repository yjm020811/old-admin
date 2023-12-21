<template>
  <div class="container">
    <!-- 登录 -->
    <div v-if="isLogin">
      <el-form :model="loginForm" ref="loginFormRef" :rules="loginRules">
        <h2>社区养老后台管理系统</h2>
        <el-form-item label="用户名" label-width="80px" prop="username">
          <el-input type="text" placeholder="请输入用户名" v-model="loginForm.username" required>
            <template #prepend>
              <svgIcon icon="user"></svgIcon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="80px" prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="loginForm.password" required show-password>
            <template #prepend>
              <svgIcon icon="password"></svgIcon>
            </template>
          </el-input>
        </el-form-item>

        <el-button @click.prevent="submitForm" :loading="loading">登录</el-button>
        <el-button @click="register">前往注册</el-button>
      </el-form>
    </div>

    <!-- 注册 -->
    <div v-if="!isLogin">
      <el-form :model="registerForm" ref="registerFormRef" :rules="registerRules">
        <h2>社区养老后台管理系统</h2>
        <el-form-item label="用户名" label-width="80px" prop="username">
          <el-input type="text" placeholder="请输入用户名" v-model="registerForm.username" required>
            <template #prepend>
              <svgIcon icon="user"></svgIcon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="80px" prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="registerForm.password" required show-password>
            <template #prepend>
              <svgIcon icon="password"></svgIcon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号码" label-width="80px" prop="phone">
          <el-input type="text" placeholder="请输入手机号码" v-model="registerForm.phone" required>
            <template #prepend>
              <svgIcon icon="phone"></svgIcon>
            </template>
          </el-input>
        </el-form-item>

        <el-button @click="registerAction" :loading="loading">注册</el-button>
        <!-- <el-button @click="backToLogin">返回登录</el-button> -->
        <div class="backLogin">
          <el-link type="success" @click="backToLogin">返回登录</el-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { validatePassword } from './rules'
import { useUserStore } from '../../store/modules/user'
import { ElMessage } from 'element-plus'
import { registerAxios } from '../../api/user'
// 属于登录还是注册
const isLogin = ref(true)

// 数据源
const loginForm = ref({
  username: 'superadmin',
  password: '123456'
})

// 登录验证规则
const loginRules = ref({
  username: [
    {
      required: true,
      trigger: 'blur',
      message: '用户名为必填项'
    }
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      validator: validatePassword()
    }
  ]
})

// 登录
const loading = ref(false)
const userStore = useUserStore()
const loginFormRef = ref(null)
const submitForm = () => {
  // 表单检验
  loginFormRef.value.validate(async (valid) => {
    if (!valid) return
    // 触发登录
    loading.value = true
    await userStore.loginAction(loginForm.value)
    ElMessage.success('登录成功!')
    loading.value = false
  })
}

// 注册
// 注册数据源
const registerForm = ref({
  username: '',
  password: '',
  phone: ''
})

// 注册验证规则
const registerRules = ref({
  username: [
    {
      required: true,
      trigger: 'blur',
      message: '用户名为必填项'
    }
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      validator: validatePassword()
    }
  ],
  phone: [
    {
      required: true,
      trigger: 'blur',
      message: '手机号为必填项'
    }
  ]
})

// 登录页前往注册
const register = () => {
  isLogin.value = false
}

// 注册的事件处理函数
const registerFormRef = ref(null)
const registerAction = () => {
  registerFormRef.value.validate(async (valid) => {
    if (!valid) return
    // 触发注册
    const res = await registerAxios(registerForm.value)
    console.log(registerForm.value)
    console.log(res)
    ElMessage.success('注册成功!')
  })
}

// 返回登录页
const backToLogin = () => {
  isLogin.value = true
}

</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* 让容器铺满整个视口高度 */
  background-color: #282c34;
}

.el-form {
  width: 600px;
  align-items: center;
  margin: 0 auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;

  h2 {
    margin-bottom: 20px;
  }
}

.el-button {
  width: 200px;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.backLogin {
  display: flex;
  justify-content: flex-end;
}
</style>
