<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="home-title">Account</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding page-bg">
      <!-- 个人信息卡片 -->
      <ion-card class="profile-card" v-if="user.loggedIn">
        <ion-card-content class="profile-content">
          <ion-avatar class="profile-avatar">
            <img src="https://www.gravatar.com/avatar?d=mp" />
          </ion-avatar>
          <h2 class="username">{{ user.name }}</h2>
          <p class="user-email">{{ user.email }}</p>
        </ion-card-content>
      </ion-card>

      <!-- 未登录提示 -->
      <div v-else class="login-prompt">
        <p>Please login to view account information.</p>
      </div>

      <!-- 账号信息卡片 -->
      <ion-card class="info-card" v-if="user.loggedIn">
        <ion-list lines="none">
          <ion-item>
            <ion-icon :icon="personCircle" slot="start" color="primary" />
            <ion-label>Role</ion-label>
            <ion-note slot="end">{{ user.role }}</ion-note>
          </ion-item>
          <ion-item>
            <ion-icon :icon="shieldCheckmark" slot="start" color="secondary" />
            <ion-label>Permission Level</ion-label>
            <ion-note slot="end">{{ user.permissionLevel }}</ion-note>
          </ion-item>
          <ion-item>
            <ion-icon :icon="business" slot="start" color="tertiary" />
            <ion-label>Organization</ion-label>
            <ion-note slot="end">{{ user.organization }}</ion-note>
          </ion-item>
        </ion-list>
      </ion-card>

      <!-- 操作按钮卡片 -->
      <ion-card class="action-card">
        <ion-list lines="inset">
          <ion-item button v-if="user.loggedIn" @click="managePermissions">
            <ion-icon slot="start" :icon="settingsOutline" />
            <ion-label>Manage Permissions</ion-label>
          </ion-item>
          <ion-item button v-if="user.loggedIn" @click="changePassword">
            <ion-icon slot="start" :icon="keyIcon" />
            <ion-label>Change Password</ion-label>
          </ion-item>
          <ion-item button v-if="!user.loggedIn" @click="openLoginModal" lines="none">
            <ion-icon slot="start" :icon="logInOutline" color="primary" />
            <ion-label color="primary">Login</ion-label>
          </ion-item>
          <ion-item button v-if="user.loggedIn" @click="logout" lines="none">
            <ion-icon slot="start" :icon="logOutOutline" color="danger" />
            <ion-label color="danger">Logout</ion-label>
          </ion-item>
        </ion-list>
      </ion-card>

      <!-- 登录弹窗 -->
      <ion-modal :is-open="showLoginModal" @did-dismiss="closeLoginModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>Login</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeLoginModal">Cancel</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <ion-item>
          <ion-input v-model="loginForm.username" placeholder="Username" autocomplete="username" />
          </ion-item>
          <ion-item>
          <ion-input v-model="loginForm.password" type="password" placeholder="Password" autocomplete="current-password" />
          </ion-item>
          <ion-button expand="block" class="ion-margin-top" @click="submitLogin" :disabled="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </ion-button>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  ref,
  reactive
} from 'vue'

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonAvatar,
  IonItem,
  IonLabel,
  IonInput,
  IonNote,
  IonList,
  IonCard,
  IonCardContent,
  IonModal
} from '@ionic/vue'

import {
  personCircle,
  shieldCheckmark,
  business,
  settingsOutline,
  keyOutline as keyIcon,
  logInOutline,
  logOutOutline
} from 'ionicons/icons'

// 用户状态，初始未登录
const user = reactive({
  loggedIn: false,
  name: '',
  email: '',
  role: '',
  permissionLevel: '',
  organization: ''
})

const showLoginModal = ref(false)
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

function openLoginModal() {
  showLoginModal.value = true
}

function closeLoginModal() {
  showLoginModal.value = false
  // 清空表单
  loginForm.username = ''
  loginForm.password = ''
  loading.value = false
}

async function submitLogin() {
  if (!loginForm.username || !loginForm.password) {
    alert('Please enter username and password')
    return
  }
  loading.value = true
  try {
    // TODO: 替换为真实的登录API请求
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 模拟成功返回用户信息
    user.loggedIn = true
    user.name = 'Zhou Yunkai'
    user.email = 'zk.zhou@example.com'
    user.role = 'Administrator'
    user.permissionLevel = 'Advanced'
    user.organization = 'Tsinghua University'

    closeLoginModal()
  } catch (e) {
    alert('Login failed, please try again.')
  } finally {
    loading.value = false
  }
}

function logout() {
  user.loggedIn = false
  user.name = ''
  user.email = ''
  user.role = ''
  user.permissionLevel = ''
  user.organization = ''
}

function managePermissions() {
  console.log('Go to permissions page')
}

function changePassword() {
  console.log('Navigate to change password')
}
</script>

<style scoped>
.page-bg {
  --background: #f6f7f9;
}

.home-title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}

.profile-card,
.info-card,
.action-card {
  margin-bottom: 16px;
  border-radius: 12px;
  box-shadow: none;
}

.profile-content {
  text-align: center;
  padding: 24px 16px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  margin: 0 auto 12px;
}

.username {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.user-email {
  margin: 4px 0 0;
  color: #666;
  font-size: 14px;
}

.login-prompt {
  text-align: center;
  color: #888;
  margin-bottom: 20px;
}
</style>
