import { useEffect, useState } from "react";
import { EnumReminderFrequency, EnumReminderFrequencyName } from "../consts/reminder";
import "react-datepicker/dist/react-datepicker.css"
import DatePicker from "react-datepicker"
import { FormHelper } from "../tools/form";
import { DaySelect, MonthSelect } from "../components/Date";
import { CreateReminderApi } from "../apis/reminders";

export default function CreateReminder() {
    const { form, setForm, setField } = FormHelper({
            title: '',
            content: '',
            frequency: '',
            time: '',
            hour: 0,
            minute: 0,
            weekday: 0,
            date: 0,
            month: 0,
            year: 0,
            fullDate: null as Date | null
    })

    // 提醒頻率更動時，清空所有跟頻率相關的欄位
    useEffect(() => {
        setForm(prev => ({
            ...prev,
            time: '',
            year: 0,
            month: 0,
            date: 0,
            weekday: 0,
            fullDate: null,
        }))
    }, [form.frequency])

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const lineId = localStorage.getItem('lineId')
        const payload = { userId: lineId, ...form }
        console.log('要送出的資料：', payload)
        // TODO 請求reminder-note-api
        await CreateReminderApi(payload);
    }

    return (
        <form className="space-y-4" onSubmit={submit}>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 mx-auto">
                <legend className="fieldset-legend">新增提醒</legend>

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
                    required
                />

                <label className="label">提醒頻率</label>
                <select
                    className="select select-bordered"
                    value={form.frequency}
                    onChange={(e) => setField('frequency', e.target.value)}
                    required
                >
                    <option disabled value="">請選擇頻率</option>
                    {Object.entries(EnumReminderFrequencyName).map(([key, val]) => 
                        (<option value={key}>{val}</option>)
                    )}
                </select>

                {/* 時間欄位 */}
                {form.frequency && (
                    <>
                        <label className="label">選擇時間</label>
                        <input
                            type="time"
                            className="input input-bordered"
                            value={form.time}
                            onChange={(e) => {
                                setField('time', e.target.value)
                                const [hr, min] = e.target.value.split(':')
                                setField('hour', Number(hr))
                                setField('minute', Number(min))
                            }}
                            required
                        />
                    </>
                )}

                {/* 各頻率對應欄位 */}
                {form.frequency === EnumReminderFrequency.Once && (
                    <>
                        <label className="label">選擇日期</label>
                        <DatePicker
                            selected={form.fullDate}
                            onChange={(date) => {
                                setField('fullDate', date)
                                if (date) {
                                    setField('year', date.getFullYear())
                                    setField('month', date.getMonth() + 1)
                                    setField('date', date.getDate())
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
                            value={form.weekday}
                            onChange={(e) => setField('weekday', e.target.value)}
                            required
                        >
                            <option disabled value="">請選擇星期</option>
                            {[...Array(7)].map((_, i) => (
                                <option key={i} value={i}>{`星期${'日一二三四五六'[i]}`}</option>
                            ))}
                        </select>
                    </>
                )}

                {form.frequency === EnumReminderFrequency.Monthly && (
                    <>
                        <label className="label">提醒日期</label>
                        <DaySelect value={String(form.date)} onChange={(val) => setField('date', val)} />
                    </>
                )}

                {form.frequency === EnumReminderFrequency.Annually && (
                    <>
                        <label className="label">提醒日期</label>
                        <MonthSelect value={String(form.month)} onChange={(val) => setField('month', val)} />
                        <DaySelect value={String(form.date)} onChange={(val) => setField('date', val)} />
                    </>
                )}

                <button type="submit" className="btn btn-neutral mt-4">送出</button>
            </fieldset>
        </form>
    )
}