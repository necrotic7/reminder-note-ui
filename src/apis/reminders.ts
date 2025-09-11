import { Toast } from '../components/common/Toast';
import {
    CreateReminderForm,
    ReqDeleteReminderBody,
    ReqGetReminderListBody,
    ReqCreateReminderBody,
    RespGetRemindersBody,
    UpdateReminderForm,
    ReqUpdateReminderBody,
    UpsertReminderForm,
    EnumReminderFrequency,
} from '../types/reminders';
import { DateToUnix } from '../utils/common';
import { ReminderNoteApi } from './api';

export async function CreateReminderApi(userId: string, form: UpsertReminderForm) {
    try {
        const payload: ReqCreateReminderBody = {
            userId,
            title: form.title,
            content: form.content,
            frequency: form.frequency,
            remindTime: {
                hour: form.time.hour(),
                minute: form.time.minute(),
                weekday: form?.weekday,
                date: (form.frequency == EnumReminderFrequency.Monthly) ? form.date : form.fullDate?.date(),
                month: form.fullDate?.month() ? form.fullDate.month() + 1 : undefined,
                year: form.fullDate?.year(),
            },
        };
        await ReminderNoteApi.post('/reminders', payload);
        Toast.success('創建成功');
        return true;
    } catch (err) {
        console.log(err);
        Toast.error(`創建提醒失敗：${err?.response?.data?.message ?? err}`);
        throw err;
    }
}

export async function UpdateReminderApi(userId: string, form: UpsertReminderForm) {
    try {
        const payload: ReqUpdateReminderBody = {
            id: form.id!,
            userId: userId,
            title: form.title,
            content: form.content,
            frequency: form.frequency,
            remindTime: {
                hour: form.time.hour(),
                minute: form.time.minute(),
                weekday: form?.weekday,
                date: (form.frequency == EnumReminderFrequency.Monthly) ? form.date : form.fullDate?.date(),
                month: form.fullDate?.month() ? form.fullDate.month() + 1 : undefined,
                year: form.fullDate?.year(),
            },
        };
        await ReminderNoteApi.put('/reminders', payload);
        Toast.success('更新成功');
        return true;
    } catch (err) {
        console.log(err);
        Toast.error(`更新提醒失敗：${err?.response?.data?.message ?? err}`);
        throw err;
    }
}

export async function GetUserReminders(userId: string, params: ReqGetReminderListBody) {
    try {
        const queryParams = new URLSearchParams();
        queryParams.set('userId', userId);

        if (params.page) {
            queryParams.set('page', params.page.toString());
        }
        if (params.pageSize) {
            queryParams.set('pageSize', params.pageSize.toString());
        }
        if (params.createStartTime) {
            const st = params.createStartTime.unix();
            queryParams.set('createStartTime', st.toString());
        }
        if (params.createEndTime) {
            const et = params.createEndTime.unix();
            queryParams.set('createEndTime', et.toString());
        }
        if (params.title) {
            queryParams.set('title', params.title);
        }
        if (params.content) {
            queryParams.set('content', params.content);
        }
        if (params.frequency) {
            queryParams.set('frequency', params.frequency);
        }

        const endpoint = `/reminders?${queryParams.toString()}`;
        const result =
            await ReminderNoteApi.get<RespGetRemindersBody>(endpoint);

        return result.data;
    } catch (err) {
        console.log(err);
        Toast.error(`取得提醒失敗：${err?.response?.data?.message ?? err}`);
        throw err;
    }
}

export async function DeleteReminder(params: ReqDeleteReminderBody) {
    try {
        await ReminderNoteApi.delete('/reminders', { data: params });
        Toast.success('刪除成功');
        return true;
    } catch (err) {
        console.log(err);
        Toast.error(`刪除提醒失敗：${err?.response?.data?.message ?? err}`);
        throw err;
    }
}