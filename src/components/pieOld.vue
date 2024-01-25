<template>
  <!-- echarts 的容器 -->
  <div ref="divRef" :style="{ width: width, height: height }"></div>
</template>

<script setup>
import { onMounted, watch, ref, defineProps } from 'vue'
import useEchart from '../hooks/useEchart'
import { getOldUserList } from '../api/oldUser'
const props = defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '100%'
  },
  echartDatas: {
    type: Array,
    default: function () {
      return []
    }
  }
})

// 获取用户列表
const userList = ref([])
const healthStatus = ref([])
const getAct = async () => {
  const res = await getOldUserList()
  console.log(res.data, '###')
  userList.value = res.data
  userList.value.forEach((item) => {
    console.log(item)
    healthStatus.value.push(item.healthStatus)
    console.log(healthStatus.value)
    const res = Array.from(healthStatus.value)
    console.log(res)
    const result = res.reduce((acc, currentValue) => {
      const existingItem = acc.find((item) => item.name === currentValue)

      if (existingItem) {
        existingItem.value += 1
      } else {
        acc.push({ value: 1, name: currentValue })
      }

      return acc
    }, [])
    console.log(result)
    window.localStorage.setItem('healthStatus', JSON.stringify(result))
  })
}

// 拿到dom对象
const divRef = ref(null)
let hyChart = null

// 监听 echartDatas 的变化
watch(
  () => props.echartDatas,
  (newV, oldV) => {
    setupEchart(newV)
  }
)

onMounted(() => {
  getAct()
  setupEchart(props.echartDatas) // 第一次走这里
})

function setupEchart(echartDatas = []) {
  if (!hyChart) {
    hyChart = useEchart(divRef.value)
  }
  const option = getOption(echartDatas) // 准备数据
  hyChart.setOption(option)
}

function getOption(echartDatas) {
  const option = {
    title: {
      text: '健康状态',
      top: '5%',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      left: 'center'
    },
    color: ['#67c23a', '#e6a23c', '#f56c6c', '#f56c6c'],
    series: [
      {
        name: '健康状态',
        type: 'pie',
        radius: '50%',
        data: JSON.parse(window.localStorage.getItem('healthStatus'))
      }
    ]
  }
  return option
}
</script>

<style lang="less" scoped></style>
