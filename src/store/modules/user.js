import { defineStore } from 'pinia'
import { login, getUserInfo } from '../../api/user'
import { setItem, removeItem } from '../../utils/storage'
import router from '../../router/index'
// 导入scss常量
import variables from '../../styles/variables.module.scss'

export const useUserStore = defineStore('user', {
  persist: true,
  state: () => ({
    userProfile: null,
    count: 0,
    id: null
  }),
  getters: {
    cssVar: (state) => variables
  },
  actions: {
    increment() {
      this.count++
    },
    // 登录
    loginAction(data) {
      login(data)
        .then((res) => {
          console.log(res)
          this.userProfile = res
          this.id = res.userId
          setItem('token', res.token)
          router.push('/')
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 获取用户信息
    async getUserInfo(id) {
      console.log('@@@@', id)
      const res = await getUserInfo({
        id
      })
      this.userProfile = res
    },
    // 退出登录
    logOut() {
      removeItem('token')
      this.userProfile = {}
      router.push('/login')
    }
  }
})
