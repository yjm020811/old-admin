<template>
  <div style="width: 50%; height: 500px">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <div style="text-align: center; font-weight: 800; font-size: 22px">
            社区养老后台管理系统
          </div>
        </div>
      </template>
      <div class="text">
        社区总人数：
        <span ref="count1Ref" style="font-size: 24px"></span>
        <br />
        <div style="position: relative; top: 20px; margin-bottom: 20px">
          优良健康状态占比:
          <span ref="count2Ref" style="font-size: 24px"></span>
          %
        </div>
      </div>
    </el-card>
    <div style="text-align: center">
      <img
        src="../assets/old.jpg"
        alt=""
        style="height: 180px; margin-top: 20px"
      />
    </div>
  </div>
</template>
<script setup>
import { CountUp } from 'countup.js'
import { ref, onMounted } from 'vue'
import { getOldUserList } from '../api/oldUser'

const count1Ref = ref(null)
const count2Ref = ref(null)
const userList = ref([])
const getUser = async () => {
  const res = await getOldUserList()
  userList.value = res.data
  const favorableCount = userList.value.filter(
    (item) => item.healthStatus === '优' || item.healthStatus === '良'
  ).length
  console.log(favorableCount)
  const ratio = ((favorableCount / userList.value.length) * 100).toFixed(2)
  console.log(ratio)
  const countup1 = new CountUp(count1Ref.value, userList.value.length)
  countup1.start()
  const countup2 = new CountUp(count2Ref.value, ratio)
  countup2.start()
}

onMounted(() => {
  getUser()
})
</script>
<style scoped>
.text {
  text-align: center;
}
</style>
