import { CreateReminderForm, ReqCreateReminderPayload } from '../types/reminders'
import { ReminderNoteApi, showErrorToast, showSuccessToast } from './api'

export async function CreateReminderApi(data: CreateReminderForm) {
    try{
        const payload: ReqCreateReminderPayload = {
            userId: data.userId,
            title: data.title,
            content: data.content,
            frequency: data.frequency,
            remindTime: {
                hour: data.hour,
                minute: data.minute,
                weekday: data.weekday,
                date: data.date,
                month: data.month,
                year: data.year,
            }
        }
        await ReminderNoteApi.post('/reminders', payload)
        showSuccessToast('創建成功')
        return true
    } catch(err) {
        console.log(err)
        showErrorToast(`創建提醒失敗：${err?.response?.data?.message ?? err}`)
    }
}