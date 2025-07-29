<template>
  <div>
    <ion-button expand="block" @click="startScan" :disabled="scanning">
      {{ scanning ? '扫码中...' : '开始扫码' }}
    </ion-button>

    <ion-note style="display: block; text-align: center; margin: 10px 0;">
      请将二维码/条形码放入框内扫描
    </ion-note>

    <!-- 模拟摄像头区域 -->
    <div
      v-show="scanning"
      class="scanner-preview"
    >
      <div class="scan-frame">
        <div class="scan-line"></div>
        <p class="scan-hint">对准二维码/条形码</p>
      </div>

      <ion-button
        size="small"
        color="danger"
        class="stop-button"
        @click="stopScan"
      >
        关闭扫码
      </ion-button>
    </div>

    <div v-if="result" class="result-container">
      <strong>扫码结果：</strong>
      <ion-text class="result-text">{{ result }}</ion-text>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning'
import { useToast } from '@/components/useToast'

const scanning = ref(false)
const result = ref('')
const { showToast } = useToast()
const emit = defineEmits(['scan-completed'])

const startScan = async () => {
  try {
    const permission = await BarcodeScanner.requestPermissions()
    if (permission.camera !== 'granted') {
      showToast('请授权摄像头权限', 'warning')
      return
    }

    scanning.value = true
    result.value = ''

    const handler = await BarcodeScanner.addListener('barcodesScanned', (scanResult: any) => {
      if (scanResult.barcodes?.length > 0) {
        const raw = scanResult.barcodes[0].rawValue
        try {
          const data = JSON.parse(raw)
          result.value = data.chipCode || raw
        } catch {
          result.value = raw
        }
        emit('scan-completed', result.value)
      } else {
        showToast('未识别到二维码', 'danger')
      }
      stopScan()
      handler.remove()
    })

    await BarcodeScanner.startScan()
  } catch (e) {
    console.error('扫码异常', e)
    showToast('扫码失败', 'danger')
    stopScan()
  }
}

const stopScan = async () => {
  scanning.value = false
  await BarcodeScanner.stopScan()
}

defineExpose({ startScan })
</script>

<style scoped>
.scanner-preview {
  position: relative;
  width: 100%;
  height: 300px;
  background: rgba(0, 0, 0, 0.8); /* 模拟摄像头遮罩区域 */
  border-radius: 8px;
  overflow: hidden;
  margin-top: 10px;
}

.scan-frame {
  border: 2px solid #00ff00;
  width: 200px;
  height: 200px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.scan-line {
  height: 2px;
  width: 80%;
  background: #00ff00;
  animation: scanLine 2s infinite linear;
  position: relative;
}

.scan-hint {
  color: white;
  margin-top: 10px;
  font-size: 14px;
}

.stop-button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

.result-container {
  margin-top: 20px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 8px;
}

.result-text {
  word-break: break-all;
  display: inline-block;
  margin-top: 5px;
}

@keyframes scanLine {
  0% { top: -10% }
  100% { top: 110% }
}
</style>
