<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/tab1">
          <ion-icon :icon="home" size="large"></ion-icon>
          <ion-label>{{ t('tabs.home') }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/tab3">
          <ion-icon size="large" :icon="qrCode" />
          <ion-label>ScanQRCode</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/tab2">
          <ion-icon :icon="person" size="large"></ion-icon>
          <ion-label>Account</ion-label>
        </ion-tab-button>

      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { home, person, qrCode} from 'ionicons/icons';
import { useI18n } from 'vue-i18n'
// 从 useI18n 拿到 t 函数，模板里可以用
const { t } = useI18n()
</script>
