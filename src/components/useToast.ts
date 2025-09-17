// composables/useToast.ts
import { toastController } from '@ionic/vue'

let activeToast: HTMLIonToastElement | null = null

export const useToast = () => {
  const showToast = async (
    message: string,
    color: 'success' | 'danger' | 'warning' | 'primary' = 'primary'
  ) => {
    try {
      if (activeToast) {
        await activeToast.dismiss().catch(() => {})
        activeToast = null
      }
      const toast = await toastController.create({
        message,
        duration: 1800,
        color,
        position: 'bottom',
      })
      activeToast = toast
      await toast.present()
      toast.onDidDismiss().then(() => {
        if (activeToast === toast) activeToast = null
      })
    } catch {
      // ignore
    }
  }

  return { showToast }
}
