<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="background-gradient">
        <ion-title class="home-title">
          <div class="title-wrapper">
            <span class="title-content"> 
              <ion-icon :icon="personCircle" class="title-icon" />
              {{ t('Account') }}
            </span>
          </div>
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding page-bg">
      <ion-card class="profile-card" v-if="userStore.loggedIn">
        <ion-card-content class="profile-content">
          <ion-avatar class="profile-avatar">
            <img src="https://www.gravatar.com/avatar?d=mp" />
          </ion-avatar>
          <h2 class="username">{{ userStore.name }}</h2>
          <p class="user-email">{{ userStore.email }}</p>
        </ion-card-content>
      </ion-card>

      <div v-else class="login-prompt">
        <p>{{ t('Please login to view system status') }}</p>
      </div>

      <ion-card class="info-card" v-if="userStore.loggedIn">
        <ion-list lines="inset">
          <ion-item>
            <ion-icon :icon="personCircle" slot="start" color="primary" />
            <ion-label>{{ t('Role') }}</ion-label>
            <ion-note slot="end">{{ userStore.role }}</ion-note>
          </ion-item>
          <ion-item>
            <ion-icon :icon="shieldCheckmark" slot="start" color="secondary" />
            <ion-label>{{ t('Permission Level') }}</ion-label>
            <ion-note slot="end">{{ userStore.permissionLevel }}</ion-note>
          </ion-item>
          <ion-item lines="none">
            <ion-icon :icon="business" slot="start" color="tertiary" />
            <ion-label>{{ t('Organization') }}</ion-label>
            <ion-note slot="end">{{ userStore.organization }}</ion-note>
          </ion-item>
        </ion-list>
      </ion-card>

      <ion-card class="action-card" v-if="userStore.loggedIn">
        <ion-item lines="full" class="card-header-item">
          <ion-icon :icon="cubeOutline" slot="start" color="dark" />
          <ion-label>
            <h2>{{ t('Fault Diagnosis System') }}</h2>
            <p style="font-size: 12px; color: #888;">{{ t('Lifecycle Management Core') }}</p>
          </ion-label>
        </ion-item>
        
        <ion-list lines="inset">
          <ion-item button @click="navigateTo('monitor')">
            <ion-icon slot="start" :icon="pulseOutline" color="success" />
            <ion-label>{{ t('Real-time Monitoring') }}</ion-label>
            <ion-note slot="end" color="medium" style="font-size: 12px;">Running</ion-note>
          </ion-item>
          
          <ion-item button @click="navigateTo('diagnosis')">
            <ion-icon slot="start" :icon="analyticsOutline" color="warning" />
            <ion-label>{{ t('Fault Diagnosis System') }}</ion-label>
          </ion-item>

          <ion-item button @click="navigateTo('history')" lines="none">
            <ion-icon slot="start" :icon="documentTextOutline" color="secondary" />
            <ion-label>{{ t('Fault History Logs') }}</ion-label>
          </ion-item>
        </ion-list>
      </ion-card>

      <ion-card class="action-card">
        <ion-list lines="inset">
          <ion-item button v-if="userStore.loggedIn" @click="managePermissions">
            <ion-icon slot="start" :icon="settingsOutline" />
            <ion-label>{{ t('Manage Permissions') }}</ion-label>
          </ion-item>
          <ion-item button v-if="userStore.loggedIn" @click="changePassword">
            <ion-icon slot="start" :icon="keyIcon" />
            <ion-label>{{ t('Change Password') }}</ion-label>
          </ion-item>
          <ion-item button v-if="!userStore.loggedIn" @click="openLoginModal">
            <ion-icon slot="start" :icon="logInOutline" color="primary" />
            <ion-label color="primary">{{ t('Login') }}</ion-label>
          </ion-item>
          <ion-item button v-if="!userStore.loggedIn" @click="openCreateAccountModal" lines="none">
            <ion-icon slot="start" :icon="personAddOutline" color="primary" />
            <ion-label color="primary">{{ t('Create Account') }}</ion-label>
          </ion-item>
          <ion-item button v-if="userStore.loggedIn" @click="logout" lines="none">
            <ion-icon slot="start" :icon="logOutOutline" color="danger" />
            <ion-label color="danger">{{ t('Logout') }}</ion-label>
          </ion-item>
        </ion-list>
      </ion-card>
  
      <ion-card class="action-card">
        <ion-list lines="none">
          <ion-item>
            <ion-icon :icon="mail" slot="start" color="primary" />
            <ion-label>{{ t('Developer') }}</ion-label>
            <ion-note slot="end">1207099632@qq.com</ion-note>
          </ion-item>
        </ion-list>   
      </ion-card>

      <ion-modal :is-open="showLoginModal" @did-dismiss="closeLoginModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ t('Login') }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeLoginModal">{{ t('cancel') }}</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <ion-item>
            <ion-input 
              v-model="loginForm.email"
              type="text" 
              :placeholder="t('Email')" 
              autocomplete="email" />
          </ion-item>
          <ion-item>
            <ion-input 
              v-model="loginForm.password" 
              type="password" 
              :placeholder="t('Password')"
              autocomplete="current-password" />
          </ion-item>
          <ion-button expand="block" class="ion-margin-top" @click="submitLogin" :disabled="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </ion-button>
        </ion-content>
      </ion-modal>

      <ion-modal :is-open="showCreateAccountModal" @did-dismiss="closeCreateAccountModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ t('Create Account') }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeCreateAccountModal">{{ t('Cancel') }}</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <ion-item>
            <ion-input 
              v-model="createAccountForm.name" 
              type="text" 
              :placeholder="t('Name')" 
              autocomplete="name" />
          </ion-item>
          <ion-item>
            <ion-input 
              v-model="createAccountForm.email" 
              type="text" 
              :placeholder="t('Email')" 
              autocomplete="email" />
          </ion-item>
          <ion-item>
            <ion-input 
              v-model="createAccountForm.password" 
              type="password" 
              :placeholder="t('Password')" 
              autocomplete="new-password" />
          </ion-item>
          <ion-item>
            <ion-input 
              v-model="createAccountForm.role" 
              type="text" 
              :placeholder="t('Role')" 
              autocomplete="off" />
          </ion-item>
          <ion-item>
            <ion-input 
              v-model="createAccountForm.permission_level" 
              type="text" 
              :placeholder="t('Permission Level')" 
              autocomplete="off" />
          </ion-item>
          <ion-item>
            <ion-input 
              v-model="createAccountForm.organization" 
              type="text" 
              :placeholder="t('Organization')" 
              autocomplete="organization" />
          </ion-item>
          <ion-button expand="block" class="ion-margin-top" @click="submitCreateAccount" :disabled="loading">
            {{ loading ? 'Creating account...' : t('Create Account') }}
          </ion-button>
        </ion-content>
      </ion-modal>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
  IonIcon, IonAvatar, IonItem, IonLabel, IonInput, IonNote, IonList, IonCard,
  IonCardContent, IonModal
} from '@ionic/vue'

