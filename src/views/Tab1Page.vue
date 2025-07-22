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
      <ion-button expand="block" color="primary" @click="openCamera">
        <ion-icon slot="start" :icon="cameraOutline"></ion-icon>
        Scan QR code
      </ion-button>

      <!-- 新增的 NFC 提示区域 -->
      <div class="nfc-hint-bfc">
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
import { getCurrentInstance, reactive, ref, toRaw } from 'vue';
import { useToast } from '@/components/useToast'
import ProjectSelect from '@/components/ProjectSelect.vue'
import { Preferences } from '@capacitor/preferences';
import { useUserStore } from '@/store/user'  // ⚠️ 导入pinia存储个人全局信息
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

const isMenuOpen = ref(false);

function handleRefresh() {
  isRefreshing.value = true

  setTimeout(() => {
    Object.assign(chipForm, initchipForm) // ✅ 恢复初始状态
    console.log('✅ 表单已重置')
    isRefreshing.value = false
  },100)
}

// 模拟扫码结果数据结构
const scannedData = ref<{ type: string; value: string }[]>([]);

// 调用摄像头扫码（待集成二维码插件）
const openCamera = async () => {
  // 此处可集成 @capacitor-community/barcode-scanner
  // 或 cordova-plugin-qrscanner
  showToast('打开摄像头功能暂未实现', 'warning')
  console.log('打开相机扫码');
  // 示例数据写入
  scannedData.value = [
    { type: 'QRCode', value: '1234567890' }
  ];
};

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
  showToast('上传失败，请检查网络', 'danger')
  console.log('上传到阿里云：', scannedData.value);
};

const editableData = ref([
  { name: '', code: '' }
]);


const uploadTabToCloud = () => {
  dateForm.date = getCurrentTime()
  // 你可以在此调用阿里云 API（比如 oss putObject、http 接口等）
  console.log('上传数据：', editableData.value);
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
