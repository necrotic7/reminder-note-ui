import { useEffect, useMemo, useState } from "react";
import { EnumReminderFrequency, EnumReminderFrequencyName, GetReminderListForm, ReminderBody, RemindTimeBody } from "../types/reminders";
import { DeleteReminder, GetUserReminders } from "../apis/reminders";
import { FormHelper } from "../utils/form";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { Pagination } from "../components/Pagination";

export default function ReminderList() {
    const navigate = useNavigate();

    // 搜尋
    let { form, setField } = FormHelper(new GetReminderListForm());
    const [reminderStates, setReminder] = useState<ReminderBody[]>([]);
    const [reminderCounts, setReminderCounts] = useState(0);
    // 刪除
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    // 刷新
    const [reload, setReload] = useState<number>(0);

    const fetchReminders = async () => {
        try {
            const lineId = localStorage.getItem('lineId')!;
            form.userId = lineId;
            const resp = await GetUserReminders(form);
            setReminder(resp?.data?.records ?? []);
            setReminderCounts(resp?.data?.counts ?? 0)
        } catch (err) {
            console.error('API Error:', err);
        }
    };

    // 初始化資料
    useEffect(() => {
        fetchReminders();
    }, [navigate, reload, form.page])

    // 刪除Reminder
    const deleteReminder = async () => {
        try {
            if (!deleteId) return;
            const lineId = localStorage.getItem('lineId')!;
            await DeleteReminder({
                userId: lineId,
                id: deleteId,
            });
            setReload(reload + 1);
        } catch (err) {
            console.error('API Error:', err);
        }
    }

    const handlePageChange = (page) => {
        setField('page', page);
    };

    const handlePageSizeChange = (size) => {
        setField('pageSize', size)
        setField('page', 1);; // 重置到第一頁
    };

    return (
        <div >
            <ReminderSearch onSearch={fetchReminders} form={form} setField={setField} />
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
            {/* 分頁元件 */}
            <Pagination
                currentPage={form.page}
                totalItems={reminderCounts}
                pageSize={form.pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                showSizeChanger
                showTotal
                maxVisiblePages={5}
            />
        </div>
    )
}

function ReminderSearch({ onSearch, form, setField }: { onSearch: (params: any) => void, form: GetReminderListForm, setField: (key: keyof GetReminderListForm, value: any) => void }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="card bg-base-100 shadow-sm p-4 mb-6 card-xs max-w-4xl mx-auto">
            {/* 頂部控制區 - 包含標題和按鈕 */}
            <div className="flex justify-between mb-4">
                <h3 className="text-lg font-semibold">搜尋條件</h3>
                <div className="flex gap-2">
                    <button
                        className="btn btn-primary w-16"
                        onClick={() => onSearch(form)}
                    >
                        搜尋
                    </button>
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        aria-label={isCollapsed ? "展開" : "折疊"}
                    >
                        {isCollapsed ? "▼" : "▲"}
                    </button>
                </div>
            </div>

            {/* 可折疊的搜尋表單區 */}
            {!isCollapsed && (
                <div className="flex justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
                        <fieldset className="fieldset grid grid-cols-2 gap-3">
                            <legend className="fieldset-legend">建立時間</legend>
                            <DatePicker
                                name="createStartTime"
                                selected={form.createStartTime}
                                onChange={(date) => {
                                    if (date) setField('createStartTime', date)
                                }}
                                className="input input-bordered"
                                placeholderText="開始"
                            />
                            <DatePicker
                                name="createEndTime"
                                selected={form.createEndTime}
                                onChange={(date) => {
                                    if (date) setField('createEndTime', date)
                                }}
                                className="input input-bordered"
                                placeholderText="結束"
                            />
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">標題</legend>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={(e) => setField('title', e.target.value)}
                                className="input input-bordered"
                                placeholder="標題"
                            />
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">內容</legend>
                            <input
                                type="text"
                                name="content"
                                value={form.content}
                                onChange={(e) => setField('content', e.target.value)}
                                className="input input-bordered"
                                placeholder="內容"
                            />
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">提醒頻率</legend>
                            <select
                                name="frequency"
                                value={form.frequency}
                                onChange={(e) => setField('frequency', e.target.value)}
                                className="select select-bordered"
                            >
                                <option value="">全部</option>
                                {Object.entries(EnumReminderFrequencyName).map(([key, val]) =>
                                    (<option key={key} value={key}>{val}</option>)
                                )}
                            </select>
                        </fieldset>
                    </div>
                </div>
            )}
        </div>
    );
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