import {
  personCircle, shieldCheckmark, business, settingsOutline,
  keyOutline as keyIcon, logInOutline, logOutOutline,
  personAddOutline, mail,
  // ✅ 新增图标导入
  pulseOutline, analyticsOutline, documentTextOutline, cubeOutline
} from 'ionicons/icons'

import { useUserStore } from '@/store/user'
import { useToast } from '@/components/useToast'

const { showToast } = useToast()
const { t } = useI18n()
const router = useRouter() // 用于页面跳转

const showLoginModal = ref(false)
const showCreateAccountModal = ref(false)
const loading = ref(false)

const loginForm = reactive({
  email: '',
  password: ''
})

const createAccountForm = reactive({
  name: '',
  email: '',
  password: '',
  role: '',
  permission_level: '',
  organization: ''
})

const userStore = useUserStore()

// 1. 模态框控制
function openLoginModal() {
  showLoginModal.value = true
}

function openCreateAccountModal() {
  showCreateAccountModal.value = true
}

function closeLoginModal() {
  showLoginModal.value = false
  loginForm.email = ''
  loginForm.password = ''
  loading.value = false
}

function closeCreateAccountModal() {
  showCreateAccountModal.value = false
  createAccountForm.name = ''
  createAccountForm.email = ''
  createAccountForm.password = ''
  createAccountForm.role = ''
  createAccountForm.permission_level = ''
  createAccountForm.organization = ''
  loading.value = false
}

