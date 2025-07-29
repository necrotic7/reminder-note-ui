import { useEffect, useState } from "react";
import { EnumReminderFrequency } from "../consts/reminder";
import "react-datepicker/dist/react-datepicker.css"
import DatePicker from "react-datepicker"

export default function CreateReminder() {
    const [form, setForm] = useState({
        title: '',
        content: '',
        frequency: '',
        time: '',
        weekday: '',
        date: '',
        month: '',
        year: '',
        fullDate: null as Date | null
    })

    // 提醒頻率更動時，清空所有跟頻率相關的欄位
    useEffect(() => {
        setForm(prev => ({
            ...prev,
            time: '',
            year: '',
            month: '',
            date: '',
            weekday: '',
            fullDate: null,
        }))
    }, [form.frequency])

    const updateField = (key: keyof typeof form, value: any) => {
        setForm(prev => ({ ...prev, [key]: value }))
    }

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const lineId = localStorage.getItem('lineId')
        const payload = { userId: lineId, ...form }
        console.log('要送出的資料：', payload)
        // TODO 請求reminder-note-api
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
                    onChange={(e) => updateField('title', e.target.value)}
                    required
                />

                <label className="label">內容</label>
                <textarea
                    className="textarea textarea-bordered"
                    value={form.content}
                    onChange={(e) => updateField('content', e.target.value)}
                    required
                />

                <label className="label">提醒頻率</label>
                <select
                    className="select select-bordered"
                    value={form.frequency}
                    onChange={(e) => updateField('frequency', e.target.value)}
                    required
                >
                    <option disabled value="">請選擇頻率</option>
                    <option value={EnumReminderFrequency.Once}>單次</option>
                    <option value={EnumReminderFrequency.Daily}>每日</option>
                    <option value={EnumReminderFrequency.Weekly}>每週</option>
                    <option value={EnumReminderFrequency.Monthly}>每月</option>
                    <option value={EnumReminderFrequency.Annually}>每年</option>
                </select>

                {/* 時間欄位 */}
                {form.frequency && (
                    <>
                        <label className="label">選擇時間</label>
                        <input
                            type="time"
                            className="input input-bordered"
                            value={form.time}
                            onChange={(e) => updateField('time', e.target.value)}
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
                                updateField('fullDate', date)
                                if (date) {
                                    updateField('year', String(date.getFullYear()))
                                    updateField('month', String(date.getMonth() + 1))
                                    updateField('date', String(date.getDate()))
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
                            onChange={(e) => updateField('weekday', e.target.value)}
                            required
                        >
                            <option disabled value="">請選擇星期</option>
                            {[...Array(7)].map((_, i) => (
                                <option key={i} value={String(i)}>{`星期${'日一二三四五六'[i]}`}</option>
                            ))}
                        </select>
                    </>
                )}

                {form.frequency === EnumReminderFrequency.Monthly && (
                    <>
                        <label className="label">提醒日期</label>
                        <DaySelect value={form.date} onChange={(val) => updateField('date', val)} />
                    </>
                )}

                {form.frequency === EnumReminderFrequency.Annually && (
                    <>
                        <label className="label">提醒日期</label>
                        <MonthSelect value={form.month} onChange={(val) => updateField('month', val)} />
                        <DaySelect value={form.date} onChange={(val) => updateField('date', val)} />
                    </>
                )}

                <button type="submit" className="btn btn-neutral mt-4">送出</button>
            </fieldset>
        </form>
    )
}

const DaySelect = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => (
    <select className="select select-bordered w-full" value={value} onChange={(e) => onChange(e.target.value)}>
        <option disabled value="">選擇日期</option>
        {[...Array(31)].map((_, i) => (
            <option key={i} value={String(i + 1)}>{i + 1} 日</option>
        ))}
    </select>
)

const MonthSelect = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => (
    <select className="select select-bordered w-full" value={value} onChange={(e) => onChange(e.target.value)}>
        <option disabled value="">選擇月份</option>
        {[...Array(12)].map((_, i) => (
            <option key={i} value={String(i + 1)}>{i + 1} 月</option>
        ))}
    </select>
)