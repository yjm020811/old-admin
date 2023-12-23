import dayjs from 'dayjs'

// 将日期时间字符串格式化为指定格式的函数
export function formatDateTime(dateTimeString) {
  return dayjs(dateTimeString).format('YYYY-MM-DD')
}
