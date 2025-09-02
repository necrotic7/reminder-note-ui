import { useEffect, useState } from 'react';
import {
    CreateReminderForm,
    EnumReminderFrequency,
    ReqCreateReminderBody,
    UpsertReminderForm,
} from '../types/reminders';
import { useFormHelper } from '../utils/form';
import { CreateReminderApi } from '../apis/reminders';
import { useLocation } from 'react-router-dom';
import UpsertReminder from '../components/reminders/UpsertReminder';
import { EnumLocalStorageKey } from '../consts/localStorage';
import dayjs from 'dayjs';

export default function CreateReminder() {

    const formUtil = useFormHelper<UpsertReminderForm>({
        title: '234'
    });

    // 填入navigation帶進來的參數
    const location = useLocation();
    useEffect(() => {
        if (location.state) {
            if (location.state.frequency) {
                formUtil.setField('frequency', location.state.frequency)
            }
            if (location.state.date) {
                const date = dayjs(location.state.date);
                formUtil.setField('fullDate', date.toDate());
                formUtil.setField('time', date.format('HH:mm'));
            }
        }
    }, [location.state]);

    const submit = async (form: UpsertReminderForm) => {
        const lineId = localStorage.getItem(EnumLocalStorageKey.LineID);
        // 請求reminder-note-api
        await CreateReminderApi(lineId!, form);
    };

    return (
        <UpsertReminder
            title="新增提醒"
            onSubmit={submit}
        />
    );
}
