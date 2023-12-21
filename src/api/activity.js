import request from '../utils/request'

// 获取活动列表
export const getActivityList = (params) => {
  return request({
    url: '/my/activity/allActivity',
    method: 'GET',
    params
  })
}

// 删除活动
export const deleteActivity = (data) => {
  return request({
    url: '/my/activity/deleteActivity',
    method: 'POST',
    data
  })
}

// 修改活动
export const changeActivity = (data) => {
  return request({
    url: '/my/activity/changeActivity',
    method: 'POST',
    data
  })
}

// 新增活动
export const addActivityAxios = (data) => {
  return request({
    url: '/my/activity/addActivity',
    method: 'POST',
    data
  })
}
