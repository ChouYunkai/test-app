<template>
  <ion-page>
      <ion-header>
      <ion-toolbar>
        <ion-title class="home-title">Index</ion-title>
        <ion-buttons slot="end">
          <ion button @click="handleRefresh">
            <ion-icon slot="icon-only" :icon="refresh"></ion-icon>
          </ion>
        </ion-buttons>
      </ion-toolbar>
      </ion-header>
      
      <!-- 主内容区 -->
      <ion-content>
      <ion-button expand="block" color="primary" @click="goToScan">
        <ion-icon slot="start" :icon="cameraOutline"></ion-icon>
        Scan QR code
      </ion-button>

      <!-- 新增的 NFC 提示区域 -->
      <div class="nfc-hint-bfc" @click="startNfcScan" role="button" tabindex="0">
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
      <ion-col size="6" class="cell">Company Name</ion-col>
      <ion-col size="6" class="cell">{{ chipForm.company }}</ion-col>
    </ion-row>

    <ion-row class="styled-row">
      <ion-col size="6" class="cell">Project</ion-col>
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
      <ion-col size="6" class="cell">Structure</ion-col>
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
      <ion-col size="6" class="cell">Contractor</ion-col>
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
      <ion-col size="6" class="cell">Supplier</ion-col>
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
      <ion-col size="6" class="cell">Prepared By</ion-col>
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
      <ion-col size="6" class="cell">Cube Size</ion-col>
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
      <ion-col size="6" class="cell">Grade</ion-col>
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
      <ion-col size="6" class="cell">Type of Cement</ion-col>
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
      <ion-col size="6" class="cell">Fine Aggregate</ion-col>
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
      <ion-col size="6" class="cell">Coarse Aggregate</ion-col>
      <ion-col size="6" class="cell">
        <ion-item lines="none" class="input-item">
        <ion-input
            v-model="chipForm.coarseAggregate"
            placeholder="Add coarseAggregate"
            clear-input
          ></ion-input>
        </ion-item>
      </ion-col>
    </ion-row>

    <ion-row class="styled-row">
      <ion-col size="6" class="cell">Admixture</ion-col>
      <ion-col size="6" class="cell">{{ chipForm.admixture }}</ion-col>
    </ion-row>

    <ion-row class="styled-row">
      <ion-col size="6" class="cell">试块编号</ion-col>
      <ion-col size="6" class="cell">{{ chipForm.chipCode }}</ion-col>
    </ion-row>

    <ion-row class="styled-row">
      <ion-col size="6" class="cell">浇筑日期</ion-col>
      <ion-col size="6" class="cell">{{ dateForm.date }}</ion-col>
    </ion-row>

    <ion-row class="styled-row">
      <ion-col size="6" class="cell">实验天数</ion-col>
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
          <ion-button expand="block" color="secondary" v-if="userStore.role === 'Administrator'" @click="saveChipForm" >
            <ion-icon slot="start" :icon="save" class="icon-table"></ion-icon>
            Save
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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonInput
} from '@ionic/vue';
import { radio, cloud, checkmark, cameraOutline, ellipsisVertical, refresh, logoSoundcloud, save } from 'ionicons/icons';
import { getCurrentInstance, reactive, ref, toRaw, computed, onMounted, watch } from 'vue';
import { useToast } from '@/components/useToast'
import ProjectSelect from '@/components/ProjectSelect.vue'
import { Preferences } from '@capacitor/preferences';
import { useUserStore } from '@/store/user'  // ⚠️ 导入pinia存储个人全局信息
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning'
import { Capacitor } from '@capacitor/core'
// import { NFC } from '@capawesome-team/capacitor-nfc'
import { useRoute, useRouter } from 'vue-router'
const userStore = useUserStore()

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
setInterval(() => {
  dateForm.date = getCurrentTime()
}, 30000) // 每分钟更新一次

const dateForm = reactive({
  date: getCurrentTime(),
})


function handleRefresh() {
  isRefreshing.value = true

  setTimeout(() => {
    Object.assign(chipForm, initchipForm) // ✅ 恢复初始状态
    console.log('✅ 表单已重置')
    isRefreshing.value = false
  },100)
}

const route = useRoute()
const router = useRouter()

const goToScan = () => {
  router.push('/scan')
}

// 监听路由 query 参数，扫码页面跳转回来时带上结果
watch(
  () => route.query.scanResult,
  (newVal) => {
    if (newVal) {
      chipForm.value.chipCode = newVal
      // 可选：清除路由参数，避免重复触发
      router.replace({ path: route.path, query: {} })
    }
  },
  { immediate: true }
)


async function scanQRCode() {
  try {
    const result = await BarcodeScanner.scan()
    if (result.barcodes.length > 0) {
      const content = result.barcodes[0].rawValue
      console.log('二维码内容:', content)
      const data = JSON.parse(content)
      // 示例：自动填入 chipForm 信息
      chipForm.chipCode = content
    } else {
      alert('未检测到二维码')
    }
  } catch (err) {
    showToast('打开摄像头功能暂未实现', 'warning')
    console.error('扫码失败', err)
  }
}

const startNfcScan = async () => {
  if (!Capacitor.isNativePlatform()) {
    alert('请在真机中使用 NFC 功能')
    showToast('打开NFC功能需要插件支持', 'warning')
    return
  }

  try {
    // 检查是否支持 NFC
    const isAvailable = await NFC.isAvailable()
    if (!isAvailable.value) {
      alert('此设备不支持 NFC')
      return
    }

    // 添加监听器
    await NFC.addListener('nfcTagDiscovered', (event) => {
      const tag = event.tag
      console.log('扫描到 NFC 标签:', tag)

      const id = tag.id || '无标签 ID'
      const techList = tag.techList?.join(', ') || '未知协议'
      const content = tag.ndefMessage
        ? decodeNdef(tag.ndefMessage)
        : '无 NDEF 数据'

      alert(`NFC 标签内容：${content}\n协议：${techList}\nID：${id}`)

      // 👉 监听完后可移除监听器（避免重复触发）
      NFC.removeAllListeners()
    })

    // 开始监听 NFC（安卓自动激活，iOS 会自动弹出系统框）
    await NFC.startScanning()
    console.log('正在监听 NFC 标签...')
  } catch (error) {
    console.error('NFC 扫描失败:', error)
    alert('NFC 扫描失败，请检查权限或设备设置')
  }
}

// 模拟扫码结果数据结构
const scannedData = ref<{ type: string; value: string }[]>([]);

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

// 保存到本地
const saveChipForm = async () => {
  // 打印字段级别的数据，确认是否绑定成功
  console.log("当前结构字段：", chipForm.structure)
  console.log("当前项目字段：", chipForm.project)
  console.log("整个 chipForm 数据对象：", chipForm)

  try {
    const jsonString = JSON.stringify(chipForm) // reactive 可直接序列化
    console.log("最终将被保存的 JSON 字符串：", jsonString)

    await Preferences.set({
      key: 'chip-form-data',
      value: jsonString
    })
    showToast('Successfully saved', 'success')
    console.log("✅ chipForm 已成功保存到本地 Preferences")
  } catch (err) {
    console.error("❌ 保存失败：", err)
    showToast('Failly saved', 'danger')
  }
}

// 上传到云端
const uploadToCloud = () => {
  showToast('Failly upload, please check the network', 'danger')
  console.log('上传到华为云：', scannedData.value);
};


</script>

<style scoped>
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
