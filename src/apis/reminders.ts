import { CreateReminderForm, DeleteReminderBody, GetReminderListForm, ReqCreateReminderPayload, RespGetRemindersBody } from '../types/reminders'
import { DateToUnix } from '../utils/common'
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
        return false
    }
}

export async function GetUserReminders(params: GetReminderListForm) {
    try{
        const queryParams = new URLSearchParams();
        queryParams.set('userId', params.userId)

        if (params.page) {
            queryParams.set('page', params.page.toString())
        }
        if (params.pageSize) {
            queryParams.set('pageSize', params.pageSize.toString())
        }
        if (params.createStartTime) {
            const st = DateToUnix(params.createStartTime);
            queryParams.set('startTime', st.toString())
        }
        if (params.createEndTime) {
            const et = DateToUnix(params.createEndTime);
            queryParams.set('endTime', et.toString())
        }
        if (params.title) {
            queryParams.set('title', params.title)
        }
        if (params.content) {
            queryParams.set('content', params.content)
        }
        if (params.frequency) {
            queryParams.set('frequency', params.frequency)
        }
        
        const endpoint = `/reminders?${queryParams.toString()}`
        const result = await ReminderNoteApi.get<RespGetRemindersBody>(endpoint)

        return result.data;
    } catch(err) {
        console.log(err)
        showErrorToast(`取得提醒失敗：${err?.response?.data?.message ?? err}`)
    }
}

export async function DeleteReminder(params: DeleteReminderBody) {
    try{
        await ReminderNoteApi.delete('/reminders', { data: params })
        showSuccessToast('刪除成功')
        return true
    } catch(err) {
        console.log(err)
        showErrorToast(`刪除提醒失敗：${err?.response?.data?.message ?? err}`)
        return false
    }
}

function safeParseInt(val: any) {
    return isNaN(parseInt(val)) ? 0 : parseInt(val)
}