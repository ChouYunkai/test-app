<template>
    <ion-page>
      <ion-header>
        <ion-toolbar class="background-gradient">
          <ion-buttons slot="start">
            <ion-back-button default-href="/tabs/tab2" text="" color="dark"></ion-back-button>
          </ion-buttons>
          <ion-title class="page-title">
            <div class="title-wrapper">
              <ion-icon :icon="documentTextOutline" class="title-icon" />
              <span>{{ t('Fault History') }}</span>
            </div>
          </ion-title>
          <ion-buttons slot="end">
            <ion-button @click="presentFilterSheet">
              <ion-icon slot="icon-only" :icon="filterOutline" color="dark" />
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
        
        <ion-toolbar class="search-toolbar">
          <ion-searchbar 
            v-model="searchTerm" 
            :placeholder="t('Search Tank ID or Fault Type')"
            animated
            show-clear-button="focus"
          ></ion-searchbar>
        </ion-toolbar>
      </ion-header>
  
      <ion-content :fullscreen="true" class="page-bg">
        
        <div class="stats-row ion-padding-horizontal ion-padding-top">
          <ion-card class="stat-card">
            <div class="stat-number danger">{{ stats.critical }}</div>
            <div class="stat-label">{{ t('History.StatsCritical') }}</div>
          </ion-card>
          <ion-card class="stat-card">
            <div class="stat-number warning">{{ stats.pending }}</div>
            <div class="stat-label">{{ t('History.StatsPending') }}</div>
          </ion-card>
          <ion-card class="stat-card">
            <div class="stat-number success">{{ stats.fixed }}</div>
            <div class="stat-label">{{ t('History.StatsFixed30d') }}</div>
          </ion-card>
        </div>
  
        <ion-list class="history-list ion-padding">
          <ion-list-header>
            <ion-label>
              {{ t('Incident Logs') }}
              <span class="count-badge">{{ filteredLogs.length }}</span>
            </ion-label>
          </ion-list-header>
  
          <transition-group name="list">
            <ion-card 
              v-for="log in filteredLogs" 
              :key="log.id" 
              class="log-card" 
              button 
              @click="openDetail(log)"
            >
              <ion-item lines="none" class="log-item">
                <div slot="start" class="icon-box" :class="log.level">
                  <ion-icon :icon="getIconByLevel(log.level)" />
                </div>
                
                <ion-label>
                  <h2>{{ log.faultName }}</h2>
                  <h3>{{ log.tankName }} <span class="divider">|</span> {{ log.location }}</h3>
                  <p>{{ log.date }}</p>
                </ion-label>
  
                <div slot="end" class="status-col">
                  <ion-badge :color="getStatusColor(log.status)">{{ log.status }}</ion-badge>
                </div>
              </ion-item>
            </ion-card>
          </transition-group>
          
          <div v-if="filteredLogs.length === 0" class="empty-state">
            <ion-icon :icon="fileTrayOutline" />
            <p>{{ t('History.NoLogs') }}</p>
          </div>
        </ion-list>
  
        <ion-modal :is-open="isModalOpen" @did-dismiss="isModalOpen = false" :initial-breakpoint="0.75" :breakpoints="[0, 0.5, 0.75, 1]">
          <ion-content class="ion-padding modal-content" v-if="selectedLog">
            <div class="modal-header">
              <h2>{{ t('History.IncidentIdPrefix') }} {{ selectedLog.id }}</h2>
              <ion-badge :color="getStatusColor(selectedLog.status)">{{ selectedLog.status }}</ion-badge>
            </div>
            
            <div class="detail-section">
              <h3>{{ t('History.FaultDescription') }}</h3>
              <p>{{ selectedLog.description }}</p>
            </div>
  
            <ion-list lines="full">
              <ion-item>
                <ion-label color="medium">{{ t('History.TankId') }}</ion-label>
                <ion-note slot="end">{{ selectedLog.tankName }}</ion-note>
              </ion-item>
               <ion-item>
                <ion-label color="medium">{{ t('History.DetectedTime') }}</ion-label>
                <ion-note slot="end">{{ selectedLog.date }}</ion-note>
              </ion-item>
              <ion-item>
                <ion-label color="medium">{{ t('History.ReportedBy') }}</ion-label>
                <ion-note slot="end">{{ selectedLog.reporter }}</ion-note>
              </ion-item>
               <ion-item>
                <ion-label color="medium">{{ t('History.RootCauseAI') }}</ion-label>
                <ion-note slot="end">{{ selectedLog.rootCause }}</ion-note>
              </ion-item>
            </ion-list>
  
            <div class="action-buttons">
              <ion-button expand="block" color="primary" @click="downloadReport">
                <ion-icon slot="start" :icon="cloudDownloadOutline" />
                {{ t('History.DownloadReport') }}
              </ion-button>
               <ion-button expand="block" fill="outline" color="medium" @click="isModalOpen = false">
                {{ t('History.Close') }}
              </ion-button>
            </div>
          </ion-content>
        </ion-modal>
  
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { 
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
    IonIcon, IonBackButton, IonSearchbar, IonCard, IonItem, IonLabel, IonList, 
    IonListHeader, IonBadge, IonModal, IonNote, actionSheetController
  } from '@ionic/vue';
