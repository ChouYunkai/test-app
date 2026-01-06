<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="background-gradient">
        <ion-buttons slot="start">
          <ion-button @click="openLangSheet">
            <ion-icon slot="icon-only" :icon="globe" />
          </ion-button>
        </ion-buttons>

        <ion-title class="home-title">
          <div class="title-wrapper">
            <span class="title-content"> 
              <ion-icon :icon="cubeOutline" class="title-icon" />
              {{ t('Tank Management') }}
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
      
    <ion-content>
      
      <ion-modal :is-open="isModalOpen" @didDismiss="isModalOpen = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ t('NFC Tag Data') }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="isModalOpen = false">{{ t('close') }}</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
           <ion-list>
             <ion-item><ion-label position="stacked">{{ t('Tank Name') }}</ion-label><ion-input v-model="tankForm.tankName"></ion-input></ion-item>
             <ion-item><ion-label position="stacked">{{ t('Tag ID') }}</ion-label><ion-input v-model="tankForm.tagId" readonly></ion-input></ion-item>
             <ion-button expand="block" @click="submitNFC" class="ion-margin-top">{{ t('Sync Data') }}</ion-button>
           </ion-list>
        </ion-content>
      </ion-modal>

      <div class="table-bfc">
        <ion-grid class="styled-grid ion-padding">
          <ion-row class="styled-row header-row">
            <ion-col size="5" class="cell"><strong>{{ t('Parameter') }}</strong></ion-col>
            <ion-col size="7" class="cell"><strong>{{ t('Value') }}</strong></ion-col>
          </ion-row>

          <ion-row class="styled-row">
            <ion-col size="5" class="cell">{{ t('Tank Name') }}</ion-col>
            <ion-col size="7" class="cell">
              <ion-item lines="none" class="input-item">
                <ion-input
                  v-model="tankForm.tankName"
                  :placeholder="t('e.g. TK-101')"
                  clear-input
                  :disabled="!isAdmin"
                ></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>

          <ion-row class="styled-row">
            <ion-col size="5" class="cell">{{ t('Location/Area') }}</ion-col>
            <ion-col size="7" class="cell">
              <ProjectSelect
                v-model="tankForm.location"
                :options="locationOptions"
                :placeholder="t('Select Area')"
                :disabled="!isAdmin"
              />
            </ion-col>
          </ion-row>

          <ion-row class="styled-row">
            <ion-col size="5" class="cell">{{ t('Stored Medium') }}</ion-col>
            <ion-col size="7" class="cell">
               <ion-item lines="none" class="input-item">
                <ion-input
                  v-model="tankForm.medium"
                  :placeholder="t('e.g. Crude Oil / LNG')"
                  clear-input
                  :disabled="!isAdmin"
                ></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>

          <ion-row class="styled-row">
            <ion-col size="5" class="cell">{{ t('Capacity (m³)') }}</ion-col>
            <ion-col size="7" class="cell">
              <ion-item lines="none" class="input-item">
                <ion-input
                  v-model="tankForm.capacity"
                  type="number"
                  :placeholder="t('Volume')"
                  :disabled="!isAdmin"
                ></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>

          <ion-row class="styled-row">
            <ion-col size="5" class="cell">{{ t('Material') }}</ion-col>
            <ion-col size="7" class="cell">
              <ion-item lines="none" class="input-item">
              <ion-input
                  v-model="tankForm.material"
                  :placeholder="t('e.g. 304 Stainless Steel')"
                  :disabled="!isAdmin"
                ></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>

          <ion-row class="styled-row">
            <ion-col size="5" class="cell">{{ t('Manufacturer') }}</ion-col>
            <ion-col size="7" class="cell">
              <ion-item lines="none" class="input-item">
              <ion-input
                  v-model="tankForm.manufacturer"
                  :placeholder="t('Factory Name')"
                  :disabled="!isAdmin"
                ></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>

          <ion-row class="styled-row">
            <ion-col size="5" class="cell">{{ t('Design Pressure') }}</ion-col>
            <ion-col size="7" class="cell">
              <ion-item lines="none" class="input-item">
                <ion-input
                  v-model="tankForm.designPressure"
                  :placeholder="t('MPa')"
                  :disabled="!isAdmin"
                ></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>

          <ion-row class="styled-row">
            <ion-col size="5" class="cell">{{ t('Design Temp') }}</ion-col>
            <ion-col size="7" class="cell">
              <ion-item lines="none" class="input-item">
                <ion-input
                  v-model="tankForm.designTemp"
                  :placeholder="t('°C')"
                  :disabled="!isAdmin"
                ></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>

          <ion-row class="styled-row">
            <ion-col size="5" class="cell">{{ t('Engineer') }}</ion-col>
            <ion-col size="7" class="cell">
              <ion-item lines="none" class="input-item">
                <ion-input
                  v-model="tankForm.engineer"
                  :placeholder="t('Name')"
                  :disabled="!isAdmin"
                ></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>

          <ion-row class="styled-row">
            <ion-col size="5" class="cell">{{ t('RFID/NFC Tag') }}</ion-col>
            <ion-col size="7" class="cell">
              <ion-item lines="none" class="input-item">
                <ion-input
                  v-model="tankForm.tagId"
                  :placeholder="t('Scan to fill')"
                  readonly
                  :disabled="!isAdmin"
                ></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>

          <ion-row class="styled-row">
            <ion-col size="5" class="cell">{{ t('Health Status') }}</ion-col>
            <ion-col size="7" class="cell">
              <ProjectSelect
                v-model="tankForm.status"
                :options="statusOptions"
                :placeholder="t('Select Status')"
                :disabled="!isAdmin"
              />
            </ion-col>
          </ion-row>

          <ion-row class="styled-row">
            <ion-col size="5" class="cell">{{ t('Install Date') }}</ion-col>
            <ion-col size="7" class="cell">
               <ion-item lines="none" class="input-item">
                <ion-input
                  type="date"
                  v-model="tankForm.installDate"
                  :disabled="!isAdmin"
                ></ion-input>
               </ion-item>
            </ion-col>
          </ion-row>

           <ion-row class="styled-row">
            <ion-col size="5" class="cell">{{ t('System Time') }}</ion-col>
            <ion-col size="7" class="cell" style="color: #666;">{{ dateForm.date }}</ion-col>
          </ion-row>

        </ion-grid>

        <ion-row class="ion-justify-content-between ion-margin-top">
          <ion-col size="6">
            <ion-button expand="block" color="secondary" v-if="userStore.role === 'Administrator'" @click="fetchTankByCode">
              <ion-icon slot="start" :icon="search" class="icon-table"></ion-icon>
              {{ t('Search Tank') }}
            </ion-button>
          </ion-col>
          <ion-col size="6">
            <ion-button expand="block" color="tertiary" v-if="userStore.role === 'Administrator'" @click="uploadToCloud">
              <ion-icon slot="start" :icon="cloudUploadOutline" class="icon-table"></ion-icon>
              {{ t('Upload Info') }}
            </ion-button>
          </ion-col>
        </ion-row>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts" >
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
  IonIcon, IonGrid, IonRow, IonCol, IonInput, actionSheetController,
  IonModal, IonList, IonItem, IonLabel, IonButtons
} from '@ionic/vue';
import { 
  refresh, search, globe, cubeOutline, cloudUploadOutline 
} from 'ionicons/icons';
import { reactive, ref, computed, onMounted, watch } from 'vue';
import { useToast } from '@/components/useToast'
import ProjectSelect from '@/components/ProjectSelect.vue'
import { useUserStore } from '@/store/user'
import { useScanStore } from '@/store/scan';
import axios from 'axios'
import { useI18n } from 'vue-i18n'
import { Capacitor } from '@capacitor/core'

