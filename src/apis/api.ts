// src/api.ts
import axios from 'axios'

export const ReminderNoteApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function showErrorToast(message: string) {
  const container = document.getElementById('toast-container')
  if (!container) return

  const toast = document.createElement('div')
  toast.className = `alert alert-error shadow-lg flex justify-between items-center gap-2`

  const span = document.createElement('span')
  span.textContent = message

  const btn = document.createElement('button')
  btn.className = 'btn btn-sm btn-circle btn-ghost text-lg'
  btn.innerHTML = '&times;'
  btn.onclick = () => toast.remove()

  toast.appendChild(span)
  toast.appendChild(btn)

  container.appendChild(toast)
}