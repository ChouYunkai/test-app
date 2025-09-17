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
  <!-- NFC 扫描按钮 -->
 <div
    v-if="!isDesktop"
    class="nfc-hint-bfc"
    @click="startNfcScan"
    role="button"
    tabindex="0"
  >
    <ion-icon :icon="radio" class="nfc-icon" />
    <div class="nfc-text">{{ t('nfcHint') }}</div>
  </div>

  <!-- Modal -->
  <ion-modal :is-open="isModalOpen" @didDismiss="isModalOpen = false">
    <ion-header>
      <ion-toolbar>
        <ion-title>NFC 表单信息</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="isModalOpen = false">关闭</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item>
          <ion-label position="stacked">公司</ion-label>
          <ion-input v-model="chipForm.company"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">项目</ion-label>
          <ion-input v-model="chipForm.project"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">结构</ion-label>
          <ion-input v-model="chipForm.structure"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">承包商</ion-label>
          <ion-input v-model="chipForm.contractor"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">供应商</ion-label>
          <ion-input v-model="chipForm.supplier"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">编制人</ion-label>
          <ion-input v-model="chipForm.preparedBy"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">试件尺寸</ion-label>
          <ion-input v-model="chipForm.cubeSize"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">强度等级</ion-label>
          <ion-input v-model="chipForm.grade"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">水泥</ion-label>
          <ion-input v-model="chipForm.cement"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">细骨料</ion-label>
          <ion-input v-model="chipForm.fineAggregate"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">粗骨料</ion-label>
          <ion-input v-model="chipForm.coarseAggregate"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">外加剂</ion-label>
          <ion-input v-model="chipForm.admixture"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">芯片编号</ion-label>
          <ion-input v-model="chipForm.chipCode" readonly></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">养护天数</ion-label>
          <ion-input v-model="chipForm.testDays"></ion-input>
        </ion-item>
      </ion-list>

      <ion-footer>
        <ion-toolbar>
          <ion-button expand="block" @click="submitNFC">
            提交
          </ion-button>
        </ion-toolbar>
        <ion-toolbar>
          <ion-button expand="block" @click="writeChipFormToTag">
          写入
          </ion-button>
        </ion-toolbar>
      </ion-footer>
    </ion-content>
  </ion-modal>
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
          :placeholder="t('Select project')"
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
            :placeholder="t('Add Structure')"
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
            :placeholder="t('Add Contractor')"
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
            :placeholder="t('Add Suppier')"
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
            :placeholder="t('Add Info.')"
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
          :placeholder="t('Select Cube Size')"
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
            :placeholder="t('Add Grade')"
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
            :placeholder="t('Add cement info')"
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
            :placeholder="t('Add fineAggregate')"
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
            :placeholder="t('Add coarseAggregate')"
            clear-input
            :disabled="!isAdmin"
          ></ion-input>
        </ion-item>
      </ion-col>
    </ion-row>

    <ion-row class="styled-row">
      <ion-col size="6" class="cell">{{ t('admixture') }}</ion-col>
      <ion-col size="6" class="cell">
        <ion-input
            v-model="chipForm.admixture"
            :placeholder="t('admixture')"
            clear-input
            :disabled="!isAdmin"
          ></ion-input>
        </ion-col>
    </ion-row>

    <ion-row class="styled-row">
      <ion-col size="6" class="cell">{{ t('chipCode') }}</ion-col>
      <ion-col size="6" class="cell">
        <ion-item lines="none" class="input-item">
        <ion-input
            v-model="chipForm.chipCode"
            :placeholder="t('Add chipcode')"
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
          :placeholder="t('selectTestDays')"
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
            {{ t('search') }}
          </ion-button>
        </ion-col>
        <ion-col size="6">
          <ion-button expand="block" color="tertiary" v-if="userStore.role === 'Administrator'" @click="uploadToCloud">
            <ion-icon slot="start" :icon="logoSoundcloud" class="icon-table"></ion-icon>
            {{ t('upload') }}
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
import axios from 'axios'
import { useI18n } from 'vue-i18n'
import { Nfc, NfcUtils } from '@capawesome-team/capacitor-nfc';
import { Capacitor } from '@capacitor/core'

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

