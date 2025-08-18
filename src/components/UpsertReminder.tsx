import DatePicker from 'react-datepicker';
import {
    CreateReminderForm,
    EnumReminderFrequency,
    EnumReminderFrequencyName,
    UpdateReminderForm,
} from '../types/reminders';
import moment from 'moment';
import { DaySelect } from './Date';
import { TimePicker } from './TimePicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useEffect } from 'react';

export default function UpsertReminder({
    title,
    form,
    setField,
    onSubmit,
    resetKey,
}: {
    title: string;
    form: CreateReminderForm | UpdateReminderForm;
    setField: (key: any, value: any) => void;
    onSubmit: (p: any) => void;
    resetKey?: number;
}) {
    const minDate = moment().startOf('day').toDate();
    const currentYearStart = moment().startOf('year').toDate();

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

    return (
        <div>
            <form className="space-y-4" onSubmit={onSubmit} key={resetKey}>
                <fieldset className="fieldset bg-base-100 border border-base-300 rounded-box w-xs p-4 mx-auto">
                    <legend className="fieldset-legend">{title}</legend>

                    <label className="label">標題</label>
                    <input
                        type="text"
                        className="input input-bordered"
                        value={form.title}
                        onChange={(e) => setField('title', e.target.value)}
                        required
                    />

                    <label className="label">內容</label>
                    <textarea
                        className="textarea textarea-bordered"
                        value={form.content}
                        onChange={(e) => setField('content', e.target.value)}
                    />

                    <label className="label">提醒頻率</label>
                    <select
                        className="select select-bordered"
                        defaultValue={''}
                        value={form.frequency}
                        onChange={(e) => setField('frequency', e.target.value)}
                        required
                    >
                        <option disabled value="">
                            請選擇頻率
                        </option>
                        {Object.entries(EnumReminderFrequencyName).map(
                            ([key, val]) => (
                                <option value={key}>{val}</option>
                            ),
                        )}
                    </select>

                    {/* 時間欄位 */}
                    {form.frequency && (
                        <>
                            <label className="label">選擇時間</label>
                            <TimePicker
                                value={form.time}
                                onChange={(val) => setField('time', val)}
                            />
                        </>
                    )}

                    {/* 各頻率對應欄位 */}
                    {form.frequency === EnumReminderFrequency.Once && (
                        <>
                            <label className="label">選擇日期</label>
                            <DatePicker
                                minDate={minDate}
                                selected={form.fullDate}
                                onChange={(date) => {
                                    if (date) {
                                        setField('fullDate', date);
                                    }
                                }}
                                dateFormat="yyyy-MM-dd"
                                className="input input-bordered w-full"
                                placeholderText="請選擇日期"
                            />
                        </>
                    )}

                    {form.frequency === EnumReminderFrequency.Weekly && (
                        <>
                            <label className="label">選擇星期</label>
                            <select
                                className="select select-bordered"
                                value={form.weekday!}
                                onChange={(e) =>
                                    setField('weekday', e.target.value)
                                }
                                required
                            >
                                <option disabled value="">
                                    請選擇星期
                                </option>
                                {[...Array(7)].map((_, i) => (
                                    <option
                                        key={i}
                                        value={i}
                                    >{`星期${'日一二三四五六'[i]}`}</option>
                                ))}
                            </select>
                        </>
                    )}

                    {form.frequency === EnumReminderFrequency.Monthly && (
                        <>
                            <label className="label">提醒日期</label>
                            <DaySelect
                                value={form.date!}
                                onChange={(val) => setField('date', val)}
                            />
                        </>
                    )}

                    {form.frequency === EnumReminderFrequency.Annually && (
                        <>
                            <label className="label">選擇日期</label>
                            <DatePicker
                                minDate={currentYearStart}
                                selected={form.fullDate}
                                onChange={(date) => {
                                    if (date) {
                                        setField('fullDate', date);
                                    }
                                }}
                                dateFormat="MM-dd"
                                className="input input-bordered w-full"
                                placeholderText="請選擇日期"
                            />
                        </>
                    )}

                    <button type="submit" className="btn btn-primary mt-4">
                        送出
                    </button>
                </fieldset>
            </form>
        </div>
    );
}
