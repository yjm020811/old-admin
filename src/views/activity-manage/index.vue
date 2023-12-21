<template>
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
    <template #activityStartTime="{ scope }">
      {{ new Date(scope.row.activityStartTime).toLocaleString() }}
    </template>
    <template #releaseTime="{ scope }">
      {{ new Date(scope.row.releaseTime).toLocaleString() }}
    </template>

    <!-- 自定义编辑区域 -->
    <template #action="{ scope }">
      <div class="action">
        <div class="edit">
          <commonDialog
            btnName="编辑"
            dialogTitle="编辑"
            @openDialog="edit(scope)"
            @updateConfirm="updateConfirm"
          >
            <template #content>
              <div class="form">
                <el-form :model="editContent" ref="myForm">
                  <el-form-item label="活动名称" label-width="80">
                    <el-input v-model="editContent.activityName" />
                  </el-form-item>
                  <el-form-item label="开始时间" label-width="80">
                    <el-date-picker
                      v-model="editContent.activityStartTime"
                      type="date"
                      placeholder="日期选择"
                      size="default"
                    />
                  </el-form-item>
                  <el-form-item label="地址" label-width="80">
                    <el-input v-model="editContent.address" />
                  </el-form-item>
                  <el-form-item label="类别" label-width="80">
                    <el-input v-model="editContent.activityDesc" />
                  </el-form-item>
                </el-form>
              </div>
            </template>
          </commonDialog>
        </div>
        <div class="delete">
          <el-popconfirm title="确定删除吗?" @confirm="deleteAction(scope)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </div>
      </div>
    </template>
  </MyTable>
  <div class="add">
    <commonDialog
      btnName="新增活动"
      dialogTitle="新增"
      btnSize="large"
      btnType="success"
      @openDialog="addActivity"
      @updateConfirm="addAc"
    >
      <template #content>
        <div class="addForm">
          <el-form :model="addForm" label-width="80">
            <el-form-item label="活动名称">
              <el-input v-model="addForm.activityName" />
            </el-form-item>

            <el-form-item label="开始时间" label-width="80">
              <el-date-picker
                v-model="addForm.activityStartTime"
                type="date"
                placeholder="日期选择"
                size="default"
              />
            </el-form-item>
            <el-form-item label="地址" label-width="80">
              <el-input v-model="addForm.address" />
            </el-form-item>
            <el-form-item label="类别" label-width="80">
              <el-input v-model="addForm.activityDesc" />
            </el-form-item>
          </el-form>
        </div>
      </template>
    </commonDialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import MyTable from '../../components/MyTable'
import {
  getActivityList,
  deleteActivity,
  changeActivity,
  addActivityAxios
} from '../../api/activity'
import { ElMessage } from 'element-plus'
import commonDialog from '../../components/commonDialog'

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
    label: '活动id',
    prop: 'id',
    align: 'center',
    width: 80
  },
  {
    label: '活动名称',
    prop: 'activityName',
    align: 'center',
    width: 300
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
    action: true,
    width: 160
  }
]

// 编辑表格数据
const editId = ref(null)
const editContent = reactive({
  activityName: '',
  activityDesc: '',
  address: '',
  activityStartTime: ''
})
const edit = (scope) => {
  console.log('编辑表格', scope.row)
  editId.value = scope.row.id
  editContent.activityName = scope.row.activityName
  // 类别
  editContent.activityDesc = scope.row.activityDesc
  editContent.address = scope.row.address
  editContent.activityStartTime = scope.row.activityStartTime
  editContent.releaseTime = scope.row.releaseTime
}

// 删除表格数据
const deleteAction = async (scope) => {
  try {
    console.log('删除表格', scope.row.id)
    const res = await deleteActivity({
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

// dialog的确定按钮
const updateConfirm = async () => {
  console.log(editContent)
  try {
    const res = await changeActivity({
      id: editId.value,
      activityName: editContent.activityName,
      activityDesc: editContent.activityDesc,
      address: editContent.address,
      activityStartTime: editContent.activityStartTime
    })

    if (res.code === 200) {
      console.log(res)
      ElMessage.success('修改成功')
      getActivity()
    } else {
      ElMessage.error('修改失败')
    }
  } catch (error) {
    ElMessage.error('修改失败')
    console.log(error)
  }
}

// 新增活动
const addForm = reactive({
  activityName: '',
  activityDesc: '',
  address: '',
  activityStartTime: ''
})
const addActivity = async () => {
  console.log('打开了')
}

const addAc = async () => {
  try {
    const res = await addActivityAxios({
      activityName: addForm.activityName,
      activityDesc: addForm.activityDesc,
      address: addForm.address,
      activityStartTime: addForm.activityStartTime
    })
    console.log(res)
    if (res.code === 200) {
      ElMessage.success('添加成功')
      getActivity()
    } else {
      ElMessage.success('添加失败')
    }
  } catch (error) {
    ElMessage.success('添加失败')
    console.log(error)
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
.add {
  display: flex;
  justify-content: flex-end;
}
</style>
