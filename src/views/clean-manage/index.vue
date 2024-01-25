<template>
  <div class="top">
    <div class="search">
      <el-input
        v-model="searchAct"
        class="w-50 m-2"
        placeholder="请输入家政姓名"
        @input="findAct"
      >
        <template #suffix>
          <el-icon class="el-input__icon"><search /></el-icon>
        </template>
      </el-input>
    </div>
    <div class="add">
      <el-button type="success" :icon="Edit" @click="dialogVisible1 = true">
        新增家政
      </el-button>

      <el-dialog
        append-to-body
        v-model="dialogVisible1"
        title="新增家政"
        width="30%"
        :before-close="handleClose1"
      >
        <div class="addForm">
          <el-form
            :model="addForm"
            label-width="80"
            ref="addFormRef"
            :rules="addFormRules"
          >
            <el-form-item label="家政姓名" prop="username">
              <el-input v-model="addForm.username" />
            </el-form-item>

            <el-form-item label="价格" label-width="80" prop="price">
              <el-input v-model="addForm.price" />
            </el-form-item>
            <el-form-item label="工作时间" label-width="80" prop="workTime">
              <el-input v-model="addForm.workTime" />
            </el-form-item>
            <el-form-item label="工作照" label-width="80" prop="avatar">
              <el-image :src="cleaners" v-if="success"> </el-image>
              <el-upload
                v-if="!success"
                class="avatar-uploader"
                style="position: relative; right: 40px"
                action="http://localhost:3000/my/house/uploadCleaners"
                :show-file-list="false"
                :data="{ id: editId }"
                name="img"
                :on-success="handleSuccess1"
              >
                <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible1 = false">取消</el-button>
            <el-button type="primary" @click="addAc"> 确定 </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
  <MyTable
    :tableData="tableData"
    :options="options"
    :total="total"
    elementLoadingText="加载中，请等待！"
    :currentPage="currentPage"
    :pageSize="pageSize"
    :pageSizes="pageSizes"
    pagination
    :elementLoadingIcon="svg"
    @sizeChange="sizeChange"
    @handleCurrentChange="handleCurrentChange"
  >
    <template #avatar="{ scope }">
      <img :src="scope.row.avatar" alt="" style="width: 50px; height: 80px" />
    </template>

    <!-- 自定义编辑区域 -->
    <template #action="{ scope }">
      <div class="action">
        <div class="edit">
          <el-button
            type="primary"
            size="small"
            :icon="Edit"
            @click="edit(scope)"
          >
            编辑
          </el-button>
        </div>
        <div class="delete">
          <el-popconfirm title="确定删除吗?" @confirm="deleteAction(scope)">
            <template #reference>
              <el-button size="small" type="danger" :icon="Delete"
                >删除</el-button
              >
            </template>
          </el-popconfirm>
        </div>
      </div>
    </template>
  </MyTable>

  <el-dialog
    v-model="dialogVisible2"
    title="编辑家政"
    width="30%"
    :before-close="handleClose2"
  >
    <div class="form">
      <el-form :model="editContent" ref="editFormRef" :rules="editFormRules">
        <el-form-item label="活动姓名" prop="username" label-width="80">
          <el-input v-model="editContent.username" />
        </el-form-item>
        <el-form-item label="价格" prop="price" label-width="80">
          <el-input v-model="editContent.price" />
        </el-form-item>
        <el-form-item label="工作时间" prop="workTime" label-width="80">
          <el-input v-model="editContent.workTime" />
        </el-form-item>
        <el-form-item label="工作照" prop="avatar" label-width="80">
          <el-image
            :src="editContent.avatar"
            style="width: 70px; height: 80px"
          />
          <el-upload
            class="avatar-uploader"
            action="http://localhost:3000/my/house/upload"
            :show-file-list="false"
            :data="{ id: editId }"
            name="img"
            :before-upload="beforeAvatarUpload"
            :on-success="handleSuccess"
          >
            <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="updateConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import MyTable from '../../components/MyTable'
