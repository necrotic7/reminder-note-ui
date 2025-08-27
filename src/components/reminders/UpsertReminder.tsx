import {
    CreateReminderForm,
    EnumReminderFrequency,
    EnumReminderFrequencyName,
    UpdateReminderForm,
    UpsertReminderForm,
} from '../../types/reminders';
import { DaySelect, WeekdaySelect } from '../common/Date';
import 'react-datepicker/dist/react-datepicker.css';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Button, Card, Form, Input, Layout, Select, TimePicker, DatePicker } from 'antd';
import { AntdFormHelper, FormHelper } from '../../types/utils';

export default function UpsertReminder({
    title,
    formUtil,
    onSubmit,
    resetAfterSubmit = true,
}: {
    title: string;
    formUtil: FormHelper<UpsertReminderForm>;
    onSubmit: (val: UpsertReminderForm) => void;
    resetAfterSubmit?: boolean;
}) {
    const { form, setForm, setField } = formUtil;
    console.log(form)
    const [key, setKey] = useState(0);
    const minDate = dayjs().startOf('day');
    const currentYearStart = dayjs().startOf('year');
    const currentYearEnd = dayjs().endOf('year');

    // 提醒頻率更動時，清空所有跟頻率相關的欄位
    useEffect(() => {
        setField('year', '');
        setField('month', '');
        setField('date', '');
        setField('weekday', '');
    }, [form.frequency]);

    // time異動時，解析時間
    useEffect(() => {
        if (form.time) {
            const [hr, min] = form.time.split(':');
            setField('hour', Number(hr));
            setField('minute', Number(min));
        }
    }, [form.time]);

    // fullDate異動時，解析時間
    useEffect(() => {
        if (form.fullDate) {
            setField('year', form.fullDate.getFullYear());
            setField('month', form.fullDate.getMonth() + 1);
            setField('date', form.fullDate.getDate());
        }
    }, [form.fullDate]);

    const onFinish = () => {
        onSubmit(form);
        // 清空表單
        if(resetAfterSubmit) {
            setForm({} as any)
            setKey((prev) => prev + 1);
        };
    }

    return (
        <Layout style={{
            display: 'flex',
            alignItems: 'center',
        }}>
            <Card
                title={title}
                style={{ margin: 20, width: 500, }}>
                <Form
                    key={key}
                    layout='vertical'
                    variant={'filled'}
                    onFinish={onFinish}
                    // initialValues={form}
                >
                    <Form.Item
                        label="標題"
                        name="title"
                        rules={[{ required: true }]}
                    >
                        <Input
                            value={form.title}
                            onChange={(e) => setField('title', e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="內容"
                        name="content"
                        rules={[{ required: true }]}
                    >
                        <Input
                            onChange={(e) => setField('content', e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="提醒頻率"
                        name="frequency"
                        rules={[{ required: true }]}
                    >
                        <Select<EnumReminderFrequency>
                            
                            onChange={(e) => setField('frequency', e)}
                        >
                            {Object.entries(EnumReminderFrequencyName).map(
                                ([key, val]) => (
                                    <Select.Option value={key}>{val}</Select.Option>
                                ),
                            )}
                        </Select>
                    </Form.Item>

                    {form.frequency &&
                    <Form.Item
                        label='選擇時間'
                        name='time'
                        rules={[{ required: true }]}>
                        <TimePicker
                            use12Hours
                            format='HH:mm'
                            onChange={(val) => setField('time', val.format('HH:mm'))} />
                    </Form.Item>}

                    {/* 各頻率對應欄位 */}
                    {form.frequency === EnumReminderFrequency.Once && 
                        <Form.Item
                            label='選擇日期'
                            name='fullDate'
                            rules={[{ required: true }]}>
                            <DatePicker
                                minDate={minDate}
                                format='YYYY-MM-DD'
                                onChange={(date) => {
                                    if (date) {
                                        setField('fullDate', date.toDate());
                                    }
                                }}>
                            </DatePicker>
                        </Form.Item>
                    }

                    {form.frequency === EnumReminderFrequency.Weekly &&
                    <Form.Item
                        label='選擇星期'
                        name='weekday'
                        rules={[{ required: true }]}>
                        <WeekdaySelect
                        onChange={(e) => setField('weekday', e)}/>
                            
                    </Form.Item>}

                    {form.frequency === EnumReminderFrequency.Monthly &&
                    <Form.Item
                        label='選擇日期'
                        name='date'
                        rules={[{ required: true }]}>
                        <DaySelect
                                onChange={(val) => setField('date', val)}
                            />
                    </Form.Item>}

                    {form.frequency === EnumReminderFrequency.Annually &&
                    <Form.Item
                        label='選擇日期'
                        name='date'
                        rules={[{ required: true }]}>
                        <DatePicker
                            maxDate={currentYearEnd}
                            minDate={currentYearStart}
                            onChange={(date) => {
                                if(date) {
                                    setField('fullDate', date.toDate())
                                }
                            }}
                            format='MM-DD'
                        >
                        </DatePicker>
                    </Form.Item>}

                    <Form.Item style={{ textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit">
                            送出
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Layout>
    )
}
