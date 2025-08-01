<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="background-gradient">
        <ion-title class="home-title">
          <div class="title-wrapper">
            Manage Projects
          </div>
        </ion-title>
      </ion-toolbar>
      <ion-searchbar
        v-model="searchQuery"
        placeholder="搜索项目、承包商等"
        debounce="300"
        @ionInput="onSearch"
        animated
        showClearButton="focus"
      />
    </ion-header>

    <ion-content>
  <!-- 表格头 -->
  <ion-grid class="table-header">
    <ion-row>
      <ion-col>项目</ion-col>
      <ion-col>承包商</ion-col>
      <ion-col>操作</ion-col>
    </ion-row>
  </ion-grid>

  <!-- 表格数据 -->
  <ion-grid v-for="(item, index) in filteredList" :key="index" class="table-row">
    <ion-row>
      <ion-col>{{ item.project }}</ion-col>
      <ion-col>{{ item.contractor }}</ion-col>
      <ion-col>
        <ion-button size="small" color="primary" @click="editItem(index)">编辑</ion-button>
        <ion-button size="small" color="danger" @click="deleteItem(index)">删除</ion-button>
      </ion-col>
    </ion-row>
  </ion-grid>

  <ion-button expand="block" @click="openNewItem">新增项目</ion-button>

  <!-- 编辑/新增弹窗 -->
  <ion-modal :is-open="isModalOpen" @didDismiss="closeModal">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ editIndex === null ? '新增项目' : '编辑项目' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">关闭</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col size="6">
            <ion-item>
              <ion-label position="stacked">单位名称</ion-label>
              <ion-input v-model="form.company" />
            </ion-item>
          </ion-col>
          <ion-col size="6">
            <ion-item>
              <ion-label position="stacked">项目名称</ion-label>
              <ion-input v-model="form.project" />
            </ion-item>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col size="6">
            <ion-item>
              <ion-label position="stacked">结构类型</ion-label>
              <ion-input v-model="form.structure" />
            </ion-item>
          </ion-col>
          <ion-col size="6">
            <ion-item>
              <ion-label position="stacked">承包商</ion-label>
              <ion-input v-model="form.contractor" />
            </ion-item>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col size="6">
            <ion-item>
              <ion-label position="stacked">材料供应商</ion-label>
              <ion-input v-model="form.supplier" />
            </ion-item>
          </ion-col>
          <ion-col size="6">
            <ion-item>
              <ion-label position="stacked">制备人</ion-label>
              <ion-input v-model="form.preparedBy" />
            </ion-item>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col size="6">
            <ion-item>
              <ion-label position="stacked">试块尺寸</ion-label>
              <ion-input v-model="form.cubeSize" />
            </ion-item>
          </ion-col>
          <ion-col size="6">
            <ion-item>
              <ion-label position="stacked">强度等级</ion-label>
              <ion-input v-model="form.grade" />
            </ion-item>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col size="6">
            <ion-item>
              <ion-label position="stacked">水泥</ion-label>
              <ion-input v-model="form.cement" />
            </ion-item>
          </ion-col>
          <ion-col size="6">
            <ion-item>
              <ion-label position="stacked">细骨料</ion-label>
              <ion-input v-model="form.fineAggregate" />
            </ion-item>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col size="6">
            <ion-item>
              <ion-label position="stacked">粗骨料</ion-label>
              <ion-input v-model="form.coarseAggregate" />
            </ion-item>
          </ion-col>
          <ion-col size="6">
            <ion-item>
              <ion-label position="stacked">外加剂</ion-label>
              <ion-input v-model="form.admixture" />
            </ion-item>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col size="6">
            <ion-item>
              <ion-label position="stacked">芯样编号</ion-label>
              <ion-input v-model="form.chipCode" />
            </ion-item>
          </ion-col>
          <ion-col size="6">
            <ion-item>
              <ion-label position="stacked">龄期（天）</ion-label>
              <ion-input v-model="form.testDays" />
            </ion-item>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-button expand="block" class="ion-margin-top" @click="saveItem">
        {{ editIndex === null ? '添加' : '保存修改' }}
      </ion-button>
    </ion-content>
  </ion-modal>
</ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSearchbar,
  IonModal,
  IonIcon,
  IonButtons,
} from '@ionic/vue';
import { ref, reactive, computed } from 'vue';
import {barChart} from 'ionicons/icons';

interface ChipForm {
  company: string;
  project: string;
  structure: string;
  contractor: string;
  supplier: string;
  preparedBy: string;
  cubeSize: string;
  grade: string;
  cement: string;
  fineAggregate: string;
  coarseAggregate: string;
  admixture: string;
  chipCode: string;
  testDays: string;
}

const searchQuery = ref('');
const isModalOpen = ref(false);
const editIndex = ref<number | null>(null);

const form = reactive<Partial<ChipForm>>({ project: '', contractor: '' });

const chipForms = ref<ChipForm[]>([
  {
    company: '浙江工业大学',
    project: '杭州西湖项目',
    structure: '框架',
    contractor: '中国建筑',
    supplier: '中建材料',
    preparedBy: '王工',
    cubeSize: '150',
    grade: 'C30',
    cement: '425',
    fineAggregate: '河沙',
    coarseAggregate: '碎石',
    admixture: '外加剂A',
    chipCode: 'ZJ001',
    testDays: '28',
  },
]);

const filteredList = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  return chipForms.value.filter(item =>
    Object.values(item).some(val => val.toLowerCase?.().includes(query))
  );
});

function onSearch(e: any) {
  searchQuery.value = e.target.value;
}

function openNewItem() {
  Object.assign(form, { project: '', contractor: '' });
  editIndex.value = null;
  isModalOpen.value = true;
}

function editItem(index: number) {
  Object.assign(form, chipForms.value[index]);
  editIndex.value = index;
  isModalOpen.value = true;
}

function deleteItem(index: number) {
  chipForms.value.splice(index, 1);
}

function saveItem() {
  if (!form.project || !form.contractor) return;
  const item = { ...form } as ChipForm;
  if (editIndex.value === null) {
    chipForms.value.push(item);
  } else {
    chipForms.value[editIndex.value] = item;
  }
  closeModal();
}

function closeModal() {
  isModalOpen.value = false;
}
</script>

<style scoped>
.home-title{
  font-size: 20px;
  font-weight: bold;
  color: #000000; /* 你想要的颜色 */
  text-align: center;
}
.title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
.title-icon {
  font-size: 20px;
  color: #000;
}
.table-header ion-row,
.table-row ion-row {
  border-bottom: 1px solid #ccc;
  padding: 8px 0;
}
ion-col {
  text-align: center;
}
.background-gradient {
  --background: linear-gradient(to bottom, transparent, #fff 240px),
    radial-gradient(20% 150px at 70% 230px, rgba(255, 255, 255, 0.5), transparent),
    radial-gradient(40% 180px at 80% 50px, rgba(249, 236, 224, 0.35), transparent),
    radial-gradient(50% 300px at 90% 100px, rgba(255, 255, 255, 0.76), transparent),
    radial-gradient(20% 150px at 0px 0px, rgba(96, 205, 235, 0.54), transparent),
    radial-gradient(30% 200px at 100px 50px, rgba(225, 160, 160, 0.45), transparent),
    #f4f4f4 !important;
}
</style>
