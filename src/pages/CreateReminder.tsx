import { useEffect, useState } from 'react';
import {
    CreateReminderForm,
    EnumReminderFrequency,
    EnumReminderFrequencyName,
} from '../types/reminders';
import { FormHelper } from '../utils/form';
import { CreateReminderApi } from '../apis/reminders';
import moment from 'moment';
import { useLocation } from 'react-router-dom';
import UpsertReminder from '../components/reminders/UpsertReminder';

export default function CreateReminder() {
    const initForm: any = {};
    let { form, setForm, setField } = FormHelper<CreateReminderForm>(initForm);
    const [key, setKey] = useState(0);

    // 填入navigation帶進來的參數
    const location = useLocation();
    useEffect(() => {
        if (location.state) {
            if (location.state.frequency) {
                setField('frequency', location.state.frequency);
            }
            if (location.state.date) {
                const date = moment(location.state.date);
                setField('fullDate', date.toDate());
                setField('time', date.format('HH:mm'));
            }
        }
    }, [location.state]);

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const lineId = localStorage.getItem('lineId');
        form.userId = lineId ?? '';
        // 請求reminder-note-api
        const result = await CreateReminderApi(form);
        if (result) {
            // 清空表單
            setForm(initForm);
            setKey((prev) => prev + 1);
        }
    };

    return (
        <UpsertReminder
            title="新增提醒"
            form={form}
            setField={setField}
            onSubmit={submit}
            resetKey={key}
        />
    );
}
