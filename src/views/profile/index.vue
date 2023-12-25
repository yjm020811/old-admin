<template>
  <el-card class="box-card" v-if="userStore.userProfile !== null">
    <template #header>
      <div class="card-header">
        <span>个人信息</span>
      </div>
    </template>
    <div class="content">
      <div class="left">
        <img :src="userStore.userProfile?.data?.avatar" alt="" />
      </div>
      <div class="right">
        <div class="top">
          {{ greeting }}，{{
            userStore.userProfile?.data?.username
          }}，生活变的再糟糕，也不妨碍我变得更好！
        </div>
        <div class="bottom">
          <div>
            <span> 昵称：</span>{{ userStore.userProfile?.data?.username }}
          </div>
          <div>
            <span> 电话号码：</span>{{ userStore.userProfile?.data?.phone }}
          </div>
          <div><span>日期：</span>{{ formateTime(currentTime) }}</div>
        </div>
      </div>
    </div>
  </el-card>

  <el-card class="box-card" style="margin-top: 40px">
    <template #header>
      <div class="card-header">
        <span>密码修改</span>
      </div>
    </template>
    <div class="changePwd" style="display: flex; padding: 0 50px">
      <div style="flex: 1; margin-right: 20px">
        <el-input
          v-model="oldPassword"
          placeholder="请输入旧密码"
          show-password
        >
          <template #prepend>旧密码</template>
        </el-input>
      </div>
      <div style="flex: 1">
        <el-input
          v-model="newPassword"
          placeholder="请输入新密码"
          show-password
        >
          <template #prepend>新密码</template>
        </el-input>
      </div>
    </div>
    <div class="changeBtn">
      <el-button type="primary" @click="changePwd">点击修改密码</el-button>
    </div>
  </el-card>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '../../store/modules/user'
import { changePassword } from '../../api/user'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { removeItem } from '../../utils/storage'
const router = useRouter()
const userStore = useUserStore()
console.log(userStore)

const formateTime = (e) => {
  return dayjs(e).format('YYYY-MM-DD  HH:mm:ss')
}

const currentTime = ref(new Date())

const updateTime = () => {
  currentTime.value = new Date()
}
console.log(formateTime(currentTime.value))
const greeting = computed(() => {
  const currentHour = currentTime.value.getHours()

  if (currentHour >= 0 && currentHour < 12) {
    return '上午好！'
  } else if (currentHour >= 12 && currentHour < 18) {
    return '下午好！'
  } else {
    return '晚上好！'
  }
})

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})

// 密码修改
const oldPassword = ref('')
const newPassword = ref('')

const changePwd = async () => {
  try {
    const res = await changePassword({
      oldPassword: oldPassword.value,
      newPassword: newPassword.value
    })
    console.log(res)
    if (res.code === 200) {
      ElMessage.success('修改成功')
      router.push('/login')
      removeItem('token')
    } else {
      ElMessage.error('修改失败')
    }
  } catch (error) {
    ElMessage.error('修改失败')
  }
}
</script>
<style scoped>
.content {
  display: flex;
  width: 80%;
}
.left {
  width: 20%;
}
.right {
  margin-left: 40px;
  .top {
    margin-bottom: 50px;
  }
}
.top {
  font-size: 20px;
}
.bottom {
  font-size: 16px;
  span {
    color: #909399;
    display: inline-block;
    width: 80px;
    margin-bottom: 10px;
  }
}
.changeBtn {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