import {
  getAllCleaners,
  deleteCleaners,
  changeCleaners,
  addCleaners,
  getCleanerByName,
  uploadAvatar
} from '../../api/clean'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Delete, Edit, Plus } from '@element-plus/icons-vue'
import _ from 'lodash'
import { deepEqual } from '../../utils/objectEqualls'

// el-table的data数据
onMounted(() => {
  getActivity()
})

// 设置分页的属性
const currentPage = ref(1)
const pageSizes = ref([5, 10, 15])
const pageSize = ref(10)
const tableData = ref([])
const total = ref(0)
//  条件查询
const srcList = ref([])
const getActivity = async () => {
  const res = await getAllCleaners({
    page: currentPage.value,
    limit: pageSize.value
  })
  console.log(res, '获取到的table')

  if (res && res.data) {
    tableData.value = res.data
  }

  //  查询所有的值
  const res1 = await getAllCleaners()
  console.log(res1)
  srcList.value = res1.data.map((item) => item.avatar)

  if (res1 && res1.data) {
    total.value = res1.total
  }
}

// 点击设置每页条数
const sizeChange = async (val) => {
  console.log(val)
  pageSize.value = val
  const res = await getAllCleaners({
    page: currentPage.value,
    limit: pageSize.value
  })
  console.log(res)
  tableData.value = res.data
}

const handleCurrentChange = async (val) => {
  console.log(val, '当前页数')
  currentPage.value = val
  const res = await getAllCleaners({
    page: currentPage.value,
    limit: pageSize.value
  })
  console.log(res)
  tableData.value = res.data
}

// el-table-column配置
const options = [
  {
    label: '家政id',
    prop: 'id',
    width: 80
  },
  {
    label: '姓名',
    prop: 'username'
  },
  {
    label: '价格',
    prop: 'price'
  },
  {
    label: '工作时间',
    prop: 'workTime'
  },
  // 在table的末尾的操作列设置插槽
  {
    label: '工作照',
    prop: 'avatar',
    slot: 'avatar'
  },
  {
    label: '操作',
    align: 'center',
    action: true,
    width: 160
  }
]

// 编辑表格数据
const editContent = reactive({
  username: '',
  price: '',
  workTime: ''
})

// 复制一份
const copyData = ref(null)
const editId = ref(null)
const edit = (scope) => {
  console.log('编辑表格', scope.row)
  // 复制数据
  copyData.value = scope.row
  console.log('复制的数据', copyData.value)
  editId.value = scope.row.id
  editContent.username = scope.row.username
  // 类别
  editContent.price = scope.row.price
  editContent.workTime = scope.row.workTime
  editContent.avatar = scope.row.avatar
  dialogVisible2.value = true
}

// 删除表格数据
const deleteAction = async (scope) => {
  try {
    console.log('删除表格', scope.row.id)
    const res = await deleteCleaners({
      id: scope.row.id
    })
    console.log(res)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      getActivity()
    }
  } catch (error) {
    console.log(error)
  }
}

// 修改form数据
// 编辑表格的rules
const editFormRules = reactive({
  username: [
    { required: true, message: '请输入活动名称', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在2-10字', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请选择活动开始时间', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在2-10字', trigger: 'blur' }
  ],
  workTime: [
    { required: true, message: '请输入活动类别', trigger: 'blur' },
    { min: 2, max: 15, message: '长度在2-15字', trigger: 'blur' }
  ]
})
const editFormRef = ref(null)
const dialogVisible2 = ref(false)
const updateConfirm = async () => {
  editFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await changeCleaners({
          id: editId.value,
          username: editContent.username,
          price: editContent.price,
          workTime: editContent.workTime
        })
        delete copyData.value.id
        console.log(copyData.value)
        console.log(editContent)

        const isEqual = ref(deepEqual(copyData.value, editContent))
        console.log(isEqual)
        if (res.code === 200 && isEqual.value === false) {
          console.log(res)
          ElMessage.success('修改成功')
          dialogVisible2.value = false
          isEqual.value = null
          getActivity()
        } else if (isEqual.value === true) {
          ElMessage.warning('没有修改')
          isEqual.value = null
        } else {
          ElMessage.error('修改失败')
        }
        dialogVisible2.value = false
      } catch (error) {
        ElMessage.error('修改失败')
        console.log(error)
      }
    } else {
      ElMessage({
        message: '修改失败',
        grouping: true,
        type: 'error'
      })
      return false
    }
  })
}

