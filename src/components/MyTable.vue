<template>
  <div>
    <el-table
      v-bind="$attrs"
      border
      :data="tableData"
      style="width: 100%"
      v-loading="isLoading"
      :default-sort="{ prop: 'id', order: 'descending' }"
      :element-loading-text="elementLoadingText"
      :element-loading-spinner="elementLoadingIcon"
    >
      <template v-for="(item, index) in tableOptions" :key="index">
        <!-- 正常展示数据的区域 -->
        <el-table-column
          :label="item.label"
          :prop="item.prop"
          :align="item.align"
          :width="item.width"
        >
          <template #default="scope">
            <slot v-if="item.slot" :name="item.slot" :scope="scope"></slot>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </template>

      <!-- 编辑区域 -->
      <el-table-column
        :label="actionOptions.label"
        :prop="actionOptions.prop"
        :align="actionOptions.align"
        :width="actionOptions.width"
      >
        <template #default="scope">
          <!-- action插槽 -->
          <slot name="action" :scope="scope"></slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div
    class="pagination"
    v-if="pagination"
    :style="{ justifyContent: paginationPosition }"
  >
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'
const props = defineProps({
  // 表格的配置
  tableData: {
    type: Array,
    required: true
  },
  // 表格数据
  options: {
    type: Array,
    required: true
  },
  // 加载的文案
  elementLoadingText: {
    type: String
  },
  // 加载图标名
  elementLoadingIcon: {
    type: String
  },
  // 是否显示分页
  pagination: {
    type: Boolean,
    default: false
  },
  // 当前是第几页的数据
  currentPage: {
    type: Number,
    default: 1
  },
  // 每页数据的选项
  pageSizes: {
    type: Array,
    // eslint-disable-next-line
    default: [10, 20, 30, 40]
  },
  // 每页多少条数据
  pageSize: {
    type: Number,
    default: 10
  },
  // 数据总条数
  total: {
    type: Number,
    default: 0
  },
  // 分页的排列方式
  paginationPosition: {
    // 只能填left，center，right
    type: String,
    default: 'left'
  }
})
console.log(props, '我是传动的数据')

const emits = defineEmits(['sizeChange', 'handleCurrentChange'])

// 过滤操作选项后的一个配置
const tableOptions = computed(() =>
  // 过滤出没有action的配置项
  props.options.filter((item) => {
    return !item.action
  })
)
console.log(tableOptions)

// 找出操作项的配置,如果找到item具有action项，就返回item
const actionOptions = computed(() => props.options.find((item) => item.action))
console.log(actionOptions)

// 表格是否在加载中
const isLoading = computed(() => {
  if (props.tableData.length === 0 || !props.tableData) {
    return true
  } else {
    return false
  }
})

// 分页的条数改变
const handleSizeChange = (val) => {
  console.log(`每页 ${val} 条`)
  emits('sizeChange', val)
}
// 分页的页数改变
const handleCurrentChange = (val) => {
  console.log(`当前页: ${val}`)
  emits('handleCurrentChange', val)
}
// 分页的位置
const paginationPosition = computed(() => {
  if (props.paginationPosition === 'left') {
    return 'flex-start'
  } else if (props.paginationPosition === 'center') {
    return 'center'
  } else {
    return 'flex-end'
  }
})
</script>

<style scoped>
.edit {
  width: 1.2em;
  height: 1.2em;
  position: relative;
  top: 4px;
  left: 4px;
  cursor: pointer;
}

.pagination {
  display: flex;
  align-items: center;
  margin-top: 16px;
}
</style>