const userStore = useUserStore()
const scanStore = useScanStore();
const { showToast } = useToast()
const { locale, t } = useI18n()
const isAdmin = computed(() => userStore.role === 'Administrator')

// --- 1. 数据结构定义 (改为储液罐模型) ---
interface TankForm {
  tankName: string;      // 罐体编号/名称 (原 Company)
  location: string;      // 区域 (原 Project)
  medium: string;        // 存储介质 (原 Structure)
  material: string;      // 材质 (原 Contractor)
  manufacturer: string;  // 制造商 (原 Supplier)
  engineer: string;      // 负责人 (原 PreparedBy)
  capacity: string;      // 容量 (原 CubeSize)
  designPressure: string;// 设计压力 (新)
  designTemp: string;    // 设计温度 (新)
  tagId: string;         // NFC ID (原 ChipCode)
  status: string;        // 状态 (原 Grade/TestDays)
  installDate: string;   // 安装日期
}

const tankForm = reactive<TankForm>({
  tankName: '',
  location: '',
  medium: '',
  material: '',
  manufacturer: '',
  engineer: '',
  capacity: '',
  designPressure: '',
  designTemp: '',
  tagId: '',
  status: '',
  installDate: ''
})

// --- 2. 选项数据 (Mock) ---
// 这里的变量名保留了你之前的架构风格，但内容换成了罐体相关
const locationList = ref<string[]>([])
const statusList = ref<string[]>([])

