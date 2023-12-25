import request from '../utils/request'

// 获取新闻列表
export const getAllNews = (params) => {
  return request({
    url: '/my/news/newsList',
    method: 'GET',
    params
  })
}

// 删除新闻
export const deleteNews = (data) => {
  return request({
    url: '/my/news/deleteNews',
    method: 'POST',
    data
  })
}

// 修改新闻信息
export const changeNews = (data) => {
  return request({
    url: '/my/news/updateNews',
    method: 'POST',
    data
  })
}

// 新增新闻
export const addNews = (data) => {
  return request({
    url: '/my/news/addNews',
    method: 'POST',
    data
  })
}

// 根据新闻名模糊查询
export const getNewsByName = (data) => {
  return request({
    url: '/my/news/findNews',
    method: 'POST',
    data
  })
}
