<template>
    <ion-page>
      <ion-header>
        <ion-toolbar class="background-gradient">
          <ion-buttons slot="start">
            <ion-back-button default-href="/tabs/tab2" text="" color="dark"></ion-back-button>
          </ion-buttons>
          <ion-title class="page-title">
            <div class="title-wrapper">
              <ion-icon :icon="pulseOutline" class="title-icon" />
              <span>{{ t('Real-time Monitor') }}</span>
            </div>
          </ion-title>
          <ion-buttons slot="end">
            <ion-button>
              <ion-icon :icon="notificationsOutline" color="dark"></ion-icon>
              <span class="badge" v-if="alertCount > 0">{{ alertCount }}</span>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
  
      <ion-content :fullscreen="true" class="page-bg ion-padding">
        
        <ion-card class="status-card">
          <ion-card-content>
            <div class="status-header">
              <div>
                <h2 class="device-name">{{ t('Monitor.DeviceName') }}</h2>
                <p class="device-id">{{ t('Monitor.DeviceMeta') }}</p>
              </div>
              <div class="status-badge" :class="systemStatus.class">
                {{ systemStatus.text }}
              </div>
            </div>
            <div class="runtime-info">
              <ion-icon :icon="timeOutline" />
              <span>{{ t('Monitor.SafeRunning') }}</span>
            </div>
          </ion-card-content>
        </ion-card>
  
        <div class="sensor-grid">
          <ion-card class="sensor-card">
            <ion-card-content>
              <div class="sensor-icon-bg blue">
                <ion-icon :icon="waterOutline" />
              </div>
              <div class="sensor-data">
                <p class="label">{{ t('Monitor.Level') }}</p>
                <h3>{{ sensorData.level.toFixed(1) }} <small>%</small></h3>
              </div>
            </ion-card-content>
          </ion-card>
  
          <ion-card class="sensor-card">
            <ion-card-content>
              <div class="sensor-icon-bg orange">
                <ion-icon :icon="speedometerOutline" />
              </div>
              <div class="sensor-data">
                <p class="label">{{ t('Monitor.Pressure') }}</p>
                <h3>{{ sensorData.pressure.toFixed(2) }} <small>MPa</small></h3>
              </div>
            </ion-card-content>
          </ion-card>
  
          <ion-card class="sensor-card">
            <ion-card-content>
              <div class="sensor-icon-bg red">
                <ion-icon :icon="thermometerOutline" />
              </div>
              <div class="sensor-data">
                <p class="label">{{ t('Monitor.Temp') }}</p>
                <h3>{{ sensorData.temp.toFixed(1) }} <small>°C</small></h3>
              </div>
            </ion-card-content>
          </ion-card>
  
          <ion-card class="sensor-card">
            <ion-card-content>
              <div class="sensor-icon-bg purple">
                <ion-icon :icon="analyticsOutline" />
              </div>
              <div class="sensor-data">
                <p class="label">{{ t('Monitor.Vibration') }}</p>
                <h3>{{ sensorData.vibration.toFixed(3) }} <small>mm/s</small></h3>
              </div>
            </ion-card-content>
          </ion-card>
        </div>
  
        <ion-card class="chart-card">
          <ion-item lines="none">
            <ion-label>
              <h2>{{ t('Monitor.VibrationTrendTitle') }}</h2>
              <p>{{ t('Monitor.VibrationTrendSubtitle') }}</p>
            </ion-label>
            <ion-button fill="clear" size="small" slot="end">
              {{ t('Monitor.ViewAll') }}
            </ion-button>
          </ion-item>
          <div class="chart-container" ref="chartRef"></div>
        </ion-card>
  
        <ion-list-header>
          <ion-label>{{ t('Monitor.RecentAlerts') }}</ion-label>
        </ion-list-header>
        
        <ion-card class="alert-list-card">
          <ion-list lines="full">
            <ion-item>
              <ion-icon :icon="warningOutline" color="warning" slot="start" />
              <ion-label>
                <h3>{{ t('Monitor.Alert1Title') }}</h3>
                <p>{{ t('Monitor.Alert1Desc') }}</p>
              </ion-label>
            </ion-item>
            <ion-item lines="none">
              <ion-icon :icon="checkmarkCircleOutline" color="success" slot="start" />
              <ion-label>
                <h3>{{ t('Monitor.Alert2Title') }}</h3>
                <p>{{ t('Monitor.Alert2Desc') }}</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-card>
  
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted, reactive, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { 
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
    IonIcon, IonBackButton, IonCard, IonCardContent, IonItem, IonLabel, IonList, IonListHeader
  } from '@ionic/vue';
  import { 
    pulseOutline, notificationsOutline, timeOutline, 
    waterOutline, speedometerOutline, thermometerOutline, analyticsOutline,
    warningOutline, checkmarkCircleOutline
  } from 'ionicons/icons';
  import * as echarts from 'echarts';
  
  const { t } = useI18n();
  const chartRef = ref<HTMLElement | null>(null);
  let myChart: echarts.ECharts | null = null;
  let timer: any = null;
  
  // 模拟传感器数据
  const sensorData = reactive({
    level: 78.5,
    pressure: 1.25,
    temp: 42.3,
    vibration: 0.12
  });
  
  const alertCount = ref(1);
  
  // 系统状态逻辑
  const systemStatus = computed(() => {
    if (sensorData.pressure > 1.45) return { text: 'Warning', class: 'status-warning' };
    return { text: 'Normal', class: 'status-normal' };
  });
  
  // ECharts 数据队列
  const dataQueue = reactive<{time: string, value: number}[]>([]);
  const maxPoints = 50;
  
  // 初始化 ECharts
  const initChart = () => {
    if (!chartRef.value) return;
    
    myChart = echarts.init(chartRef.value);
    
    const option = {
      grid: { top: 20, right: 20, bottom: 20, left: 40, containLabel: true },
      tooltip: { trigger: 'axis' },
      xAxis: { 
        type: 'category', 
        boundaryGap: false, 
        data: [],
        axisLine: { lineStyle: { color: '#ccc' } },
        axisLabel: { show: false } // 隐藏X轴标签保持简洁
      },
      yAxis: { 
        type: 'value', 
        splitLine: { lineStyle: { type: 'dashed', color: '#eee' } } 
      },
      series: [{
        name: 'Vibration',
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(132, 94, 247, 0.4)' },
            { offset: 1, color: 'rgba(132, 94, 247, 0.01)' }
          ])
        },
        lineStyle: { color: '#845ef7', width: 2 },
        data: []
      }]
    };
    
    myChart!.setOption(option);
  };
  
  // 模拟数据更新
  const startSimulation = () => {
    // 预填充数据
    const now = new Date();
    for(let i=0; i<maxPoints; i++) {
      dataQueue.push({
        time: now.toLocaleTimeString(),
        value: Math.random() * 0.2 + 0.1
      });
      now.setSeconds(now.getSeconds() + 1);
    }
  
    timer = setInterval(() => {
      // 1. 更新传感器数值 (加入一些随机扰动)
      sensorData.level = 78 + Math.sin(Date.now() / 10000) * 2; // 缓慢波动
      sensorData.pressure = 1.25 + (Math.random() - 0.5) * 0.1; // 噪点
      sensorData.temp = 42 + (Math.random() - 0.5) * 0.2;
      // 振动数据用于图表，偶尔模拟一个尖峰
      let vibVal = 0.15 + (Math.random() - 0.5) * 0.1;
      if (Math.random() > 0.95) vibVal += 0.4; // 模拟异常冲击
      sensorData.vibration = vibVal;
  
      // 2. 更新图表数据
      const newTime = new Date().toLocaleTimeString();
      dataQueue.shift();
      dataQueue.push({ time: newTime, value: vibVal });
  
      if (myChart) {
        myChart.setOption({
          xAxis: { data: dataQueue.map(item => item.time) },
          series: [{ data: dataQueue.map(item => item.value) }]
        });
      }
  
    }, 1000); // 1秒刷新一次
  };
  
  onMounted(() => {
    // 短暂延迟确保 DOM 渲染
    setTimeout(() => {
      initChart();
      startSimulation();
    }, 100);
    
    window.addEventListener('resize', () => myChart?.resize());
  });
  
  onUnmounted(() => {
    if (timer) clearInterval(timer);
    if (myChart) myChart.dispose();
    window.removeEventListener('resize', () => myChart?.resize());
  });
  </script>
  
  <style scoped>
  /* 复用 Tab2Page 的顶部背景 */
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
  
  /* 状态卡片 */
  .status-card {
    margin: 0 0 16px 0;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.05);
    background: white;
  }
  
  .status-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }
  
  .device-name {
    font-size: 18px;
    font-weight: 700;
    margin: 0;
    color: #1a1a1a;
  }
  
  .device-id {
    font-size: 12px;
    color: #888;
    margin: 4px 0 0 0;
  }
  
  .status-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }
  
  .status-normal {
    background: #e6fcf5;
    color: #0ca678;
  }
  
  .status-warning {
    background: #fff9db;
    color: #f59f00;
  }
  
  .runtime-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #666;
    background: #f8f9fa;
    padding: 8px 12px;
    border-radius: 8px;
  }
  
  /* 传感器 Grid */
  .sensor-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .sensor-card {
    margin: 0;
    border-radius: 12px;
    box-shadow: none;
    background: white;
  }
  
  .sensor-card ion-card-content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .sensor-icon-bg {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }
  
  .blue { background: #e7f5ff; color: #1c7ed6; }
  .orange { background: #fff4e6; color: #f76707; }
  .red { background: #fff5f5; color: #fa5252; }
  .purple { background: #f3f0ff; color: #845ef7; }
  
  .sensor-data .label {
    font-size: 12px;
    color: #888;
    margin: 0;
  }
  
  .sensor-data h3 {
    font-size: 20px;
    font-weight: 700;
    margin: 4px 0 0 0;
    color: #333;
  }
  
  .sensor-data small {
    font-size: 12px;
    font-weight: normal;
    color: #666;
  }
  
  /* 图表卡片 */
  .chart-card {
    margin: 0 0 16px 0;
    border-radius: 16px;
    box-shadow: none;
  }
  
  .chart-container {
    width: 100%;
    height: 200px;
    padding: 0 10px 10px 10px;
  }
  
  /* 报警列表 */
  .alert-list-card {
    margin: 0 0 24px 0;
    border-radius: 16px;
    box-shadow: none;
  }
  </style>