import {
    EnumReminderFrequency,
    EnumReminderFrequencyName,
    UpsertReminderForm,
} from '../../types/reminders';
import { DaySelect, WeekdaySelect } from '../common/Date';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { Button, Card, Form, Input, Layout, Select, TimePicker, DatePicker } from 'antd';
import { FormProps, useForm } from 'antd/es/form/Form';
import { useEffect } from 'react';


export default function UpsertReminder({
    title,
    onSubmit,
    initialValues,
}: {
    title: string;
    onSubmit: (val: UpsertReminderForm) => void;
    initialValues?: Partial<UpsertReminderForm>;
}) {
    const [form] = useForm<UpsertReminderForm>();

    const minDate = dayjs().startOf('day');
    const currentYearStart = dayjs().startOf('year');
    const currentYearEnd = dayjs().endOf('year');

    const onFinish: FormProps<UpsertReminderForm>['onFinish'] = (values) => {
        onSubmit(values);
        form.resetFields();
    };

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        }
    }, [initialValues]);


    const frequency = Form.useWatch('frequency', form);

    return (
        <Layout style={{
            display: 'flex',
            alignItems: 'center',
        }}>
            <Card
                title={title}
                style={{ margin: 20, width: 500, }}>
                <Form
                    layout='vertical'
                    variant={'filled'}
                    onFinish={onFinish}
                    form={form}
                    initialValues={{}}
                >
                    <Form.Item
                        label="標題"
                        name="title"
                        rules={[{ required: true }]}
                    >
                        <Input
                        />
                    </Form.Item>

                    <Form.Item
                        label="內容"
                        name="content"
                        rules={[{ required: true }]}
                    >
                        <Input
                        />
                    </Form.Item>

                    <Form.Item
                        label="提醒頻率"
                        name="frequency"
                        rules={[{ required: true }]}
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

                    {frequency &&
                        <Form.Item
                            label='選擇時間'
                            name='time'
                            rules={[{ required: true }]}>
                            <TimePicker
                                use12Hours
                                format='HH:mm'
                            />
                        </Form.Item>}

                    {/* 各頻率對應欄位 */}
                    {frequency === EnumReminderFrequency.Once &&
                        <Form.Item
                            label='選擇日期'
                            name='fullDate'
                            rules={[{ required: true }]}>
                            <DatePicker
                                minDate={minDate}
                                format='YYYY-MM-DD'
                            >
                            </DatePicker>
                        </Form.Item>
                    }

                    {frequency === EnumReminderFrequency.Weekly &&
                        <Form.Item
                            label='選擇星期'
                            name='weekday'
                            rules={[{ required: true }]}>
                            <WeekdaySelect />

                        </Form.Item>}

                    {frequency === EnumReminderFrequency.Monthly &&
                        <Form.Item
                            label='選擇日期'
                            name='date'
                            rules={[{ required: true }]}>
                            <DaySelect />
                        </Form.Item>}

                    {frequency === EnumReminderFrequency.Annually &&
                        <Form.Item
                            label='選擇日期'
                            name='fullDate'
                            rules={[{ required: true }]}>
                            <DatePicker
                                maxDate={currentYearEnd}
                                minDate={currentYearStart}
                                onChange={(date) => {
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