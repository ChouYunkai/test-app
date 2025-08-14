<template>
  <ion-page>
      <ion-header>
        <ion-toolbar class="background-gradient">
            <!-- 左侧按钮 -->
          <ion-buttons slot="start">
            <ion-button @click="openLangSheet">
              <ion-icon slot="icon-only" :icon="globe" />
            </ion-button>
          </ion-buttons>
          <ion-title class="home-title">
            <div class="title-wrapper">
              <span class="title-content"> 
                <ion-icon :icon="home" class="title-icon" />
                {{ t('index') }}
              </span>
            </div>
          </ion-title>

          <ion-buttons slot="end">
            <ion-button @click="handleRefresh">
              <ion-icon slot="icon-only" :icon="refresh" />
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      
      <!-- 主内容区 -->
      <ion-content >
      <!-- 新增的 NFC 提示区域，仅在非桌面端显示 -->
      <div
        v-if="!isDesktop"
        class="nfc-hint-bfc"
        @click="startNfcScan"
        role="button"
        tabindex="0"
      >
        <ion-icon :icon="radio" class="nfc-icon" />
        <div class="nfc-text">Please move closer to the NFC tag to scan.</div>
      </div>
      <div class="table-bfc">
        <ion-grid class="styled-grid ion-padding">
    <!-- 表头 -->
    <ion-row class="styled-row header-row">
      <ion-col size="6" class="cell"><strong>Field Label</strong></ion-col>
      <ion-col size="6" class="cell"><strong>Value</strong></ion-col>
    </ion-row>

    <!-- 数据行 -->
    <ion-row class="styled-row">
      <ion-col size="6" class="cell">{{ t('companyName') }}</ion-col>
      <ion-col size="6" class="cell">{{ chipForm.company }}</ion-col>
    </ion-row>

    <ion-row class="styled-row">
      <ion-col size="6" class="cell">{{ t('project') }}</ion-col>
      <ion-col size="6" class="cell">
        <ProjectSelect
          v-model="chipForm.project"
          :options="projectOptions"
          placeholder="Select project"
          :disabled="!isAdmin"
        />
      </ion-col>
    </ion-row>

    <ion-row class="styled-row">
      <ion-col size="6" class="cell">{{ t('structure') }}</ion-col>
      <ion-col size="6" class="cell">
        <ion-item lines="none" class="input-item">
          <ion-input
            v-model="chipForm.structure"
            placeholder="Add Structure"
            clear-input
           :disabled="!isAdmin"
          ></ion-input>
        </ion-item>
      </ion-col>
    </ion-row>

    <ion-row class="styled-row">
      <ion-col size="6" class="cell">{{ t('contractor') }}</ion-col>
      <ion-col size="6" class="cell">
        <ion-item lines="none" class="input-item">
        <ion-input
            v-model="chipForm.contractor"
            placeholder="Add Contractor"
            clear-input
           :disabled="!isAdmin"
          ></ion-input>
        </ion-item>
      </ion-col>
    </ion-row>

    <ion-row class="styled-row">
      <ion-col size="6" class="cell">{{ t('supplier') }}</ion-col>
      <ion-col size="6" class="cell">
        <ion-item lines="none" class="input-item">
        <ion-input
            v-model="chipForm.supplier"
            placeholder="Add Suppier "
            clear-input
           :disabled="!isAdmin"
          ></ion-input>
        </ion-item>
      </ion-col>
    </ion-row>

    <ion-row class="styled-row">
      <ion-col size="6" class="cell">{{ t('preparedBy') }}</ion-col>
      <ion-col size="6" class="cell">
        <ion-item lines="none" class="input-item">
          <ion-input
            v-model="chipForm.preparedBy"
            placeholder="Add Info."
            clear-input
           :disabled="!isAdmin"
          ></ion-input>
        </ion-item>
      </ion-col>
    </ion-row>

    <ion-row class="styled-row">
      <ion-col size="6" class="cell">{{ t('cubeSize') }}</ion-col>
      <ion-col size="6" class="cell">
        <ProjectSelect
          v-model="chipForm.cubeSize"
          :options="cubeOptions"
          placeholder="Select Cube Size"
          :disabled="!isAdmin"
        />
      </ion-col>
    </ion-row>

    <ion-row class="styled-row">
      <ion-col size="6" class="cell">{{ t('grade') }}</ion-col>
      <ion-col size="6" class="cell">
        <ion-item lines="none" class="input-item">
        <ion-input
            v-model="chipForm.grade"
            placeholder="Add Grade"
            clear-input
            :disabled="!isAdmin"
          ></ion-input>
        </ion-item>
      </ion-col>
    </ion-row>

    <ion-row class="styled-row">
      <ion-col size="6" class="cell">{{ t('cement') }}</ion-col>
      <ion-col size="6" class="cell">
        <ion-item lines="none" class="input-item">
        <ion-input
            v-model="chipForm.cement"
            placeholder="Add cement info"
            clear-input
            :disabled="!isAdmin"
          ></ion-input>
        </ion-item>
      </ion-col>
    </ion-row>

    <ion-row class="styled-row">
      <ion-col size="6" class="cell">{{ t('fineAggregate') }}</ion-col>
      <ion-col size="6" class="cell">
        <ion-item lines="none" class="input-item">
        <ion-input
            v-model="chipForm.fineAggregate"
            placeholder="Add fineAggregate"
            clear-input
            :disabled="!isAdmin"
          ></ion-input>
        </ion-item>
      </ion-col>
    </ion-row>

    <ion-row class="styled-row">
      <ion-col size="6" class="cell">{{ t('coarseAggregate') }}</ion-col>
      <ion-col size="6" class="cell">
        <ion-item lines="none" class="input-item">
        <ion-input
            v-model="chipForm.coarseAggregate"
            placeholder="Add coarseAggregate"
            clear-input
            :disabled="!isAdmin"
          ></ion-input>
        </ion-item>
      </ion-col>
    </ion-row>

    <ion-row class="styled-row">
      <ion-col size="6" class="cell">{{ t('admixture') }}</ion-col>
      <ion-col size="6" class="cell">{{ chipForm.admixture }}</ion-col>
    </ion-row>

    <ion-row class="styled-row">
      <ion-col size="6" class="cell">{{ t('chipCode') }}</ion-col>
      <ion-col size="6" class="cell">
        <ion-item lines="none" class="input-item">
        <ion-input
            v-model="chipForm.chipCode"
            placeholder="Add chipcode"
            clear-input
            :disabled="!isAdmin"
          ></ion-input>
        </ion-item>
      </ion-col>
    </ion-row>

    <ion-row class="styled-row">
      <ion-col size="6" class="cell">{{ t('castingDate') }}</ion-col>
      <ion-col size="6" class="cell">{{ dateForm.date }}</ion-col>
    </ion-row>

    <ion-row class="styled-row">
      <ion-col size="6" class="cell">{{ t('testDays') }}
      </ion-col>
      <ion-col size="6" class="cell">
        <ProjectSelect
          v-model="chipForm.testDays"
          :options="testDaysOptions"
          placeholder="Select testdays"
          :disabled="!isAdmin"
        />
      </ion-col>
    </ion-row>
  </ion-grid>
      <!-- 上传和保存按钮 -->
      <ion-row class="ion-justify-content-between ion-margin-top">
        <ion-col size="6">
          <ion-button expand="block" color="secondary" v-if="userStore.role === 'Administrator'" @click="fetchChipFormByCode" >
            <ion-icon slot="start" :icon="search" class="icon-table"></ion-icon>
            Search
          </ion-button>
        </ion-col>
        <ion-col size="6">
          <ion-button expand="block" color="tertiary" v-if="userStore.role === 'Administrator'" @click="uploadToCloud">
            <ion-icon slot="start" :icon="logoSoundcloud" class="icon-table"></ion-icon>
            Upload
          </ion-button>
        </ion-col>
      </ion-row>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts" >
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  actionSheetController
} from '@ionic/vue';
import { radio,  refresh, logoSoundcloud, search, home, globe } from 'ionicons/icons';
import {reactive, ref, computed, onMounted, watch } from 'vue';
import { useToast } from '@/components/useToast'
import ProjectSelect from '@/components/ProjectSelect.vue'
import { useUserStore } from '@/store/user'  // ⚠️ 导入pinia存储个人全局信息
import { useScanStore } from '@/store/scan';
import { Capacitor } from '@capacitor/core'
import axios from 'axios'
import { useI18n } from 'vue-i18n'
const userStore = useUserStore()
const scanStore = useScanStore();
const projectList= ['项目 A', '项目 B', '项目 C']
const cubeSize = ['150*150', '100*100', '50*50']
const testDays = ['7 days', '14 days', '28 days']
const testDaysOptions = testDays.map(item =>({
  label: item,
  value: item
})) 
const cubeOptions = cubeSize.map(item => ({
  label: item,
  value: item
}))
const projectOptions = projectList.map(item => ({
  label: item,
  value: item
}))
const { showToast } = useToast()
const isAdmin = computed(() => userStore.role === 'Administrator')

