import { useEffect, useState } from "react";
import { GetUserReminders } from "../apis/reminders";
import RemindCalendar from "../components/RemindCalendar";
import moment from 'moment';
import { EventInput } from "@fullcalendar/core/index.js";

export default function Home() {
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
            console.error('API Error:', err);
        }
    };

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