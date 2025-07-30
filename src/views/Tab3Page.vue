
<template>
  <ion-page class="scanner-page">
    <!-- 透明背景，禁止滚动 -->
    <ion-content :fullscreen="true" class="transparent-content">
      <!-- 返回按钮：左上角 -->
      <ion-button
        fill="clear"
        class="back-button"
        @click="goBack"
      >
      <ion-icon size="large" slot="icon-only" :icon="arrowBackCircle" />
      </ion-button>

      <!-- 扫描区域（镂空框 + 动画） -->
      <div class="scanner-overlay">
        <div class="scan-frame">
          <div class="scan-line" />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { BarcodeScanner } from '@capacitor-community/barcode-scanner'
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/vue'
import { arrowBackCircle } from 'ionicons/icons'
import { useScanStore } from '@/store/scan'
const router = useRouter()
const scanStore = useScanStore()
/* ---------- 开始扫描 ---------- */
const startScan = async () => {
  const status = await BarcodeScanner.checkPermission({ force: true })
  if (!status.granted) {
    alert('需要相机权限才能扫码')
    router.back()
    return
  }

  await BarcodeScanner.hideBackground()
  document.body.classList.add('scanner-active')

  // 隐藏底部 TabBar
  const tabBar = document.querySelector('ion-tab-bar') as HTMLElement
  if (tabBar) tabBar.style.display = 'none'

  const result = await BarcodeScanner.startScan()
  if (result.hasContent) {
    scanStore.setScanResult(result.content);
    alert('扫码结果: ' + result.content)
    router.replace('/tabs/tab1'); // 跳转到首页
  }
  stopScan()
}

/* ---------- 停止扫描 ---------- */
const stopScan = async () => {
  await BarcodeScanner.showBackground()
  await BarcodeScanner.stopScan()
  document.body.classList.remove('scanner-active')

  // 恢复 TabBar
  const tabBar = document.querySelector('ion-tab-bar') as HTMLElement
  if (tabBar) tabBar.style.display = ''

  router.replace('/tabs/tab1')
}

/* ---------- 返回按钮 ---------- */
const goBack = () => {
  stopScan()
}

/* ---------- 生命周期 ---------- */
onMounted(startScan)
onBeforeUnmount(stopScan)
</script>

<style scoped>
/* 页面 & 内容背景透明 */
.transparent-content {
  --background: transparent;
  background-color: transparent;
}
.scanner-page {
  background-color: transparent;
}

/* 左上角返回按钮 */
.back-button {
  position: absolute;
  top: 44px;
  left: 12px;
  z-index: 1001;
  --color: #ffffff;
  --padding-start: 6px;
  --padding-end: 6px;
}

/* 扫描区域垂直居中 */
.scanner-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* 扫描框 */
.scan-frame {
  position: relative;
  width: 66vw;
  max-width: 260px;
  aspect-ratio: 1 / 1;
  background: transparent;
}

/* 四角引导 */
.scan-frame::before,
.scan-frame::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 24px;
  border: 3px solid #00ff00;
}
.scan-frame::before {
  top: -2px;
  left: -2px;
  border-right: none;
  border-bottom: none;
}
.scan-frame::after {
  bottom: -2px;
  right: -2px;
  border-left: none;
  border-top: none;
}

/* 扫描线动画 */
.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #00ff00, #00cc00);
  animation: scan 2s infinite ease-in-out;
}
@keyframes scan {
  0%   { top: 0;    opacity: 0.2; }
  50%  {           opacity: 1;   }
  100% { top: 100%; opacity: 0.2; }
}
</style>