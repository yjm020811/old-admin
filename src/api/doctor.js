import request from '../utils/request'

// 获取活动列表
export const getAllDoctors = (params) => {
  return request({
    url: '/my/doctor/allDoctor',
    method: 'GET',
    params
  })
}

// 删除医生
export const deleteDoctor = (data) => {
  return request({
    url: '/my/doctor/deleteDoctor',
    method: 'POST',
    data
  })
}

// 修改医生信息
export const changeDoctor = (data) => {
  return request({
    url: '/my/doctor/updateDoctor',
    method: 'POST',
    data
  })
}

// 新增医生
export const addDoctor = (data) => {
  return request({
    url: '/my/doctor/addDoctor',
    method: 'POST',
    data
  })
}

// 根据活动名模糊查询
export const getDoctorByName = (data) => {
  return request({
    url: '/my/doctor/findDoctor',
    method: 'POST',
    data
  })
}