interface ChipForm {
  company: string
  project: string
  structure: string
  contractor: string
  supplier: string
  preparedBy: string
  cubeSize: string
  grade: string
  cement: string
  fineAggregate: string
  coarseAggregate: string
  admixture: string
  chipCode: string
  testDays: string
}

interface UploadResponse {
  message: string
  insertId: number
}

// 初始化表单数据
const chipForm = reactive<ChipForm>({
  company: '浙江工业大学',
  project: '',
  structure: '',
  contractor: '',
  supplier: '',
  preparedBy: '',
  cubeSize: '',
  grade: '',
  cement: '',
  fineAggregate: '',
  coarseAggregate: '',
  admixture: '',
  chipCode: '',
  testDays: ''
})
const initchipForm = reactive<ChipForm>({ ...chipForm })
const isRefreshing = ref(false)
const isDesktop = ref(false)

onMounted(() => {
  const ua = navigator.userAgent
  isDesktop.value = /Windows|Macintosh|Linux/i.test(ua) && !/Mobile|Android|iPhone|iPad/i.test(ua)
})

watch(
  () => scanStore.result,
  (newVal) => {
    if (newVal) {
      chipForm.chipCode = newVal
    }
  }
)

setInterval(() => {
  dateForm.date = getCurrentTime()
}, 30000) // 每分钟更新一次

