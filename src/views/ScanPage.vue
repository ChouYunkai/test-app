<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>扫码</ion-title>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tab1" />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-button expand="block" color="success" @click="startScan">开始扫码</ion-button>
      <div v-if="error" class="error-msg">{{ error }}</div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue'
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning'
import { useRouter } from 'vue-router'

const error = ref('')
const router = useRouter()

const startScan = async () => {
  error.value = ''
  try {
    const result = await BarcodeScanner.scan()
    if (result.barcodes.length > 0) {
      const content = result.barcodes[0].rawValue
      // 跳转回 Tab1 页面，并通过 query 传扫码结果
      router.replace({ path: '/tab1', query: { scanResult: content } })
    } else {
      error.value = '未检测到二维码'
    }
  } catch (e) {
    error.value = '扫码失败'
  }
}
</script>

<style scoped>
.error-msg {
  color: red;
  margin-top: 16px;
}
</style>
