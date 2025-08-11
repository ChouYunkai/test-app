import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { IonicVue } from '@ionic/vue'
import i18n from './i18n'
/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'

/* Ionic Dark Mode - you can enable it if needed */
// import '@ionic/vue/css/palettes/dark.always.css'
// import '@ionic/vue/css/palettes/dark.class.css'
import '@ionic/vue/css/palettes/dark.system.css'

/* Theme variables */
import './theme/variables.css'


document.body.setAttribute('color-theme', 'light')

// 创建 Pinia 实例
const pinia = createPinia()

const app = createApp(App)
  .use(IonicVue)
  .use(createPinia())// 注册 Pinia 插件
  .use(router)
  .use(pinia)
  .use(i18n)
   // ✅ 注册 Pinia  

router.isReady().then(() => {
  app.mount('#app')
})