const dateForm = reactive({
  date: getCurrentTime(),
})

const { locale, t } = useI18n()

async function openLangSheet() {
  const actionSheet = await actionSheetController.create({
    header: '选择语言 | Select Language',
    buttons: [
      {
        text: 'English',
        handler: () => { locale.value = 'en' }
      },
      {
        text: '中文',
        handler: () => { locale.value = 'zh' }
      },
      {
        text: '取消',
        role: 'cancel'
      }
    ]
  })
  await actionSheet.present()
}
function handleRefresh() {
  isRefreshing.value = true

  setTimeout(() => {
    Object.assign(chipForm, initchipForm) // ✅ 恢复初始状态
    console.log('✅ 表单已重置')
    isRefreshing.value = false
  },100)
}


const startNfcScan = async () => {
  if (!Capacitor.isNativePlatform()) {
    alert('请在真机中使用 NFC 功能')
    showToast('打开NFC功能需要插件支持', 'warning')
    return
  }

  // try {
  //   // 检查是否支持 NFC
  //   const isAvailable = await NFC.isAvailable()
  //   if (!isAvailable.value) {
  //     alert('此设备不支持 NFC')
  //     return
  //   }

  //   // 添加监听器
  //   await NFC.addListener('nfcTagDiscovered', (event) => {
  //     const tag = event.tag
  //     console.log('扫描到 NFC 标签:', tag)

  //     const id = tag.id || '无标签 ID'
  //     const techList = tag.techList?.join(', ') || '未知协议'
  //     const content = tag.ndefMessage
  //       ? decodeNdef(tag.ndefMessage)
  //       : '无 NDEF 数据'

  //     alert(`NFC 标签内容：${content}\n协议：${techList}\nID：${id}`)

  //     // 👉 监听完后可移除监听器（避免重复触发）
  //     NFC.removeAllListeners()
  //   })

  //   // 开始监听 NFC（安卓自动激活，iOS 会自动弹出系统框）
  //   await NFC.startScanning()
  //   console.log('正在监听 NFC 标签...')
  // } catch (error) {
  //   console.error('NFC 扫描失败:', error)
  //   alert('NFC 扫描失败，请检查权限或设备设置')
  // }
}



function getCurrentTime() {
  const now = new Date()
  // 格式化为 YYYY-MM-DD HH:mm
  const Y = now.getFullYear()
  const M = String(now.getMonth() + 1).padStart(2, '0')
  const D = String(now.getDate()).padStart(2, '0')
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  return `${Y}-${M}-${D} ${h}:${m}`
}