// 新增活动
const addForm = reactive({
  username: '',
  price: '',
  workTime: ''
})
const addFormRules = reactive({
  username: [
    { required: true, message: '请输入家政姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在2-10字', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请选择家政价格', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在2-10字', trigger: 'blur' }
  ],
  workTime: [
    { required: true, message: '请输入工作时间', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在2-10字', trigger: 'blur' }
  ]
  // avatar: [
  //   { required: true, message: '请上传文件', trigger: 'change' } // 规则可根据实际情况调整
  // ]
})
const addFormRef = ref(null)
const dialogVisible1 = ref(false)

// 新增活动
const addAc = async () => {
  addFormRef.value.validate(async (valid) => {
    if (valid) {
      console.log('验证通过')
      try {
        const res = await addCleaners({
          username: addForm.username,
          price: addForm.price,
          workTime: addForm.workTime,
          avatar: cleaners.value
        })
        console.log(res)
        if (res.code === 200) {
          ElMessage.success('添加成功')
          resetForm(addForm)
          dialogVisible1.value = false
          getActivity()
        } else {
          ElMessage.error('添加失败')
        }
      } catch (error) {
        ElMessage.error('添加失败')
        console.log(error)
      }
    } else {
      ElMessage({
        message: '请填写完整',
        grouping: true,
        type: 'error'
      })
      return false
    }
  })
}

const handleClose1 = () => {
  ElMessageBox.confirm('确定关闭吗?')
    .then(() => {
      dialogVisible1.value = false
      resetForm(addForm)
    })
    .catch((error) => {
      console.log(error)
    })
}
const handleClose2 = () => {
  ElMessageBox.confirm('确定关闭吗?')
    .then(() => {
      dialogVisible2.value = false
      resetForm(addForm)
    })
    .catch((error) => {
      console.log(error)
    })
}

// 搜索活动
const searchAct = ref('')
const findAct = _.debounce(async (e) => {
  try {
    console.log(e)
    const res = await getCleanerByName({
      username: e
    })
    console.log(res)
    if (res.code === 200) {
      ElMessage.success('搜索成功')
      tableData.value = res.data
    } else if (res.code === 201) {
      ElMessage({
        message: '没有搜索到对应的活动',
        grouping: true,
        type: 'error'
      })
    }
  } catch (error) {
    ElMessage({
      message: '没有搜索到对应的活动',
      grouping: true,
      type: 'error'
    })
    console.log(error)
  }
}, 200)

// 置空表单的函数
const resetForm = (addForm) => {
  Object.keys(addForm).forEach((key) => {
    delete addForm[key]
  })
}

// 上传图片
const file1 = ref()
const beforeAvatarUpload = (file) => {
  console.log(file)
}

// 上传成功的回调
const handleSuccess = async (response, file) => {
  file1.value = file.name
  console.log(response)
  editContent.avatar = response.data.avatarUrl
  console.log(response)
  ElMessage.success('切换工作照成功')
  dialogVisible2.value = false
  const res = await getAllCleaners()
  if (res && res.data) {
    tableData.value = res.data
  }
}

// 新增家政
const cleaners = ref()
const success = ref(false)
const handleSuccess1 = async (response, file) => {
  // 上传成功
  console.log(response, file)
  cleaners.value = response.data.avatarUrl
  if (response.code === 200) {
    success.value = true
  }
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
.action {
  display: flex;
  align-items: center;
  justify-content: center;
}
.edit,
.delete,
.add {
  margin-left: 5px;
}
svg {
  width: 1em;
  height: 1em;
}
:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
  width: 100%;
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}

.avatar-uploader {
  margin-left: 40px;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  text-align: center;
}
</style>
