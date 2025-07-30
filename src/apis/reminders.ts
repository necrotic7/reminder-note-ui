import { ReminderNoteApi, showErrorToast } from './api'

export async function CreateReminderApi(data: any) {
    try{
        const res = await ReminderNoteApi.post('/reminders', data)
        return res.data
    } catch(err) {
        console.log(err)
        showErrorToast(`創建提醒失敗：${err?.response?.data?.message ?? err}`)
    }
}