const fetchChipFormByCode = async () => {
  if (!chipForm.chipCode.trim()) {
    showToast('请输入试块编号', 'warning')
    return
  }

  try {
    const res = await axios.get<ChipForm>(`http://localhost:3001/api/chipform/${chipForm.chipCode}`)
    Object.assign(chipForm, res.data)
    showToast('✅ 查询成功，数据已加载', 'success')
    console.log("查询结果：", res.data)
  } catch (err: any) {
    if (err.response?.status === 404) {
      showToast('未找到对应试块编号', 'danger')
    } else {
      console.error("查询失败：", err)
      showToast('服务器异常或网络错误', 'danger')
    }
  }
}
//校验函数
const hasEmptyField = (obj: Record<string, any>): boolean => {
  return Object.values(obj).some(value => value === '' || value === null || value === undefined)
}

// 上传到云端
const uploadToCloud = async () => {
  if (hasEmptyField(chipForm)) {
    showToast('❌ 请填写完整所有字段后再上传', 'danger')
    return
  }
  try {
    const jsonString = JSON.stringify(chipForm) // 你已有
    console.log("🌐 准备上传到云端：", jsonString)

    const res = await axios.post<UploadResponse>('http://localhost:3001/api/chipform',chipForm)

    if (res.status === 201) {
      showToast('✅ 上传成功', 'success')
      console.log("✅ 成功插入数据库,ID:", res.data.insertId)
    } else {
      showToast('❌ 上传失败', 'danger')
      console.error("⚠️ 插入失败：", res.data)
    }
  } catch (err) {
    console.error("❌ 网络或服务器错误：", err)
    showToast('❌ 上传失败，请检查网络或服务器', 'danger')
  }
}
</script>

<style scoped>
.title-content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 100%; /* 确保高度继承，便于垂直居中 */
}

.title-icon {
  font-size: 20px;
  color: #000;
}
.background-gradient {
    height: 100%;
    --background: 
      linear-gradient(to bottom, transparent, #fff 240px),
      radial-gradient(20% 150px at 70% 230px, rgba(255, 255, 255, 0.5), transparent),
      radial-gradient(40% 180px at 80% 50px, rgba(249, 236, 224, 0.35), transparent),
      radial-gradient(50% 300px at 90% 100px, rgba(255, 255, 255, 0.76), transparent),
      radial-gradient(20% 150px at 0px 0px, rgba(96, 205, 235, 0.54), transparent),
      radial-gradient(30% 200px at 100px 50px, rgba(225, 160, 160, 0.45), transparent),
      #f4f4f4 !important;
        /* 设置高度 */
  min-height: 60px; /* 默认是56px，可改为64或72 */
  height: 64px;
  padding-top: 18px;  /* 可选，避免内容挤压 */
  }
  
.tab1-modal {
  background: rgba(0, 0, 0, 0.1)
}

.ion-margin-top {
  margin-top: 0px;
}
.icon-table{
  font-size: 20px;
}
.styled-grid {
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.styled-row {
  border-bottom: 1px solid #f0f0f0;
  border-radius: 8px;
}

.styled-row:last-child {
  border-bottom: none;
}

.header-row {
  background: #f8f8f8;
}

.cell {
  display: flex;
  align-items: center;
  padding: 10px;
  font-size: 14px;
}

.input-item {
  --background: transparent;
  --padding-start: 0;
  --padding-end: 0;
  --inner-padding-start: 0;
  --inner-padding-end: 0;
  --background: transparent;
  margin-left: 0;
  width: 100%;
}
.center-table{
  justify-content: left;
  height: 100%;
}
.home-title{
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center;     /* 垂直居中 */
  font-size: 20px;
  font-weight: bold;
  color: #000000; /* 你想要的颜色 */
  text-align: center;
}
.table-bfc{
  margin-top: 0px;
  display: flow-root; 
  padding: 10px;
  border-radius: 8px;
  background-color: #ffffff;
}
.nfc-hint-bfc {
  display: flow-root; /* 触发 BFC，防止外边距塌陷等问题 */
  margin-top: 10px;
  margin-left: 5px;
  margin-right: 5px;
  text-align: center;
  padding: 16px;
  background-color: #f1f1f1;
  border-radius: 8px;
  cursor: pointer; /* ⬅️ 鼠标悬停时为指针 */
}

.nfc-icon {
  font-size: 48px;
  color: #707070;
  margin-bottom: 8px;
}

.nfc-text {
  font-size: 16px;
  color: #333;
}

.ion-padding{
  padding-bottom: 0px;
}
</style>
