import { useEffect, useState } from 'react';
import {
    EnumReminderFrequency,
    EnumReminderFrequencyName,
    ReqGetReminderListBody,
    ReminderBody,
    RemindTimeBody,
    UpsertReminderForm,
} from '../types/reminders';
import {
    DeleteReminder,
    GetUserReminders,
    UpdateReminderApi,
} from '../apis/reminders';
import { useFormHelper } from '../utils/form';
import DatePicker from 'react-datepicker';
import { Pagination } from '../components/common/Pagination';
import ComponentUpsertReminderForm from '../components/reminders/UpsertReminderForm';
import { EnumLocalStorageKey } from '../consts/localStorage';
import dayjs from 'dayjs';
import { Button, Card, Col, Layout, Modal, Row } from 'antd';

export default function ReminderList() {
    const userId = localStorage.getItem(EnumLocalStorageKey.LineID)!;
    // 搜尋
    let { form: searchForm, setField: setSearchField } =
        useFormHelper<ReqGetReminderListBody>({
            userId,
            pageSize: 10,
        });
    const [reminderStates, setReminder] = useState<ReminderBody[]>([]);
    const [reminderCounts, setReminderCounts] = useState(0);
    // 刪除
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    // 編輯
    let [updateReminder, setUpdateReminder] = useState<ReminderBody>();
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    // 刷新
    const [reload, setReload] = useState<number>(0);

    const fetchReminders = async () => {
        try {
            searchForm.userId = userId;
            const resp = await GetUserReminders(searchForm);
            setReminder(resp?.data?.records ?? []);
            setReminderCounts(resp?.data?.counts ?? 0);
        } catch (err) {
            console.error('API Error:', err);
        }
    };

    // 初始化資料
    useEffect(() => {
        fetchReminders();
    }, [reload, searchForm.page]);

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
    };

    return (
        <Layout style={{
            display: 'flex',
            alignItems: 'center',
        }}>
            <ReminderSearch
                onSearch={fetchReminders}
                form={searchForm}
                setField={setSearchField}
            />
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} >
                {reminderStates.map((r, idx) => (
                    <Col xs={24} sm={12} key={idx} >
                        <Card
                            title={r.title} style={{ margin: 15 }}
                            actions={[
                                <Button
                                    color='primary'
                                    variant='outlined'
                                    onClick={() => {
                                        setUpdateReminder(r);
                                        setShowUpdateModal(true);
                                    }}
                                >
                                    編輯
                                </Button>,
                                <Button
                                    danger
                                    onClick={() => {
                                        setDeleteId(r.id);
                                        setShowDeleteModal(true);
                                    }}
                                >
                                    刪除
                                </Button>
                            ]}
                        >
                            <p>{r.content}</p>
                            <p>
                                {EnumReminderFrequencyName[r.frequency]}{' '}
                                {getFmtRemindTime(
                                    r.frequency,
                                    r.remindTime,
                                )}{' '}
                                提醒
                            </p>
                            <p style={{ color: '#8c8c8c' }}>
                                建立時間：
                                {dayjs(r.createdAt).format(
                                    'YYYY/MM/DD HH:mm:ss',
                                )}
                            </p>
                        </Card>
                    </Col>
                ))}
                <Modal
                    title="刪除"
                    open={showDeleteModal}
                    onCancel={() => setShowDeleteModal(false)}
                    onOk={() => {
                        deleteReminder();
                        setShowDeleteModal(false);
                        setDeleteId(null);
                    }}
                >
                    <p >你確定要刪除這筆提醒嗎？</p>
                </Modal>
                <Modal
                    title="編輯提醒"
                    open={showUpdateModal}
                    onCancel={() => setShowUpdateModal(false)}
                    footer={null}
                    >
                    <UpdateReminderModalForm
                        setModal={setShowUpdateModal}
                        setReload={setReload}
                        updateReminderBody={updateReminder}
                    />
                </Modal>

            </Row>
            {/* 分頁元件 */}
            <Pagination
                currentPage={searchForm.page ?? 1}
                totalItems={reminderCounts}
                pageSize={searchForm.pageSize ?? 10}
                setField={setSearchField}
                showSizeChanger
                showTotal
            />
        </Layout>
    );
}

