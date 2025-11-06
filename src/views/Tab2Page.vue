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
      <!-- 个人信息卡片 -->
      <ion-card class="profile-card" v-if="userStore.loggedIn">
        <ion-card-content class="profile-content">
          <ion-avatar class="profile-avatar">
            <img src="https://www.gravatar.com/avatar?d=mp" />
          </ion-avatar>
          <h2 class="username">{{ userStore.name }}</h2>
          <p class="user-email">{{ userStore.email }}</p>
        </ion-card-content>
      </ion-card>

      <!-- 未登录提示 -->
      <div v-else class="login-prompt">
        <p>{{ t('Please login to view account information') }}</p>
      </div>

      <!-- 账号信息卡片 -->
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

      <!-- 操作按钮卡片 -->
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
          <!-- ✅ “创建账号”按钮仅在未登录时显示 -->
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

      <!-- 登录弹窗 -->
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

      <!-- ✅ 创建账号模态框（已新增 name / permission_level / organization） -->
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

import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
  IonIcon, IonAvatar, IonItem, IonLabel, IonInput, IonNote, IonList, IonCard,
  IonCardContent, IonModal
} from '@ionic/vue'

import {
  personCircle, shieldCheckmark, business, settingsOutline,
  keyOutline as keyIcon, logInOutline, logOutOutline,
  personAddOutline, mail
} from 'ionicons/icons'

import { useUserStore } from '@/store/user'
import { useToast } from '@/components/useToast'

const { showToast } = useToast()
const { t } = useI18n()
const showLoginModal = ref(false)
const showCreateAccountModal = ref(false)
const loading = ref(false)
const loginForm = reactive({
  email: '',
  password: ''
})

// ✅ 扩展后的创建账号表单
const createAccountForm = reactive({
  name: '',
  email: '',
  password: '',
  role: '',
  permission_level: '',
  organization: ''
})

const userStore = useUserStore()

function openLoginModal() {
  showLoginModal.value = true
}

function openCreateAccountModal() {
  showCreateAccountModal.value = true
}

async function submitLogin() {
  if (!loginForm.email || !loginForm.password) {
    showToast('请输入邮箱和密码', 'warning')
    return
  }

  loading.value = true
  try {
    const response = await fetch('http://192.168.212.246:3001/api/chipform/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: loginForm.email, 
        password: loginForm.password
      })
    })

    if (!response.ok) {
      const err = await response.json()
      showToast('登录失败: ' + err.message, 'danger')
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
    //关闭模态框
    closeLoginModal()

  } catch (error) {
    showToast('请求异常，请稍后重试', 'danger')
    console.error(error)
  } finally {
    loading.value = false
  }
}

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

  if (createAccountForm.role === 'admin') {
    showToast(t('Admin role is not allowed'), 'danger')
    return
  }

  loading.value = true
  try {
    const response = await fetch('http://192.168.212.246:3001/api/chipform/create-account', {
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

    const data = await response.json()
    userStore.login({
      name: data.name,
      email: data.email,
      role: data.role,
      permissionLevel: data.permission_level,
      organization: data.organization
    })
    showToast(`${t('Account created successfully')}! ${t('Welcome back')}, ${userStore.name}`, 'success')
    closeCreateAccountModal()
  } catch (error) {
    showToast(`${t('Request error, please try again later')}`, 'danger')
    console.error(error)
  } finally {
    loading.value = false
  }
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

function logout() {
  userStore.logout()
}

function managePermissions() {
  showToast('Please connect manager', 'danger')
}

function changePassword() {
  showToast('Please connect manager', 'danger')
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
.title-icon {
  font-size: 20px;
  color: #000;
}
.background-gradient {
  --background: 
    linear-gradient(to bottom, transparent, #fff 240px),
    radial-gradient(20% 150px at 70% 230px, rgba(255, 255, 255, 0.5), transparent),
    radial-gradient(40% 180px at 80% 50px, rgba(249, 236, 224, 0.35), transparent),
    radial-gradient(50% 300px at 90% 100px, rgba(255, 255, 255, 0.76), transparent),
    radial-gradient(20% 150px at 0px 0px, rgba(96, 205, 235, 0.54), transparent),
    radial-gradient(30% 200px at 100px 50px, rgba(225, 160, 160, 0.45), transparent),
    #f4f4f4 !important;
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
}
.profile-card,
.info-card,
.action-card {
  margin-bottom: 16px;
  border-radius: 12px;
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
