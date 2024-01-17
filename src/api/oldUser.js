import request from '../utils/request'

// 获取用户的信息
export const getOldUserList = (params) => {
  return request({
    url: '/my/olduser/getUserList',
    method: 'get',
    params
  })
}

// 修改用户的信息
export const editProfile = (data) => {
  return request({
    url: '/my/olduser/editProfile',
    method: 'POST',
    data
  })
}

// 删除用户
export const deleteUser = (data) => {
  return request({
    url: '/my/olduser/deleteProfile',
    method: 'POST',
    data
  })
}
