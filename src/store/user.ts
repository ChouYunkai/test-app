// src/stores/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    loggedIn: false,
    name: '',
    email: '',
    role: '',
    permissionLevel: '',
    organization: ''
  }),
  actions: {
    login(userData: {
      name: string
      email: string
      role: string
      permissionLevel: string
      organization: string
    }) {
      this.loggedIn = true
      this.name = userData.name
      this.email = userData.email
      this.role = userData.role
      this.permissionLevel = userData.permissionLevel
      this.organization = userData.organization
    },
    logout() {
      this.loggedIn = false
      this.name = ''
      this.email = ''
      this.role = ''
      this.permissionLevel = ''
      this.organization = ''
    }
  },
  getters: {
    isAdmin: (state) => state.role === 'Administrator'
  }
})
