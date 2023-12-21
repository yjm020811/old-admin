import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '../store/modules/user'
import layout from '../layout/index.vue'

// 私有路由表
const privateRoutes = [
  {
    path: '/user',
    component: layout,
    redirect: '/user/manage',
    meta: {
      title: '用户中心',
      icon: 'personnel'
    },
    children: [
      {
        path: '/user/manage',
        name: 'userManage',
        component: () => import('../views/user-manage/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'personnel-manage'
        }
      }
    ]
  },
  {
    path: '/service',
    component: layout,
    redirect: '/service/news',
    meta: {
      title: '服务管理',
      icon: 'article'
    },
    children: [
      {
        path: '/service/news',
        name: 'newsManage',
        component: () => import('@/views/news-manage/index'),
        meta: {
          title: '新闻管理',
          icon: 'article-ranking'
        }
      },
      {
        path: '/service/doctor',
        name: 'doctorManage',
        component: () => import('@/views/doctor-manage/index'),
        meta: {
          title: '医生管理',
          icon: 'article-ranking'
        }
      },
      {
        path: '/service/clean',
        name: 'cleanManage',
        component: () => import('@/views/clean-manage/index'),
        meta: {
          title: '家政管理',
          icon: 'article-ranking'
        }
      },
      {
        path: '/service/activity',
        name: 'activityManage',
        component: () => import('@/views/activity-manage/index'),
        meta: {
          title: '活动管理',
          icon: 'article-ranking'
        }
      }
    ]
  }
]

// 公有路由表
const publicRoutes = [
  {
    path: '/login',
    component: () => import('../views/login/MyLogin.vue')
  },
  {
    path: '/',
    redirect: '/profile',
    component: layout,
    children: [
      // 个人中心
      {
        path: '/profile',
        name: 'profile',
        component: () => import('../views/profile/index.vue'),
        meta: {
          title: '个人中心',
          icon: 'el-icon-user'
        },
        children: [
          {
            path: '/user/manage',
            name: 'userManage',
            component: () => import('../views/user-manage/index.vue'),
            meta: {
              title: '个人管理',
              icon: 'personnel-manage'
            }
          }
        ]
      },
      // 404
      {
        path: '/404',
        name: '404',
        component: () => import('../views/error-page/404.vue')
      },
      // 401
      {
        path: '/401',
        name: '401',
        component: () => import('../views/error-page/401.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...publicRoutes, ...privateRoutes]
})

router.beforeEach((to, from, next) => {
  if (window.localStorage.getItem('token')) {
    // 有token
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    // 没有token
    if (to.path === '/login') {
      next()
    } else {
      const userStore = useUserStore()
      console.log(userStore.userProfile)
      if (Object.keys(userStore.userProfile).length === 0) {
        next('/login')
      }
    }
  }
})

export default router
