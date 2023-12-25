import request from '../utils/request'

// 获取活动列表
export const getAllCleaners = (params) => {
  return request({
    url: '/my/house/allCleaners',
    method: 'GET',
    params
  })
}

// 删除家政
export const deleteCleaners = (data) => {
  return request({
    url: '/my/house/deleteCleaner',
    method: 'POST',
    data
  })
}

// 修改活动
export const changeCleaners = (data) => {
  return request({
    url: '/my/house/updateCleaners',
    method: 'POST',
    data
  })
}

// 新增家政
export const addCleaners = (data) => {
  return request({
    url: '/my/house/addCleaner',
    method: 'POST',
    data
  })
}

// 根据活动名模糊查询
export const getCleanerByName = (data) => {
  return request({
    url: '/my/house/findCleaner',
    method: 'POST',
    data
  })
}