const isDesktop = ref(false)
const isModalOpen = ref(false)

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
  window.location.reload()
}


// 工具函数：字节转 hex
const bytesToHex = (bytes: number[] | Uint8Array) =>
  Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')

// NFC 扫描函数（支持读取自定义格式）
const startNfcScan = async () => {
  try {
    await Nfc.removeAllListeners()

    const available = await Nfc.isAvailable()
    if (!available?.nfc) return showToast('此设备不支持 NFC', 'warning')

    const isEnabled = await Nfc.isEnabled()
    if (!isEnabled) return showToast('请在系统设置中开启 NFC', 'warning')

    if (Capacitor.getPlatform() === 'android') {
      const { nfc } = await Nfc.checkPermissions()
      if (nfc !== 'granted') {
        const res = await Nfc.requestPermissions()
        if (res.nfc !== 'granted') return showToast('NFC 权限被拒绝', 'danger')
      }
    }

    showToast('请将设备靠近 NFC 标签', 'primary')

    const listener = await Nfc.addListener('nfcTagScanned', async (event: any) => {
      const tag = event?.nfcTag ?? event?.tag
      if (!tag) return showToast('读取到无效标签', 'danger')

      chipForm.chipCode = tag?.id ? bytesToHex(tag.id) : ''

      // ✅ 解析自定义 MIME 类型数据
      if (Array.isArray(tag?.ndefMessage) && tag.ndefMessage.length > 0) {
        try {
          const record = tag.ndefMessage[0]

          if ((record.tnf ?? record.typeNameFormat) === 0x02) { // MIME type
            const text = new TextDecoder().decode(record.payload)
            const data = JSON.parse(text)
            Object.assign(chipForm, data)
            showToast('读取到已有数据，已填充表单', 'success')
          } else {
            Object.assign(chipForm, { ...initchipForm, chipCode: chipForm.chipCode })
            showToast('标签内容非本应用格式，表单为空', 'warning')
          }
        } catch {
          Object.assign(chipForm, { ...initchipForm, chipCode: chipForm.chipCode })
          showToast('解析出错，表单为空', 'warning')
        }
      } else {
        Object.assign(chipForm, { ...initchipForm, chipCode: chipForm.chipCode })
      }

      isModalOpen.value = true
      await Nfc.stopScanSession()
      await listener.remove()
    })

    await Nfc.startScanSession()
  } catch (err) {
    console.error(err)
    showToast('NFC 扫描失败，请检查权限或设备设置', 'danger')
  }
}

// NFC 写入函数（写入 chipForm 到标签，并同步表格）
const writeChipFormToTag = async () => {
  try {
    showToast('请将设备靠近 NFC 标签', 'primary')

    const utils = new NfcUtils()
    const json = JSON.stringify(chipForm)
    // ✅ 自定义 MIME 类型记录（使用通用 createNdefRecord 构造）
    const encoder = new TextEncoder()
    const { record } = utils.createNdefRecord({
      tnf: 0x02, // MIME
      type: Array.from(encoder.encode('application/vnd.myapp.chipform')),
      id: [],
      payload: Array.from(encoder.encode(json))
    })

    const listener = await Nfc.addListener('nfcTagScanned', async () => {
      try {
        await Nfc.write({ message: { records: [record] } })
        showToast('写入成功', 'success')

        // chipForm 已经是 reactive，表格会自动同步显示
      } catch (e) {
        console.error(e)
        showToast('写入失败', 'danger')
      } finally {
        await listener.remove()
        await Nfc.stopScanSession()
      }
    })

    await Nfc.startScanSession()
  } catch (err) {
    console.error(err)
    showToast('NFC 写入失败，请检查权限或设备设置', 'danger')
  }
}

// 提交表单（只是关闭弹窗，同时 chipForm 已 reactive）
const submitNFC = () => {
  console.log('提交数据:', chipForm)
  showToast('表单已提交', 'success')
  isModalOpen.value = false
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
