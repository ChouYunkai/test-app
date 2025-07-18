// composables/useToast.ts
import { toastController } from '@ionic/vue'

export const useToast = () => {
  const showToast = async (message: string, color: 'success' | 'danger' | 'warning' | 'primary' = 'primary') => {
    const toast = await toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    })
    await toast.present()
  }

  return {
    showToast,
  }
}
