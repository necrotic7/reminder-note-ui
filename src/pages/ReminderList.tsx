import { useEffect, useState } from "react";
import { EnumReminderFrequency, EnumReminderFrequencyName, GetReminderListForm, ReminderBody, RemindTimeBody } from "../types/reminders";
import { GetUserReminders } from "../apis/reminders";
import { FormHelper } from "../utils/form";
import moment from "moment";

export default function ReminderList() {
    let { form, setForm, setField } = FormHelper(new GetReminderListForm())
    
    const [reminderStates, setReminder] = useState<ReminderBody[]>([]);

    const fetchReminders = async () => {
        try {
            const lineId = localStorage.getItem('lineId')!;
            form.userId = lineId;
            const resp = await GetUserReminders(form);
            if (resp?.data) setReminder(resp.data);
        } catch (err) {
            console.error('API Error:', err);
        }
    };

    useEffect(() => {
        fetchReminders();
    }, [])


    return (
        <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reminderStates.map((reminder, idx) => (
                <div key={idx} className="card card-border border-gray-700 w-80 bg-base-100 card-sm shadow-sm">
                <div className="card-body">
                    <h2 className="card-title">{reminder.title}</h2>
                    <p>{reminder.content}</p>
                    <p>{EnumReminderFrequencyName[reminder.frequency]}提醒：{getFmtRemindTime(reminder.frequency, reminder.remindTime)}</p>
                    <div className="justify-end card-actions">
                    <button className="btn btn-primary btn-sm btn-soft">編輯</button>
                    <button className="btn btn-error btn-sm btn-soft">刪除</button>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>
    )
}

function getFmtRemindTime(frequency: EnumReminderFrequency, remindTime: RemindTimeBody) {
    let timeString = moment().set({ hour: remindTime.hour, minute: remindTime.minute}).format('HH:mm');
    let dateString = ''
    switch(frequency){
        case EnumReminderFrequency.Once:
            dateString = moment(`${remindTime.year}-${remindTime.month}-${remindTime.date}`).format('YYYY年MM月DD日')
            break;
        case EnumReminderFrequency.Weekly:
            const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
            dateString = weekdays[remindTime.weekday];
            break;
        case EnumReminderFrequency.Monthly:
            dateString = `${remindTime.date}日`
            break;
        case EnumReminderFrequency.Annually:
            dateString = moment(`${remindTime.year}-${remindTime.month}-${remindTime.date}`).format('MM月DD日')
    }
    return `${dateString} ${timeString}`;
}