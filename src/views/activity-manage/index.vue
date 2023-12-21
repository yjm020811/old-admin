<template>
  <MyTable :tableData="tableData" :options="options" :total="total" elementLoadingText="加载中，请等待！"
    :currentPage="currentPage" :pageSize="pageSize" :pageSizes="pageSizes" pagination :elementLoadingIcon="svg"
    @sizeChange="sizeChange" @handleCurrentChange="handleCurrentChange">
    <template #activityStartTime="{ scope }">
      {{ new Date(scope.row.activityStartTime).toLocaleString() }}
    </template>
    <template #releaseTime="{ scope }">
      {{ new Date(scope.row.releaseTime).toLocaleString() }}
    </template>

    <!-- 自定义编辑区域 -->
    <template #action="{ scope }">
      <el-button size="small" type="primary" @click="edit(scope)">编辑</el-button>
      <el-button size="small" type="danger" @click="deleteAction(scope)">删除</el-button>
    </template>
  </MyTable>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MyTable from '../../components/MyTable'
import { getActivityList } from '../../api/user'

// el-table的data数据
onMounted(() => {
  getActivity()
})

// 设置分页的属性
const currentPage = ref(1)
const pageSizes = ref([5, 8, 15])
const pageSize = ref(8)
const tableData = ref([])
const total = ref(0)
//  条件查询
const getActivity = async () => {
  const res = await getActivityList({
    page: currentPage.value,
    limit: pageSize.value
  })
  console.log(res, '获取到的table')

  if (res && res.data) {
    tableData.value = res.data
  }

  //  查询所有的值
  const res1 = await getActivityList()
  console.log(res1)
  if (res1 && res1.data) {
    total.value = res1.total
  }
}

// 点击设置每页条数
const sizeChange = async (val) => {
  console.log(val)
  pageSize.value = val
  const res = await getActivityList({
    page: currentPage.value,
    limit: pageSize.value
  })
  console.log(res)
  tableData.value = res.data
}

const handleCurrentChange = async (val) => {
  console.log(val, '当前页数')
  currentPage.value = val
  const res = await getActivityList({
    page: currentPage.value,
    limit: pageSize.value
  })
  console.log(res)
  tableData.value = res.data
}

// el-table-column配置
const options = [
  {
    label: '活动名称',
    prop: 'activityName',
    align: 'center',
    width: 300,
    edit: true
  },
  {
    label: '开始时间',
    prop: 'activityStartTime',
    align: 'center',
    slot: 'activityStartTime'
  },
  {
    label: '地址',
    prop: 'address',
    align: 'center'
  },
  // 在table的末尾的操作列设置插槽
  {
    label: '类别',
    prop: 'activityDesc',
    align: 'center'
  },
  {
    label: '发布时间',
    prop: 'releaseTime',
    align: 'center',
    slot: 'releaseTime'
  },
  {
    label: '操作',
    align: 'center',
    action: true
  }
]

// 编辑表格数据
const edit = (scope) => {
  console.log('编辑表格', scope.row)
}

// 删除表格数据
const deleteAction = (scope) => {
  console.log('删除表格', scope.row)
}

// svg
const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `
</script>

<style scoped>
svg {
  width: 1em;
  height: 1em;
}
</style>
