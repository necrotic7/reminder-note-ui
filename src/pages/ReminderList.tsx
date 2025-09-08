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
import ComponentUpsertReminderForm from '../components/reminders/UpsertReminderForm';
import { EnumLocalStorageKey } from '../consts/localStorage';
import dayjs from 'dayjs';
import { Button, Card, Col, Collapse, DatePicker, Form, Input, Layout, Modal, Pagination, Row, Select } from 'antd';
import { FormInstance, useForm, useWatch } from 'antd/es/form/Form';
import { FormPagination } from '../components/common/Pagination';
const { RangePicker } = DatePicker;

export default function ReminderList() {
    const userId = localStorage.getItem(EnumLocalStorageKey.LineID)!;
    // 搜尋
    const [searchForm] = useForm<ReqGetReminderListBody>();
    const page = useWatch('page', searchForm)
    const pageSize = useWatch('pageSize', searchForm)
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
            const resp = await GetUserReminders(userId, searchForm.getFieldsValue());
            setReminder(resp?.data?.records ?? []);
            setReminderCounts(resp?.data?.counts ?? 0);
        } catch (err) {
            console.error('API Error:', err);
        }
    };

    // 初始化資料
    useEffect(() => {
        fetchReminders();
    }, [reload, page, pageSize]);

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
                form={searchForm}
                onSearch={fetchReminders}
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
            <FormPagination
                form={searchForm}
                total={reminderCounts}
            />
        </Layout>
    );
}

function ReminderSearch({
    form,
    onSearch,
}: {
    form: FormInstance<ReqGetReminderListBody>;
    onSearch: () => void;
}) {
    const span = { xs: 24, sm: 12 };
    return (
        <Collapse style={{ width: '80%', marginBottom: 20 }}>
            <Collapse.Panel header="搜尋條件" key="1">

                <Form
                    layout='vertical'
                    variant={'filled'}
                    form={form}
                    onFinish={onSearch}
                >
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col {...span}>
                            <Form.Item
                                label="標題"
                                name="title"
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col {...span}>
                            <Form.Item
                                label="建立時間"
                            >
                                <RangePicker
                                    onChange={(data) => {
                                        form.setFieldValue('createStartTime', data?.[0]);
                                        form.setFieldValue('createEndTime', data?.[1]);
                                    }}
                                />
                            </Form.Item>
                            {/* 給rangePicker設值的隱藏欄位 */}
                            <Form.Item name="createStartTime" noStyle></Form.Item>
                            <Form.Item name="createEndTime" noStyle></Form.Item>
                        </Col>

                        <Col {...span}>
                            <Form.Item
                                label="內容"
                                name="content"
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col {...span}>
                            <Form.Item
                                label="提醒頻率"
                                name="frequency"
                            >
                                <Select<EnumReminderFrequency>
                                >
                                    {Object.entries(EnumReminderFrequencyName).map(
                                        ([key, val]) => (
                                            <Select.Option value={key}>{val}</Select.Option>
                                        ),
                                    )}
                                </Select>
                            </Form.Item>
                        </Col>

                    </Row>

                    <Form.Item style={{ textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit">
                            送出
                        </Button>
                    </Form.Item>
                </Form>

            </Collapse.Panel>
        </Collapse>
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
