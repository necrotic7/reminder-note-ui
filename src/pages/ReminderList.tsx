import { useEffect, useState } from "react";
import { EnumReminderFrequency, EnumReminderFrequencyName, ReqGetReminderListBody, ReminderBody, RemindTimeBody, ReqUpdateReminderBody, UpdateReminderForm } from "../types/reminders";
import { DeleteReminder, GetUserReminders, UpdateReminderApi } from "../apis/reminders";
import { FormHelper } from "../utils/form";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { Pagination } from "../components/Pagination";
import UpsertReminder from "../components/UpsertReminder";

export default function ReminderList() {
    const navigate = useNavigate();
    const userId = localStorage.getItem('lineId')!;
    // 搜尋
    let { form: searchForm, setField: setSearchField } = FormHelper<ReqGetReminderListBody>({
        userId,
        pageSize: 10,
    });
    const [reminderStates, setReminder] = useState<ReminderBody[]>([]);
    const [reminderCounts, setReminderCounts] = useState(0);
    // 刪除
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    // 編輯
    let { form: updateForm, setForm: setUpdateForm, setField: setUpdateField } = FormHelper<UpdateReminderForm>({
        userId,
    });
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    // 刷新
    const [reload, setReload] = useState<number>(0);

    const fetchReminders = async () => {
        try {
            searchForm.userId = userId;
            const resp = await GetUserReminders(searchForm);
            setReminder(resp?.data?.records ?? []);
            setReminderCounts(resp?.data?.counts ?? 0)
        } catch (err) {
            console.error('API Error:', err);
        }
    };

    // 初始化資料
    useEffect(() => {
        fetchReminders();
    }, [navigate, reload, searchForm.page])

    // 刪除Reminder
    const deleteReminder = async () => {
        try {
            if (!deleteId) return;
            await DeleteReminder({
                userId,
                id: deleteId,
            });
            setReload((pre) => pre + 1);
        } catch (err) {
            console.error('API Error:', err);
        }
    }

    // TODO 分頁行爲整併入component
    useEffect(() => {
        setSearchField('page', 1); // 重置到第一頁
    }, [reminderCounts])

    const handlePageChange = (page) => {
        setSearchField('page', page);
    };

    const handlePageSizeChange = (size) => {
        setSearchField('pageSize', size)
        setSearchField('page', 1); // 重置到第一頁
    };

    return (
        <div >
            <ReminderSearch onSearch={fetchReminders} form={searchForm} setField={setSearchField} />
            <div className="flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {reminderStates.map((r, idx) => (
                        <div key={idx} className="card card-border border-gray-700 w-80 bg-base-100 card-sm shadow-sm">
                            <div className="card-body">
                                <h2 className="card-title">{r.title}</h2>
                                <p>{r.content}</p>
                                <p>{EnumReminderFrequencyName[r.frequency]} {getFmtRemindTime(r.frequency, r.remindTime)} 提醒</p>
                                <p className="text-base-content/50">建立時間：{moment(r.createdAt).format('YYYY/MM/DD HH:mm:ss')}</p>
                                <div className="justify-end card-actions">
                                    <button
                                        className="btn btn-primary btn-sm btn-soft"
                                        onClick={() => {
                                            setUpdateForm({
                                                ...r,
                                                userId,
                                                hour: r.remindTime.hour.toString(),
                                                minute: r.remindTime.minute.toString(),
                                                year: r.remindTime.year.toString(),
                                                month: r.remindTime.month.toString(),
                                                weekday: r.remindTime.weekday.toString(),
                                                date: r.remindTime.date.toString(),
                                                time:  moment().set({ hour: r.remindTime.hour, minute: r.remindTime.minute }).format('HH:mm'),
                                                fullDate: moment(`${r.remindTime.year}-${r.remindTime.month}-${r.remindTime.date}`).toDate()
                                            })
                                            setShowUpdateModal(true)
                                        }}
                                    >編輯</button>
                                    <button
                                        className="btn btn-error btn-sm btn-soft"
                                        onClick={() => {
                                            setDeleteId(r.id)
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
                    {showUpdateModal && (
                        <UpdateReminderModalForm
                            setModal={setShowUpdateModal}
                            updateForm={updateForm}
                            setField={setUpdateField}
                            setReload={setReload}
                        />
                    )}
                </div>

            </div>
            {/* 分頁元件 */}
            <Pagination
                currentPage={searchForm.page}
                totalItems={reminderCounts}
                pageSize={searchForm.pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                showSizeChanger
                showTotal
                maxVisiblePages={5}
            />
        </div>
    )
}

function ReminderSearch({ onSearch, form, setField }: { onSearch: (params: any) => void, form: ReqGetReminderListBody, setField: (key: keyof ReqGetReminderListBody, value: any) => void }) {
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

function UpdateReminderModalForm(
    { setModal, updateForm, setField, setReload }: {
        setModal: (value: React.SetStateAction<boolean>) => void,
        updateForm: UpdateReminderForm,
        setField: (key: keyof UpdateReminderForm, value: any) => void,
        setReload: (value: React.SetStateAction<number>) => void,
    }) {

    const handleSubmit = async (e) => {
        try{
            e.preventDefault();
            await UpdateReminderApi(updateForm);
            setModal(false)
            setReload((pre) => pre + 1);
        } catch(err) {
            console.log(`更新提醒失敗：`, err);
        }
    };

    const handleClose = () => {
        setModal(false);
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-md shadow-xl">
                {/* 標題區域 */}
                <div className="flex justify-end">
                    <button
                        onClick={handleClose}
                        className="btn btn-sm btn-circle btn-ghost hover:bg-gray-100"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <UpsertReminder
                    title="編輯提醒"
                    form={updateForm}
                    setField={setField}
                    onSubmit={handleSubmit}
                />
            </div>
            {/* 點擊外部關閉 - 移到modal-box外面 */}
            <div className="modal-backdrop" onClick={handleClose}></div>
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