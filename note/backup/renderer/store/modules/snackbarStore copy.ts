import { defineStore } from 'pinia'

type MessageType = '' | 'info' | 'success' | 'error' | 'warning'

interface SnackMessage {
  isShow: boolean
  message: string
  type: MessageType
  timeout: number
}

export const useSnackbarStore = defineStore({
  id: 'snackbarStore',
  state: (): SnackMessage => ({
    isShow: false,
    message: '',
    type: '',
    timeout: 5000
  }),

  persist: [{ storage: sessionStorage.localStorage, paths: [''] }],

  getters: {},
  actions: {
    showMessage(message: string) {
      this.isShow = true
      this.message = message
      this.type = ''
    },

    showErrorMessage(message: string) {
      this.isShow = true
      this.message = message
      this.type = 'error'
    },
    showSuccessMessage(message: string) {
      this.isShow = true
      this.message = message
      this.type = 'success'
    },
    showInfoMessage(message: string) {
      this.isShow = true
      this.message = message
      this.type = 'info'
    },
    showWarningMessage(message: string) {
      this.isShow = true
      this.message = message
      this.type = 'warning'
    }
  }
})