// 模拟从数据库/API加载选项
const locationOptions = computed(() => locationList.value.map(item => ({ label: item, value: item })))
const statusOptions = computed(() => statusList.value.map(item => ({ label: item, value: item })))

// --- 3. API 配置 ---
const getBaseURL = () => {
  const platform = Capacitor.getPlatform()
  return platform === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001'
}

// 模拟加载选项 (实际开发请改为请求 /api/tank/options)
const loadOptionsFromDatabase = async () => {
  try {
    // 暂时模拟数据，后期替换为真实 API 调用
    // const res = await axios.get(`${getBaseURL()}/api/tank/options`)
    // locationList.value = res.data.locations
    
    // Mock Data for Demo
    locationList.value = ['Zone A (Raw Material)', 'Zone B (Processing)', 'Zone C (Waste)']
    statusList.value = ['Normal Operation', 'Maintenance Required', 'Fault Detected', 'Offline']
    
  } catch (error) {
    console.error(error)
    locationList.value = ['Error Loading']
  }
}

// --- 4. 逻辑处理 ---
const isDesktop = ref(false)
const isModalOpen = ref(false)

onMounted(() => {
  const ua = navigator.userAgent
  isDesktop.value = /Windows|Macintosh|Linux/i.test(ua) && !/Mobile|Android|iPhone|iPad/i.test(ua)
  loadOptionsFromDatabase()
})

// 监听扫描结果
watch(() => scanStore.result, (newVal) => {
  if (newVal) {
    tankForm.tagId = newVal
    fetchTankByCode() // 扫码后自动查询
  }
})

// 时间更新
const dateForm = reactive({ date: getCurrentTime() })
setInterval(() => { dateForm.date = getCurrentTime() }, 30000)

function getCurrentTime() {
  const now = new Date()
  const Y = now.getFullYear()
  const M = String(now.getMonth() + 1).padStart(2, '0')
  const D = String(now.getDate()).padStart(2, '0')
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  return `${Y}-${M}-${D} ${h}:${m}`
}

// 语言切换
async function openLangSheet() {
  const actionSheet = await actionSheetController.create({
    header: 'Language / 语言',
    buttons: [
      { text: 'English', handler: () => { locale.value = 'en' } },
      { text: '中文', handler: () => { locale.value = 'zh' } },
      { text: 'Cancel', role: 'cancel' }
    ]
  })
  await actionSheet.present()
}