function ReminderSearch({
    onSearch,
    form,
    setField,
}: {
    onSearch: (params: any) => void;
    form: ReqGetReminderListBody;
    setField: (key: keyof ReqGetReminderListBody, value: any) => void;
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="card-searchbar">
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
                        aria-label={isCollapsed ? '展開' : '折疊'}
                    >
                        {isCollapsed ? '▼' : '▲'}
                    </button>
                </div>
            </div>

            {/* 可折疊的搜尋表單區 */}
            {!isCollapsed && (
                <div className="flex justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
                        <fieldset className="fieldset grid grid-cols-2 gap-3">
                            <legend className="fieldset-legend">
                                建立時間
                            </legend>
                            <DatePicker
                                name="createStartTime"
                                selected={form.createStartTime}
                                onChange={(date) => {
                                    if (date) setField('createStartTime', date);
                                }}
                                className="input input-bordered"
                                placeholderText="開始"
                            />
                            <DatePicker
                                name="createEndTime"
                                selected={form.createEndTime}
                                onChange={(date) => {
                                    if (date) setField('createEndTime', date);
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
                                onChange={(e) =>
                                    setField('title', e.target.value)
                                }
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
                                onChange={(e) =>
                                    setField('content', e.target.value)
                                }
                                className="input input-bordered"
                                placeholder="內容"
                            />
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">
                                提醒頻率
                            </legend>
                            <select
                                name="frequency"
                                value={form.frequency}
                                onChange={(e) =>
                                    setField('frequency', e.target.value)
                                }
                                className="select select-bordered"
                            >
                                <option value="">全部</option>
                                {Object.entries(EnumReminderFrequencyName).map(
                                    ([key, val]) => (
                                        <option key={key} value={key}>
                                            {val}
                                        </option>
                                    ),
                                )}
                            </select>
                        </fieldset>
                    </div>
                </div>
            )}
        </div>
    );
}

function UpdateReminderModalForm({
    setModal,
    setReload,
    updateReminderBody,
}: {
    setModal: (value: React.SetStateAction<boolean>) => void
    setReload: (value: React.SetStateAction<number>) => void;
    updateReminderBody?: ReminderBody;
}) {

    let upsertReminderForm: Partial<UpsertReminderForm> = {};
    if (updateReminderBody) {
        const { remindTime } = updateReminderBody;
        const now = dayjs();
        let fullDate: dayjs.Dayjs | undefined;
        if (remindTime.year) {
            fullDate = now.year(remindTime.year);
        }
        if (remindTime.month) {
            fullDate = now.month(remindTime.month);
        }
        if (remindTime.date) {
            fullDate = now.date(remindTime.date);
        }

        upsertReminderForm = {
            id: updateReminderBody.id,
            title: updateReminderBody.title,
            content: updateReminderBody.content,
            frequency: updateReminderBody.frequency,
            weekday: remindTime.weekday,
            date: remindTime.date,
            time: dayjs().hour(remindTime.hour).minute(remindTime.minute),
            fullDate,
        };
    }

    const handleSubmit = async (v: UpsertReminderForm) => {
        try {
            const lineId = localStorage.getItem(EnumLocalStorageKey.LineID);
            await UpdateReminderApi(lineId!, v);
            setModal(false)
            setReload((pre) => pre + 1);
        } catch (err) {
            console.log(`更新提醒失敗：`, err);
        }
    };

    return (
        <ComponentUpsertReminderForm
            initialValues={upsertReminderForm}
            onSubmit={handleSubmit}
        />
    );
}

function getFmtRemindTime(
    frequency: EnumReminderFrequency,
    remindTime: RemindTimeBody,
) {
    let timeString = dayjs()
        .hour(remindTime.hour).minute(remindTime.minute)
        .format('HH:mm');
    let dateString = '';
    switch (frequency) {
        case EnumReminderFrequency.Once:
            dateString = dayjs(
                `${remindTime.year}-${remindTime.month}-${remindTime.date}`,
            ).format('YYYY年MM月DD日');
            break;
        case EnumReminderFrequency.Weekly:
            const weekdays = [
                '星期日',
                '星期一',
                '星期二',
                '星期三',
                '星期四',
                '星期五',
                '星期六',
            ];
            dateString = weekdays[remindTime.weekday!];
            break;
        case EnumReminderFrequency.Monthly:
            dateString = `${remindTime.date}日`;
            break;
        case EnumReminderFrequency.Annually:
            dateString = dayjs(
                `${remindTime.year}-${remindTime.month}-${remindTime.date}`,
            ).format('MM月DD日');
    }
    return `${dateString} ${timeString}`;
}
