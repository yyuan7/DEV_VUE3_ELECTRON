/** Title Management */

import { ref, watch } from 'vue'

export const APP_TITLE = import.meta.env.VITE_APP_TITLE ?? 'Clynk-hook-useTitle-Title'

const dynamicTitle = ref<string>('')

/** Set the app title dynamically */
const setTitle = (title?: string) => {
  dynamicTitle.value = title ? `${APP_TITLE} | ${title}` : APP_TITLE
}

/** Watcher - monitor title changes */
watch(dynamicTitle, (value, oldValue) => {
  if (document && value !== oldValue) {
    document.title = value
  }
})

export function useTitle() {
  return { setTitle }
}
