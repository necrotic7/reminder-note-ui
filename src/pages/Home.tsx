import { useEffect, useState } from "react";
import { GetUserReminders } from "../apis/reminders";
import RemindCalendar from "../components/RemindCalendar";
import moment from 'moment';
import { EventInput } from "@fullcalendar/core/index.js";

export default function Home() {
    // 狀態管理
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [eventStates, setEvents] = useState<EventInput[]>([]);

    const fetchRemindersToEvent = async (start: Date, end: Date) => {
        try {
            const lineId = localStorage.getItem('lineId')!;
            const resp = await GetUserReminders({
                userId: lineId,
                startTime: start,
                endTime: end,
            });
            const events: EventInput[] = resp?.data?.map((data) => {
                const {year, month, date, hour, minute} = data.remindTime;
                const timeString = moment(`${year}-${month}-${date} ${hour}:${minute}:00`).format()
                return {
                    title: data.title,
                    start: timeString,
                }
            }) ?? [];
            setEvents(events)
        } catch (err) {
            setError('載入提醒失敗');
            console.error('API Error:', err);
        }
    };
    // 打 API 的副作用
    useEffect(() => {
        const currentMonthStart = moment().startOf('month');
        const currentMonthEnd = moment().endOf('month');
        fetchRemindersToEvent(currentMonthStart.toDate(), currentMonthEnd.toDate());
        setLoading(false)
    }, []); // 空陣列表示只在組件掛載時執行一次

    // 載入中顯示
    if (loading) {
        return (
            <div className="reminderHome">
                <div className="flex justify-center items-center min-h-[400px]">
                    <span className="loading loading-spinner loading-lg"></span>
                    <span className="ml-2">載入中...</span>
                </div>
            </div>
        );
    }

    // 錯誤顯示
    if (error) {
        return (
            <div className="reminderHome">
                <div className="alert alert-error">
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    // 正常顯示
    return (
        <div className="reminderHome">
            <RemindCalendar
                events={eventStates}
                onDatesChange={(args) => {
                    fetchRemindersToEvent(args.start, args.end);
                }}
            />
        </div>
    );
}