import { 
  documentTextOutline, filterOutline, warning, alertCircle, checkmarkCircle,
  fileTrayOutline, cloudDownloadOutline
} from 'ionicons/icons';
  import { useToast } from '@/components/useToast';
  
  const { t } = useI18n();
  const { showToast } = useToast();
  
  const searchTerm = ref('');
  const isModalOpen = ref(false);
  const selectedLog = ref<any>(null);
  
  // 统计数据 (Mock)
  const stats = reactive({
    critical: 2,
    pending: 5,
    fixed: 128
  });
  
  // 模拟历史数据
  // 字段对应您的论文场景：罐号、故障类型、AI推断的根因
  const logs = ref([
    {
      id: 'LOG-2026-089',
      tankName: 'TK-101',
      location: 'Zone A',
      faultName: 'Level Sensor Mismatch',
      level: 'critical', // critical, warning, info
      status: 'Pending', // Pending, In Progress, Resolved
      date: '2026-01-05 14:30',
      description: 'Significant discrepancy between radar gauge and float gauge readings. Potential float sticking.',
      reporter: 'System (FHMM Model)',
      rootCause: 'Float Installation Error'
    },
    {
      id: 'LOG-2026-088',
      tankName: 'TK-104',
      location: 'Zone B',
      faultName: 'Low Pressure Alert',
      level: 'warning',
      status: 'Resolved',
      date: '2026-01-04 09:15',
      description: 'Tank pressure dropped below threshold during discharge cycle.',
      reporter: 'Operator Mike',
      rootCause: 'Breather Valve Blockage'
    },
    {
      id: 'LOG-2026-085',
      tankName: 'TK-202',
      location: 'Zone A',
      faultName: 'Vibration Anomaly',
      level: 'warning',
      status: 'Resolved',
      date: '2026-01-02 18:45',
      description: 'Abnormal vibration detected in output pump P-202.',
      reporter: 'IoT Sensor Network',
      rootCause: 'Pump Bearing Wear'
    },
    {
      id: 'LOG-2025-998',
      tankName: 'TK-101',
      location: 'Zone A',
      faultName: 'Annual Inspection',
      level: 'info',
      status: 'Resolved',
      date: '2025-12-28 10:00',
      description: 'Routine visual inspection and wall thickness measurement.',
      reporter: 'Team Alpha',
      rootCause: 'N/A'
    },
  ]);
  
  // 过滤逻辑
  const filteredLogs = computed(() => {
    return logs.value.filter(log => {
      const term = searchTerm.value.toLowerCase();
      return log.tankName.toLowerCase().includes(term) || 
             log.faultName.toLowerCase().includes(term) ||
             log.id.toLowerCase().includes(term);
    });
  });
  
  // 辅助函数：根据等级获取图标
  function getIconByLevel(level: string) {
    switch(level) {
      case 'critical': return alertCircle;
      case 'warning': return warning;
      default: return checkmarkCircle;
    }
  }
  
  // 辅助函数：状态颜色
  function getStatusColor(status: string) {
    switch(status) {
      case 'Pending': return 'danger';
      case 'In Progress': return 'warning';
      case 'Resolved': return 'success';
      default: return 'medium';
    }
  }
  
  // 打开详情
  function openDetail(log: any) {
    selectedLog.value = log;
    isModalOpen.value = true;
  }
  
  // 筛选 Sheet
  async function presentFilterSheet() {
    const actionSheet = await actionSheetController.create({
      header: t('History.FilterHeader'),
      buttons: [
        { text: t('History.FilterCriticalOnly'), handler: () => { showToast(t('History.ToastFilteringCritical'), 'primary') } },
        { text: t('History.FilterPendingOnly'), handler: () => { showToast(t('History.ToastFilteringPending'), 'primary') } },
        { text: t('History.FilterReset'), role: 'destructive', handler: () => { showToast(t('History.ToastFilterReset'), 'success') } },
        { text: t('History.FilterCancel'), role: 'cancel' }
      ]
    });
    await actionSheet.present();
  }
  
  // 下载报告模拟
  function downloadReport() {
    showToast(t('History.ToastDownloadingReport'), 'success');
    // 这里可以接入 jspdf 生成 PDF
  }
  </script>
  
  <style scoped>
  /* 继承统一的 Header 样式 */
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
  .search-toolbar {
    --background: transparent;
    margin-top: 10px;
    padding: 0 8px;
  }
  ion-searchbar {
    --background: #fff;
    --border-radius: 12px;
    --box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    padding-top: 0;
    padding-bottom: 8px;
  }
  
  .page-bg { --background: #f6f7f9; }
  
  /* 统计卡片 */
  .stats-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
    margin-bottom: 8px;
  }
  .stat-card {
    margin: 0;
    padding: 12px 8px;
    text-align: center;
    border-radius: 12px;
    box-shadow: none;
    background: #fff;
  }
  .stat-number { font-size: 20px; font-weight: 800; margin-bottom: 4px; }
  .stat-label { font-size: 11px; color: #888; font-weight: 500; }
  .danger { color: #eb445a; }
  .warning { color: #f59f00; }
  .success { color: #2dd36f; }
  
  /* 列表样式 */
  .history-list {
    background: transparent;
    padding-top: 0;
  }
  .count-badge {
    background: #e9ecef; color: #495057; 
    padding: 2px 8px; border-radius: 10px; font-size: 12px; margin-left: 6px;
  }
  .log-card {
    margin: 0 0 12px 0;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.02);
    background: white;
  }
  .log-item { --padding-start: 12px; --padding-end: 12px; --padding-top: 8px; --padding-bottom: 8px;}
  
  /* 左侧图标盒子 */
  .icon-box {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    margin-right: 12px; font-size: 20px;
  }
  .icon-box.critical { background: #fff5f5; color: #eb445a; }
  .icon-box.warning { background: #fff9db; color: #f59f00; }
  .icon-box.info { background: #e7f5ff; color: #1c7ed6; }
  
  .divider { color: #ddd; margin: 0 4px; }
  ion-label h2 { font-weight: 700; font-size: 16px; margin-bottom: 4px; }
  ion-label h3 { font-size: 13px; color: #666; margin-bottom: 4px; }
  ion-label p { font-size: 12px; color: #999; }
  
  /* 空状态 */
  .empty-state {
    text-align: center; margin-top: 60px; color: #aaa;
  }
  .empty-state ion-icon { font-size: 48px; margin-bottom: 12px; }
  
  /* Modal 样式 */
  .modal-header {
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
  }
  .modal-header h2 { margin: 0; font-size: 22px; font-weight: 700; }
  .detail-section {
    background: #f8f9fa; padding: 16px; border-radius: 12px; margin-bottom: 20px;
  }
  .detail-section h3 { margin: 0 0 8px 0; font-size: 14px; color: #666; font-weight: 600; }
  .detail-section p { margin: 0; font-size: 15px; line-height: 1.5; color: #333; }
  .action-buttons { margin-top: 30px; display: flex; flex-direction: column; gap: 12px; }
  
  /* 列表动画 */
  .list-enter-active, .list-leave-active { transition: all 0.3s ease; }
  .list-enter-from, .list-leave-to { opacity: 0; transform: translateY(20px); }
  </style>