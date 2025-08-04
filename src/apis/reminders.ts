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
                hour: safeParseInt(data.hour),
                minute: safeParseInt(data.minute),
                weekday: safeParseInt(data.weekday),
                date: safeParseInt(data.date),
                month: safeParseInt(data.month),
                year: safeParseInt(data.year),
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

export async function GetUserReminders(userId: string) {
    try{
        const queryParams = new URLSearchParams();
        queryParams.set('userId', userId)
        const endpoint = `/reminders?${queryParams.toString()}`
        const result = await ReminderNoteApi.get(endpoint)

        return result;
    } catch(err) {
        console.log(err)
        showErrorToast(`取得提醒失敗：${err?.response?.data?.message ?? err}`)
    }
}

function safeParseInt(val: any) {
    return isNaN(parseInt(val)) ? 0 : parseInt(val)
}