// 2. 登录逻辑
async function submitLogin() {
  if (!loginForm.email || !loginForm.password) {
    showToast(t('Please enter your email and password'), 'warning')
    return
  }

  loading.value = true
  try {
    const response = await fetch('http://localhost:3001/api/chipform/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: loginForm.email, 
        password: loginForm.password
      })
    })

    if (!response.ok) {
      const err = await response.json()
      showToast(t('Login failed: ' + err.message), 'danger')
      loading.value = false
      return
    }

    const data = await response.json()
    userStore.login({
      name: data.name,
      email: data.email,
      role: data.role,
      permissionLevel: data.permission_level,
      organization: data.organization
    })
    showToast(`${t('welcome back')}, ${userStore.name}`, 'success')
    closeLoginModal()

  } catch (error) {
    showToast(t('Request error. Please try again later'), 'danger')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 3. 创建账号逻辑
async function submitCreateAccount() {
  if (
    !createAccountForm.name ||
    !createAccountForm.email ||
    !createAccountForm.password ||
    !createAccountForm.role ||
    !createAccountForm.permission_level ||
    !createAccountForm.organization
  ) {
    showToast(t('Please fill in all fields'), 'warning')
    return
  }

  if (createAccountForm.role.trim() === 'Administrator') {
    showToast(t('Administrator role is not allowed'), 'danger')
    return
  }

  loading.value = true
  try {
    const response = await fetch('http://localhost:3001/api/chipform/create-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: createAccountForm.name,
        email: createAccountForm.email,
        password: createAccountForm.password,
        role: createAccountForm.role,
        permission_level: createAccountForm.permission_level,
        organization: createAccountForm.organization
      })
    })

    if (!response.ok) {
      const err = await response.json()
      showToast(`${t('Create Account Failed')}: ${err.message}`, 'danger')
      loading.value = false
      return
    }

    await response.json()
    showToast(`${t('Account created successfully')}! ${t('Please login to continue')}`, 'success')
    closeCreateAccountModal()
  } catch (error) {
    showToast(`${t('Request error, please try again later')}`, 'danger')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 4. 通用操作
function logout() {
  userStore.logout()
}

function managePermissions() {
  showToast(t('Please connect manager'), 'danger')
  console.log('Go to permissions page')
}

function changePassword() {
  showToast(t('Please connect manager'), 'danger')
  console.log('Navigate to change password')
}

// ✅ 5. 核心业务跳转逻辑
function navigateTo(feature: string) {
  if (!userStore.loggedIn) {
    showToast(t('Please login first'), 'warning')
    return
  }
  
  // 模拟跳转，后期在这里替换为 router.push('/tabs/monitor') 等
  switch(feature) {
    case 'monitor':
      showToast('正在进入实时监测模块...', 'primary')
      router.push('/tabs/monitor') 
      break
    case 'diagnosis':
      showToast('正在初始化AI诊断模型...', 'warning')
      router.push('/tabs/diagnosis')
      break
    case 'history':
      showToast('加载故障历史记录...', 'success')
      router.push('/tabs/history')
      break
  }
}
</script>

<style scoped>
.title-content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 100%;
}
.title-wrapper {
    display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 600; color: #333;
  }
.title-icon {
  font-size: 20px;
  color: #000;
}
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
.page-bg {
  --background: #f6f7f9;
}
.home-title {
  display: flex;
  justify-content: center;
  align-items: center;
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

/* ✅ 新增：卡片标题样式 */
.card-header-item {
  --min-height: 50px;
  --padding-start: 16px;
  font-weight: 600;
  border-bottom: 1px solid #f0f0f0;
}
</style>