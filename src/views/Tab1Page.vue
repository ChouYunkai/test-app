<template>
  <ion-page>
      <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
      </ion-header>
      <ion-content>
      <!-- 主内容区 -->
      <ion-button expand="block" color="primary" @click="openCamera">
        <ion-icon slot="start" :icon="cameraOutline"></ion-icon>
        Scan QR code
      </ion-button>

      <!-- 新增的 NFC 提示区域 -->
      <div class="nfc-hint-bfc">
        <ion-icon :icon="radio" class="nfc-icon" />
        <div class="nfc-text">请靠近 NFC 标签进行扫描</div>
      </div>
      <div class="table-bfc">
        <ion-grid class="ion-padding">
          <ion-row>
            <ion-col size="6"><strong>字段名</strong></ion-col>
            <ion-col size="6"><strong>值</strong></ion-col>
          </ion-row>

          <ion-row>
            <ion-col size="6">Company Name</ion-col>
            <ion-col size="6">{{ chipForm.company }}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6">Project</ion-col>
            <ion-col size="6">
              <ProjectSelect
                v-model="chipForm.project"
                :options="projectOptions"
                placeholder="选择一个项目"
              />
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6">Structure</ion-col>
            <ion-col size="6">{{ chipForm.structure }}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6">Contractor</ion-col>
            <ion-col size="6">{{ chipForm.contractor }}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6">Supplier</ion-col>
            <ion-col size="6">{{ chipForm.supplier }}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6">Prepared By</ion-col>
            <ion-col size="6">{{ chipForm.preparedBy }}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6">Cube Size</ion-col>
            <ion-col size="6">{{ chipForm.cubeSize }}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6">Grade</ion-col>
            <ion-col size="6">{{ chipForm.grade }}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6">Type of Cement</ion-col>
            <ion-col size="6">{{ chipForm.cement }}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6">Fine Aggregate</ion-col>
            <ion-col size="6">{{ chipForm.fineAggregate }}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6">Coarse Aggregate</ion-col>
            <ion-col size="6">{{ chipForm.coarseAggregate }}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6">Admixture</ion-col>
            <ion-col size="6">{{ chipForm.admixture }}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6">试块编号</ion-col>
            <ion-col size="6">{{ chipForm.chipCode }}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6">浇筑日期</ion-col>
            <ion-col size="6">{{ chipForm.date }}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6">实验天数</ion-col>
            <ion-col size="6">{{ chipForm.testDays }}</ion-col>
          </ion-row>
        </ion-grid>
      <!-- 上传和保存按钮 -->
      <ion-row class="ion-justify-content-between ion-margin-top">
        <ion-col size="6">
          <ion-button expand="block" color="secondary" @click="saveLocal">
            <ion-icon slot="start" :icon="checkmark"></ion-icon>
            保存
          </ion-button>
        </ion-col>
        <ion-col size="6">
          <ion-button expand="block" color="tertiary" @click="uploadToCloud">
            <ion-icon slot="start" :icon="cloud"></ion-icon>
            上传
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
} from '@ionic/vue';
import { radio, cloud, checkmark, cameraOutline } from 'ionicons/icons';
import { ref } from 'vue';
import { useToast } from '@/components/useToast'
import Projectselect from '@/components/Projectselect.vue';


const selectedProject = ref('')
const projectOptions = ['项目 A', '项目 B', '项目 C']
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
  date: string
  testDays: string
}

// 初始化表单数据
const chipForm = ref<ChipForm>({
  company: '1',
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
  date: '',
  testDays: ''
})



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

// 保存到本地
const saveLocal = () => {
  console.log('保存本地数据：', scannedData.value);
  showToast('保存成功', 'success')
};

// 上传到云端
const uploadToCloud = () => {
  showToast('上传失败，请检查网络', 'danger')
  console.log('上传到阿里云：', scannedData.value);
};

const editableData = ref([
  { name: '', code: '' }
]);


const saveLocalTab = () => {
  localStorage.setItem('rfid-table-data', JSON.stringify(editableData.value));
  console.log('保存成功');
};

const uploadTabToCloud = () => {
  // 你可以在此调用阿里云 API（比如 oss putObject、http 接口等）
  console.log('上传数据：', editableData.value);
};

</script>

<style scoped>
.ion-margin-top {
  margin-top: 0px;
}
.table-bfc{
  margin-top: 0px;
  display: flow-root; 
  padding: 10px;
  border-radius: 12px;
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
  border-radius: 12px;
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
</style>
