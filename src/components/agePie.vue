<!-- 性别的饼图 -->
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

// 拿到dom对象
const divRef = ref(null)
let hyChart = null

// 获取用户列表
const userList = ref([])
const getAct = async () => {
  const res = await getOldUserList()
  console.log(res.data, '###')
  userList.value = res.data
  const res1 = formatData(userList.value)
  console.log(res1)
  window.localStorage.setItem('res1', JSON.stringify(res1))
}

const formatData = (a) => {
  console.log(a, '123')
  // 初始化男女计数
  const maleCount = ref(0)
  const femaleCount = ref(0)
  a.forEach((person) => {
    if (person.gender === '男') {
      maleCount.value++
    } else if (person.gender === '女') {
      femaleCount.value++
    }
  })
  // 构造返回结果数组
  const resultArray = [
    { value: maleCount.value, name: '男' },
    { value: femaleCount.value, name: '女' }
  ]
  return resultArray
}

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
      text: '用户性别'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      left: 'center'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: JSON.parse(window.localStorage.getItem('res1'))
      }
    ]
  }
  return option
}
</script>

<style lang="less" scoped></style>