function handleRefresh() {
  window.location.reload()
}

// --- 5. 核心业务逻辑 (查询与上传) ---

// 查询罐体信息
const fetchTankByCode = async () => {
  if (!tankForm.tagId.trim()) {
    showToast(t('Please scan or enter Tag ID'), 'warning')
    return
  }

  try {
    // ⚠️ 注意：后端接口路径可能需要调整，这里假设后端有一个 /api/tank/:id 的接口
    // 如果还没改后端，暂时用原来的 /api/chipform 但字段对应可能错乱，建议同步改后端
    const res = await axios.get(`${getBaseURL()}/api/tank/${tankForm.tagId}`)
    
    // 合并数据
    Object.assign(tankForm, res.data)
    showToast(t('Tank Data Loaded'), 'success')
  } catch (err: any) {
    if (err.response?.status === 404) {
      showToast(t('Tank not found'), 'danger')
    } else {
      console.error(err)
      // 如果是演示，可以伪造一条数据填充
      // Object.assign(tankForm, { tankName: 'TK-Demo', location: 'Zone A' })
      showToast(t('Network error'), 'danger')
    }
  }
}

// 上传到云端
const uploadToCloud = async () => {
  // 简单校验
  if (!tankForm.tankName || !tankForm.location) {
    showToast('❌ ' + t('Basic info required'), 'warning')
    return
  }

  try {
    const res = await axios.post(`${getBaseURL()}/api/tank`, tankForm)
    if (res.status === 201 || res.status === 200) {
      showToast('✅ ' + t('Upload successful'), 'success')
    } else {
      showToast('❌ ' + t('Upload failed'), 'danger')
    }
  } catch (err) {
    console.error(err)
    showToast('❌ ' + t('Upload failed'), 'danger')
  }
}

// NFC 模拟提交
const submitNFC = () => {
  showToast('Synced with NFC Tag', 'success')
  isModalOpen.value = false
}
</script>

<style scoped>
/* 保持原有样式不变，仅替换了 icon */
.title-content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 100%;
}
.title-icon { font-size: 20px; color: #000; }

/* 你的渐变背景 */
.background-gradient {
    --background: 
      linear-gradient(to bottom, transparent, #fff 240px),
      radial-gradient(20% 150px at 70% 230px, rgba(255, 255, 255, 0.5), transparent),
      radial-gradient(50% 300px at 90% 100px, rgba(255, 255, 255, 0.76), transparent),
      radial-gradient(20% 150px at 0px 0px, rgba(96, 205, 235, 0.54), transparent),
      #f4f4f4 !important;
  }
  
  .page-bg {
    --background: #f6f7f9;
  }
  
  .title-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-weight: 600;
    color: #333;
  }
  
  .title-icon {
    font-size: 20px;
    color: #000;
  }
  
  /* 顶部徽标 */
  .badge {
    position: absolute;
    top: 5px;
    right: 5px;
    background: #eb445a;
    color: white;
    font-size: 10px;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

.home-title {
  display: flex; justify-content: center; align-items: center;
  font-size: 20px; font-weight: bold; color: #000; text-align: center;
}

/* 表格样式 */
.table-bfc {
  margin-top: 0px; display: flow-root; padding: 10px;
  border-radius: 8px; background-color: #ffffff;
}
.styled-grid {
  border: 1px solid #ddd; border-radius: 8px; background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}
.styled-row { border-bottom: 1px solid #f0f0f0; }
.styled-row:last-child { border-bottom: none; }
.header-row { background: #f8f8f8; }
.cell { display: flex; align-items: center; padding: 10px; font-size: 14px; }

.input-item {
  --background: transparent; --padding-start: 0; --padding-end: 0;
  --inner-padding-start: 0; --inner-padding-end: 0;
  margin-left: 0; width: 100%;
}
.icon-table { font-size: 20px; }
.ion-padding { padding-bottom: 0px; }
</style>