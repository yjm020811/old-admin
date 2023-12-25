<template>
  <div class="top">
    <div class="search">
      <el-input
        v-model="searchAct"
        class="w-50 m-2"
        placeholder="请输入新闻姓名"
        @input="findAct"
      >
        <template #suffix>
          <el-icon class="el-input__icon"><search /></el-icon>
        </template>
      </el-input>
    </div>
    <div class="add">
      <el-button type="success" :icon="Edit" @click="dialogVisible1 = true">
        新增新闻
      </el-button>

      <el-dialog
        append-to-body
        v-model="dialogVisible1"
        title="新增新闻"
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
            <el-form-item label="新闻名" prop="newsName">
              <el-input v-model="addForm.newsName" />
            </el-form-item>

            <el-form-item label="新闻内容" label-width="80" prop="newsContent">
              <el-input v-model="addForm.newsContent" />
            </el-form-item>
            <el-form-item label="图片" label-width="80" prop="img">
              <el-input v-model="addForm.img" />
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
    <template #releaseTime="{ scope }">
      {{ formatDateTime(scope.row.releaseTime) }}
    </template>

    <template #img="{ scope }">
      <img :src="scope.row.img" alt="" style="width: 50px; height: 80px" />
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
    title="编辑新闻"
    width="30%"
    :before-close="handleClose2"
  >
    <div class="form">
      <el-form :model="editContent" ref="editFormRef" :rules="editFormRules">
        <el-form-item label="新闻名" prop="newsName" label-width="80">
          <el-input v-model="editContent.newsName" />
        </el-form-item>
        <el-form-item label="新闻内容" prop="newsContent" label-width="80">
          <el-input v-model="editContent.newsContent" />
        </el-form-item>
        <el-form-item label="图片" prop="img" label-width="80">
          <el-input v-model="editContent.img" />
        </el-form-item>
        <el-form-item label="发布时间" prop="releaseTime" label-width="80">
          <el-date-picker
            v-model="editContent.releaseTime"
            type="date"
            placeholder="选择日期"
            size="default"
          />
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
  getAllNews,
  deleteNews,
  changeNews,
  addNews,
  getNewsByName
} from '../../api/news'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Delete, Edit } from '@element-plus/icons-vue'
import _ from 'lodash'
import { deepEqual } from '../../utils/objectEqualls'
import { formatDateTime } from '../../utils/day'

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

const getActivity = async () => {
  const res = await getAllNews({
    page: currentPage.value,
    limit: pageSize.value
  })
  console.log(res, '获取到的table')

  if (res && res.data) {
    tableData.value = res.data
  }

  //  查询所有的值
  const res1 = await getAllNews()
  console.log(res1)
  // srcList.value = res1.data.map((item) => item.avatar)

  if (res1 && res1.data) {
    total.value = res1.total
  }
}

// 点击设置每页条数
const sizeChange = async (val) => {
  console.log(val)
  pageSize.value = val
  const res = await getAllNews({
    page: currentPage.value,
    limit: pageSize.value
  })
  console.log(res)
  tableData.value = res.data
}

const handleCurrentChange = async (val) => {
  console.log(val, '当前页数')
  currentPage.value = val
  const res = await getAllNews({
    page: currentPage.value,
    limit: pageSize.value
  })
  console.log(res)
  tableData.value = res.data
}

// el-table-column配置
const options = [
  {
    label: '新闻id',
    prop: 'id',
    width: 80
  },
  {
    label: '新闻名',
    prop: 'newsName'
  },
  {
    label: '新闻内容',
    prop: 'newsContent'
  },
  {
    label: '图片',
    prop: 'img',
    slot: 'img'
  },
  {
    label: '发布时间',
    prop: 'releaseTime',
    slot: 'releaseTime'
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
  newsName: '',
  newsContent: '',
  img: '',
  releaseTime: ''
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
  editContent.newsName = scope.row.newsName
  // 类别
  editContent.newsContent = scope.row.newsContent
  editContent.img = scope.row.img
  editContent.releaseTime = scope.row.releaseTime
  dialogVisible2.value = true
}

// 删除表格数据
const deleteAction = async (scope) => {
  try {
    console.log('删除表格', scope.row.id)
    const res = await deleteNews({
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
  newsName: [
    { required: true, message: '请输入新闻名', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在2-100字', trigger: 'blur' }
  ],
  newsContent: [{ required: true, message: '请选择新闻内容', trigger: 'blur' }],
  img: [{ required: true, message: '请输入图片', trigger: 'blur' }],
  releaseTime: [
    { required: true, message: '请输入新闻发布时间', trigger: 'blur' }
  ]
})
const editFormRef = ref(null)
const dialogVisible2 = ref(false)
const updateConfirm = async () => {
  editFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await changeNews({
          newsName: editContent.newsName,
          newsContent: editContent.newsContent,
          img: editContent.img,
          releaseTime: editContent.releaseTime,
          id: editId.value
        })
        delete copyData.value.id
        console.log(copyData.value)
        console.log('编辑数据', editContent)

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
  newsName: '',
  newsContent: '',
  img: ''
})
const addFormRules = reactive({
  newsName: [
    { required: true, message: '请输入新闻名', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在2-100字', trigger: 'blur' }
  ],
  newsContent: [{ required: true, message: '请选择新闻内容', trigger: 'blur' }],
  img: [{ required: true, message: '请输入图片', trigger: 'blur' }]
})
const addFormRef = ref(null)
const dialogVisible1 = ref(false)

// 新增新闻
const addAc = async () => {
  addFormRef.value.validate(async (valid) => {
    if (valid) {
      console.log('验证通过')
      console.log(addForm)
      try {
        const res = await addNews({
          newsName: addForm.newsName,
          newsContent: addForm.newsContent,
          img: addForm.img
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
    const res = await getNewsByName({
      newsName: e
    })
    console.log(res)
    if (res.code === 200) {
      // ElMessage.success('搜索成功')
      tableData.value = res.data
    } else if (res.code === 201) {
      ElMessage({
        message: '没有搜索到对应的新闻',
        grouping: true,
        type: 'error'
      })
    }
  } catch (error) {
    ElMessage({
      message: '没有搜索到对应的新闻',
      grouping: true,
      type: 'error'
    })
    console.log(error)
  }
}, 1000)

// 置空表单的函数
const resetForm = (addForm) => {
  Object.keys(addForm).forEach((key) => {
    delete addForm[key]
  })
}

// 预览图片
const imgIndex = ref()
const preview = (e) => {
  console.log(e)
  imgIndex.value = e.$index
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
</style>
