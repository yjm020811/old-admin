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
    <el-table :data="tableData" style="width: 100%" border stripe>
      <el-table-column type="index" label="序号" />
      <el-table-column prop="id" label="ID" align="center" />
      <el-table-column prop="realName" label="真名" align="center" />
      <el-table-column prop="nickName" label="微信昵称" align="center" />
      <el-table-column prop="phoneNumber" label="电话号码" align="center" />
      <el-table-column prop="age" label="年龄" align="center" />
      <el-table-column prop="gender" label="性别" align="center" />
      <el-table-column prop="healthStatus" label="健康状态" align="center">
        <template #default="scope">
          <el-tag
            effect="dark"
            :type="getTagType(scope.row.healthStatus)"
            v-if="scope.row.healthStatus"
          >
            {{ scope.row.healthStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="180">
        <template #default="scope">
          <el-button
            type="primary"
            :icon="Edit"
            size="small"
            @click="handleClick(scope.row)"
            >编辑</el-button
          >
          <el-popconfirm title="确定删除吗?" @confirm="deleteAction(scope.row)">
            <template #reference>
              <el-button size="small" type="danger" :icon="Delete"
                >删除</el-button
              >
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="编辑" width="30%">
      <el-form :model="form" ref="editFormRef" label-width="70px">
        <el-form-item label="ID">
          <el-input v-model="form.id" disabled autocomplete="off" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickName" disabled autocomplete="off" />
        </el-form-item>
        <el-form-item label="真名">
          <el-input v-model="form.realName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phoneNumber" autocomplete="off" />
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="form.age" autocomplete="off" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="value" placeholder="请选择性别">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="健康状态">
          <el-select v-model="value1" placeholder="请选择健康状态">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="changeUserInfo"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import pieOld from '@/components/pieOld.vue'
import agePie from '@/components/agePie.vue'
import myMap from '@/components/myMap.vue'
import { getOldUserList, editProfile, deleteUser } from '@/api/oldUser'
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 获取用户的数据
const tableData = ref([])
const getTableData = async () => {
  const res = await getOldUserList()
  console.log(res.data)
  tableData.value = res.data
}
getTableData()

// 编辑用户的信息
const dialogVisible = ref(false)
const form = ref({
  id: '',
  realName: '',
  nickName: '',
  phoneNumber: '',
  age: '',
  gender: '',
  healthStatus: ''
})

const value = ref('')
const options = [
  {
    value: '男',
    label: '男'
  },
  {
    value: '女',
    label: '女'
  }
]

const value1 = ref('')
const options1 = [
  {
    value: '优',
    label: '优'
  },
  {
    value: '良',
    label: '良'
  },
  {
    value: '及格',
    label: '及格'
  },
  {
    value: '差劲',
    label: '差劲'
  }
]
const handleClick = (scope) => {
  dialogVisible.value = true
  console.log(form.value)
  form.value.id = scope.id
  form.value.realName = scope.realName
  form.value.nickName = scope.nickName
  form.value.phoneNumber = scope.phoneNumber
  form.value.age = scope.age
  value.value = scope.gender
  value1.value = scope.healthStatus
}

// 请求接口修改
const editFormRef = ref(null)
const changeUserInfo = async () => {
  console.log(form.value)
  const res = await editProfile({
    id: form.value.id,
    realName: form.value.realName,
    phoneNumber: form.value.phoneNumber,
    age: form.value.age,
    address: form.value.address,
    gender: value.value,
    healthStatus: value1.value
  })
  console.log(res)
  dialogVisible.value = false
  getTableData()
  ElMessage.success('编辑信息成功')
}

// 删除操作
const deleteAction = async (scope) => {
  console.log(scope.id)
  const res = await deleteUser({
    id: scope.id
  })
  console.log(res)
  getTableData()
  ElMessage.success('删除用户成功')
}

const getTagType = (healthStatus) => {
  switch (healthStatus) {
    case '优':
      return 'success'
    case '良':
      return 'warning'
    case '及格':
      return 'danger'
    case '差劲':
      return 'danger'
    default:
      return 'info'
  }
}
</script>

<style scoped>
.data-screen {
  display: flex;
}
:deep(.el-select) {
  width: 100%;
}
</style>
