import request from '../utils/request'

// 登录
export const login = (data) => {
  return request({
    url: '/api/login',
    method: 'POST',
    data
  })
}

// 获取管理员信息
export const getUserInfo = (params) => {
  return request({
    url: '/my/userinfo',
    method: 'GET',
    params
  })
}

// 管理员注册
export const registerAxios = (data) => {
  return request({
    url: '/api/register',
    method: 'POST',
    data
  })
}

// 获取活动列表
export const getActivityList = (params) => {
  return request({
    url: '/my/activity/allActivity',
    method: 'GET',
    params
  })
}

// 修改个人信息

// 修改密码
export const changePassword = (data) => {
  return request({
    url: '/my/resetPwd',
    method: 'POST',
    data
  })
}
