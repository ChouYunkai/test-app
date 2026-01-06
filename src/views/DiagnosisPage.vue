<template>
    <ion-page>
      <ion-header>
        <ion-toolbar class="background-gradient">
          <ion-buttons slot="start">
            <ion-back-button default-href="/tabs/tab2" text="" color="dark"></ion-back-button>
          </ion-buttons>
          <ion-title class="page-title">
            <div class="title-wrapper">
              <ion-icon :icon="gitNetworkOutline" class="title-icon" />
              <span>{{ t('Root Cause Analysis') }}</span>
            </div>
          </ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content :fullscreen="true" class="page-bg ion-padding">
  
        <ion-card class="result-card danger-border">
          <ion-card-content>
            <div class="result-header">
              <ion-icon :icon="alertCircle" class="result-icon color-danger" />
              <div>
                <h2 class="result-title">{{ t('Diagnosis.MainConclusion') }}</h2>
                <p class="result-time">{{ t('Diagnosis.BatchInfo') }}</p>
              </div>
            </div>
            <div class="divider"></div>
            <div class="analysis-row">
              <div class="analysis-item">
                <span class="label">{{ t('Diagnosis.PrimaryRootCause') }}</span>
                <strong class="value highlight-text">{{ t('Diagnosis.RootCauseWelding') }}</strong>
              </div>
              <div class="analysis-item">
                <span class="label">{{ t('Diagnosis.ModelConfidence') }}</span>
                <strong class="value">96.8%</strong>
              </div>
            </div>
          </ion-card-content>
        </ion-card>
  
        <ion-card class="graph-card">
          <ion-item lines="none" class="card-header-item">
            <ion-icon :icon="analyticsOutline" slot="start" color="tertiary" />
              <ion-label>
                <h2>{{ t('Diagnosis.GraphTitle') }}</h2>
                <p>{{ t('Diagnosis.GraphSubtitle') }}</p>
              </ion-label>
          </ion-item>
          
          <div class="chart-container" ref="chartRef"></div>
          
          <div class="legend-box">
            <div class="legend-item"><span class="dot normal"></span>{{ t('Diagnosis.LegendNormal') }}</div>
            <div class="legend-item"><span class="dot symptom"></span>{{ t('Diagnosis.LegendSymptom') }}</div>
            <div class="legend-item"><span class="dot root"></span>{{ t('Diagnosis.LegendRoot') }}</div>
          </div>
        </ion-card>
  
        <ion-list-header>
          <ion-label>{{ t('Diagnosis.FaultRankingTitle') }}</ion-label>
        </ion-list-header>
  
        <ion-card class="list-card">
          <ion-list lines="full">
            <ion-item>
              <div class="rank-badge red">1</div>
              <ion-label>
                <h3>{{ t('Diagnosis.Item1Title') }}</h3>
                <p>{{ t('Diagnosis.Item1Desc') }}</p>
              </ion-label>
              <ion-note slot="end" color="danger" class="score-note">96.8%</ion-note>
            </ion-item>
  
            <ion-item>
              <div class="rank-badge orange">2</div>
              <ion-label>
                <h3>{{ t('Diagnosis.Item2Title') }}</h3>
                <p>{{ t('Diagnosis.Item2Desc') }}</p>
              </ion-label>
              <ion-note slot="end" color="warning" class="score-note">12.4%</ion-note>
            </ion-item>
  
            <ion-item lines="none">
              <div class="rank-badge gray">3</div>
              <ion-label>
                <h3>{{ t('Diagnosis.Item3Title') }}</h3>
                <p>{{ t('Diagnosis.Item3Desc') }}</p>
              </ion-label>
              <ion-note slot="end" color="medium" class="score-note">5.1%</ion-note>
            </ion-item>
          </ion-list>
        </ion-card>
  
        <ion-button expand="block" color="dark" class="action-btn">
          <ion-icon :icon="buildOutline" slot="start" />
          {{ t('Diagnosis.ViewWeldingParams') }}
        </ion-button>
  
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { 
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, 
    IonIcon, IonBackButton, IonCard, IonCardContent, IonItem, IonLabel, 
    IonList, IonListHeader, IonNote, IonButton
  } from '@ionic/vue';
  import { 
    gitNetworkOutline, alertCircle, analyticsOutline, buildOutline 
  } from 'ionicons/icons';
  import * as echarts from 'echarts';
  
  const { t } = useI18n();
  const chartRef = ref<HTMLElement | null>(null);
  let myChart: echarts.ECharts | null = null;
  
  // ✅ 定义网格布局常量，确保均匀
  const GRID_X = 800; // 横向间距
  const GRID_Y = 700; // 纵向间距
  const START_X = 80; // 起始 X
  const START_Y = 50; // 起始 Y
  
  // 定义节点位置和状态 (使用计算后的网格坐标)
  // Row 0: 生产流程
  // Row 1: 主要测试项 (偏移半个 GRID_X 以形成交错布局)
  // Row 2: 补充测试项
  const graphData = {
    nodes: [
      // --- Row 0: 生产装配流程 ---
      { name: '浮子安装', x: START_X + GRID_X * 0, y: START_Y, category: 'normal' },
      { name: '上下体焊接', x: START_X + GRID_X * 1, y: START_Y, category: 'root' }, // 根因
      { name: '单向阀安装', x: START_X + GRID_X * 2, y: START_Y, category: 'warning' },
      { name: '传感器安装', x: START_X + GRID_X * 3, y: START_Y, category: 'normal' },
      { name: '壳体烫金', x: START_X + GRID_X * 4, y: START_Y, category: 'normal' },
      
      // --- Row 1: 核心测试 (横向偏移半个网格，位于上方两个流程节点之间) ---
      { name: '外观检测', x: START_X + GRID_X * 0.5, y: START_Y + GRID_Y * 1, category: 'normal' },
      { name: '气密测试结果', x: START_X + GRID_X * 1.5, y: START_Y + GRID_Y * 1, category: 'symptom' }, // 故障表现
      { name: '单向阀加壳\n气密测试', x: START_X + GRID_X * 2.5, y: START_Y + GRID_Y * 1, category: 'normal' },
      { name: '拉拔结果', x: START_X + GRID_X * 3.5, y: START_Y + GRID_Y * 1, category: 'normal' },
      { name: '通断测试', x: START_X + GRID_X * 4.5, y: START_Y + GRID_Y * 1, category: 'normal' },
  
      // --- Row 2: 补充测试 (对齐 Row 1) ---
      { name: '机械性能\n测试结果', x: START_X + GRID_X * 3.5, y: START_Y + GRID_Y * 2, category: 'normal' },
      { name: '高低压测试', x: START_X + GRID_X * 4.5, y: START_Y + GRID_Y * 2, category: 'normal' },
    ],
    links: [
      // 流程流转箭头
      { source: '浮子安装', target: '上下体焊接' },
      { source: '上下体焊接', target: '单向阀安装' },
      { source: '单向阀安装', target: '传感器安装' },
      { source: '传感器安装', target: '壳体烫金' },
      
      // ✅ 关键因果链：焊接 -> 气密测试 (样式加强)
      { 
        source: '上下体焊接', 
        target: '气密测试结果', 
        lineStyle: { width: 4, color: '#eb445a', type: 'dashed', curveness: 0.1 } 
      },
      
      // 流程到测试的关联
      { source: '浮子安装', target: '外观检测' },
      { source: '单向阀安装', target: '单向阀加壳\n气密测试' },
      { source: '壳体烫金', target: '拉拔结果' },
      { source: '传感器安装', target: '通断测试' },
  
      // 测试项之间的关联
      { source: '拉拔结果', target: '机械性能\n测试结果' },
      { source: '通断测试', target: '高低压测试' },
    ]
  };
  
  const initChart = () => {
    if (!chartRef.value) return;
    myChart = echarts.init(chartRef.value);
  
    const option = {
      tooltip: { trigger: 'item', formatter: '{b}' },
      // ✅ 添加 grid padding 确保节点不贴边
      grid: { left: 20, right: 20, top: 30, bottom: 30 }, 
      series: [
        {
          type: 'graph',
          layout: 'none', // 继续使用自定义坐标
          draggable: true,
          symbolSize: 30, // 稍微增大节点尺寸
          roam: true, // 允许拖拽缩放查看完整图谱
          center: ['50%', '50%'], // 初始居中
          zoom: 0.8, // 初始缩放比例，确保能看到全貌
          label: {
            show: true,
            position: 'bottom',
            fontSize: 15,
            formatter: '{b}',
            color: '#333',
            distance: 5
          },
          edgeSymbol: ['none', 'arrow'],
          edgeSymbolSize: 8,
          data: graphData.nodes.map(node => ({
            name: node.name,
            x: node.x,
            y: node.y,
            itemStyle: {
              color: getNodeColor(node.category),
              borderColor: getNodeBorder(node.category),
              borderWidth: node.category === 'root' ? 4 : 2,
              shadowBlur: node.category === 'root' ? 12 : 0,
              shadowColor: 'rgba(235, 68, 90, 0.6)'
            },
            // 根因节点突出显示
            symbol: node.category === 'root' ? 'roundRect' : 'circle',
            symbolSize: node.category === 'root' ? [65, 45] : 50
          })),
          links: graphData.links,
          lineStyle: {
            color: '#bbb',
            width: 2,
            curveness: 0.1 // 轻微的曲线让连接更柔和
          }
        }
      ]
    };
  
    myChart.setOption(option);
  };
  
  function getNodeColor(category: string) {
    switch(category) {
      case 'root': return '#fff0f2'; // 根因背景淡红
      case 'symptom': return '#fff4e6'; // 故障表现淡橙
      case 'warning': return '#f8f9fa';
      default: return '#e8f5fe'; // 正常淡蓝
    }
  }
  
  function getNodeBorder(category: string) {
    switch(category) {
      case 'root': return '#eb445a'; // 根因深红
      case 'symptom': return '#f76707'; // 故障深橙
      case 'warning': return '#adb5bd';
      default: return '#1c7ed6'; // 正常深蓝
    }
  }
  
  onMounted(() => {
    setTimeout(() => initChart(), 100);
    window.addEventListener('resize', () => myChart?.resize());
  });
  
  onUnmounted(() => {
    window.removeEventListener('resize', () => myChart?.resize());
    myChart?.dispose();
  });
  </script>
  
  <style scoped>
  /* 继承之前的顶部背景 */
  .background-gradient {
    --background: 
      linear-gradient(to bottom, transparent, #fff 240px),
      radial-gradient(20% 150px at 70% 230px, rgba(255, 255, 255, 0.5), transparent),
      radial-gradient(50% 300px at 90% 100px, rgba(255, 255, 255, 0.76), transparent),
      radial-gradient(20% 150px at 0px 0px, rgba(96, 205, 235, 0.54), transparent),
      #f4f4f4 !important;
  }
  
  .page-bg { --background: #f6f7f9; }
  
  .title-wrapper {
    display: flex; align-items: center; gap: 8px; font-weight: 600; color: #333;
  }
  .title-icon { font-size: 20px; }
  
  /* 结论卡片 */
  .result-card {
    margin-bottom: 16px; border-radius: 12px; box-shadow: 0 4px 12px rgba(235, 68, 90, 0.1);
    background: white;
  }
  .danger-border { border-left: 5px solid #eb445a; }
  
  .result-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .result-icon { font-size: 32px; }
  .color-danger { color: #eb445a; }
  
  .result-title { margin: 0; font-size: 16px; font-weight: 700; color: #333; }
  .result-time { margin: 4px 0 0; font-size: 12px; color: #888; }
  
  .divider { height: 1px; background: #f0f0f0; margin: 12px 0; }
  
  .analysis-row { display: flex; justify-content: space-between; }
  .analysis-item { display: flex; flex-direction: column; }
  .analysis-item .label { font-size: 12px; color: #666; }
  .analysis-item .value { font-size: 16px; color: #333; margin-top: 4px; }
  .highlight-text { color: #eb445a; }
  
  /* 图表卡片 - 高度调整 */
  .graph-card { 
    margin-bottom: 10px; 
    border-radius: 10px; 
    height: 480px; /* 稍微增加高度以适应更均匀的布局 */
    display: flex; 
    flex-direction: column; 
    background: #fff;
  }
  .card-header-item { border-bottom: 1px solid #f5f5f5; --min-height: 50px; }
  .chart-container { flex: 1; width: 100%; min-height: 350px; }
  
  /* 图例 */
  .legend-box {
    display: flex; justify-content: center; gap: 16px; padding: 12px; background: #fff;
    border-top: 1px solid #f5f5f5;
  }
  .legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #666; font-weight: 500; }
  .dot { width: 12px; height: 12px; border-radius: 50%; display: block; }
  .dot.normal { background: #e8f5fe; border: 2px solid #1c7ed6; }
  .dot.symptom { background: #fff4e6; border: 2px solid #f76707; }
  .dot.root { background: #fff0f2; border: 2px solid #eb445a; }
  
  /* 列表样式 */
  .list-card { border-radius: 12px; margin-bottom: 24px; background: #fff; }
  .rank-badge {
    width: 24px; height: 24px; border-radius: 50%; 
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: bold; margin-right: 12px; color: white;
  }
  .rank-badge.red { background: #eb445a; }
  .rank-badge.orange { background: #f76707; }
  .rank-badge.gray { background: #dee2e6; color: #666; }
  
  .score-note { font-weight: 700; font-size: 14px; }
  .action-btn { margin-top: 20px; }
  </style>