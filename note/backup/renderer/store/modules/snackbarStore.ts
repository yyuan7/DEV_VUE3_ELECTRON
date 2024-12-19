import { ref } from 'vue'
import { defineStore } from 'pinia'

type MessageType = '' | 'info' | 'success' | 'error' | 'warning'

interface SnackMessage {
  isShow: boolean
  message: string
  type: MessageType
  timeout: number
}

export const useSnackbarStore = defineStore('snackbarStore', () => {
  // State
  const snackbar = ref<SnackMessage>({
    isShow: false,
    message: '',
    type: '',
    timeout: 5000
  })

  // Actions
  const showMessage = (msg: string, type: MessageType = '') => {
    snackbar.value.isShow = true
    snackbar.value.message = msg
    snackbar.value.type = type
  }

  const showErrorMessage = (msg: string) => showMessage(msg, 'error')
  const showSuccessMessage = (msg: string) => showMessage(msg, 'success')
  const showInfoMessage = (msg: string) => showMessage(msg, 'info')
  const showWarningMessage = (msg: string) => showMessage(msg, 'warning')

  // Method to hide the snackbar
  const hideMessage = () => {
    snackbar.value.isShow = false
    snackbar.value.message = ''
    snackbar.value.type = ''
  }

  return {
    snackbar,
    showMessage,
    showErrorMessage,
    showSuccessMessage,
    showInfoMessage,
    showWarningMessage,
    hideMessage
  }
})
