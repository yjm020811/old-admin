<template>
  <div class="data-screen">
    <!-- 年龄饼图 -->
    <agePie height="500px" width="30%" />
    <!-- 活动地图 -->
    <myMap height="500px" width="40%" />
    <!-- 性别柱状图 -->
    <pieOld height="500px" width="30%" />
  </div>
  <div class="userTable">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="Date" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="address" label="Address" />
    </el-table>
  </div>
</template>
<script setup>
import pieOld from '@/components/pieOld.vue'
import agePie from '@/components/agePie.vue'
import myMap from '@/components/myMap.vue'
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }
]
</script>
<style scoped>
.data-screen {
  display: flex;
}
</style>
