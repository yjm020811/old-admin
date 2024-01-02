import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/index.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 导入svgIcon
import installIcons from '../src/icons'

// 导入elementplus
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'

// pinia
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPinia } from 'pinia'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

installIcons(app)

app.use(router).use(ElementPlus, { locale: zhCn }).use(pinia).mount('#app')
