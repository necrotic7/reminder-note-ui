import { useEffect, useState } from "react";
import { EnumReminderFrequency, EnumReminderFrequencyName, GetReminderListForm, ReminderBody, RemindTimeBody } from "../types/reminders";
import { DeleteReminder, GetUserReminders } from "../apis/reminders";
import { FormHelper } from "../utils/form";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export default function ReminderList() {
    const navigate = useNavigate();
    let { form, setForm, setField } = FormHelper(new GetReminderListForm())

    const [reminderStates, setReminder] = useState<ReminderBody[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [reload, setReload] = useState<number>(0);
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

    // 初始化資料
    useEffect(() => {
        fetchReminders();
    }, [navigate, reload])

    // 刪除Reminder
    const deleteReminder = async () => {
        try {
            if (!deleteId) return;
            const lineId = localStorage.getItem('lineId')!;
            await DeleteReminder({
                userId: lineId,
                id: deleteId,
            });
            setReload(reload+1);
        } catch (err) {
            console.error('API Error:', err);
        }
    }

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
                                <button
                                    className="btn btn-error btn-sm btn-soft"
                                    onClick={() => {
                                        setDeleteId(reminder.id)
                                        setShowDeleteModal(true)
                                    }}
                                >刪除</button>
                            </div>
                        </div>
                    </div>

                ))}
                {showDeleteModal && (
                    <div className="modal modal-open">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">確認刪除</h3>
                            <p className="py-4">你確定要刪除這筆提醒嗎？</p>
                            <div className="modal-action">
                                <button className="btn" onClick={() => setShowDeleteModal(false)}>取消</button>
                                <button
                                    className="btn btn-error"
                                    onClick={() => {
                                        deleteReminder();
                                        setShowDeleteModal(false);
                                        setDeleteId(null);
                                    }}>
                                    確定刪除
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function getFmtRemindTime(frequency: EnumReminderFrequency, remindTime: RemindTimeBody) {
    let timeString = moment().set({ hour: remindTime.hour, minute: remindTime.minute }).format('HH:mm');
    let dateString = ''
    switch (frequency) {
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