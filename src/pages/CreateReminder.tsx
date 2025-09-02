import {
    UpsertReminderForm,
} from '../types/reminders';
import { CreateReminderApi } from '../apis/reminders';
import { useLocation } from 'react-router-dom';
import UpsertReminder from '../components/reminders/UpsertReminder';
import { EnumLocalStorageKey } from '../consts/localStorage';
import dayjs from 'dayjs';

export default function CreateReminder() {
    // 填入navigation帶進來的參數
    const location = useLocation();
    const buildInitialValues = () => {
        const values: Partial<UpsertReminderForm> = {};

        if (location.state?.frequency) {
            values.frequency = location.state.frequency;
        }

        if (location.state?.date) {
            const date = dayjs(location.state.date);
            values.fullDate = date;
            values.time = date;
        }

        return values;
    };

    const submit = async (form: UpsertReminderForm) => {
        const lineId = localStorage.getItem(EnumLocalStorageKey.LineID);
        // 請求reminder-note-api
        await CreateReminderApi(lineId!, form);
    };

    return (
        <UpsertReminder
            title="新增提醒"
            onSubmit={submit}
            initialValues={buildInitialValues()}
        />
    );
}
