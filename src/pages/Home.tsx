import { useEffect, useState } from "react";
import { GetUserReminders } from "../apis/reminders";
import RemindCalendar from "../components/RemindCalendar";
import moment from 'moment';
import { DateSelectArg, EventInput } from "@fullcalendar/core/index.js";
import { useNavigate } from "react-router-dom";
import { EnumReminderFrequency } from "../types/reminders";

export default function Home() {
    const navigate = useNavigate();

    const [eventStates, setEvents] = useState<EventInput[]>([]);

    const fetchRemindersToEvent = async (start: Date, end: Date) => {
        try {
            const lineId = localStorage.getItem('lineId')!;
            const resp = await GetUserReminders({
                userId: lineId,
                createStartTime: start,
                createEndTime: end,
            });
            const events: EventInput[] = resp?.data?.records?.map((data) => {
                const {year, month, date, hour, minute} = data.remindTime;
                const startTime = moment(`${year}-${month}-${date} ${hour}:${minute}:00`);
                let endTime = startTime.clone().add(30, 'minutes');
                if (endTime.date() != startTime.date()) {
                    endTime = startTime.clone().endOf('date')
                }
                return {
                    id: data.id,
                    title: data.title,
                    start: startTime.format('YYYY-MM-DD HH:mm:ss'),
                    end: endTime.format('YYYY-MM-DD HH:mm:ss'),
                    editable: false,
                }
            }) ?? [];
            setEvents(events)
        } catch (err) {
            console.error('API Error:', err);
        }
    };

    // 當日期格被點選時
    const onDateSelect = (info: DateSelectArg) => {
        let frequency = EnumReminderFrequency.Once;
        if (moment(info.start).isBefore(moment())) {
            frequency = EnumReminderFrequency.Annually;
        }
        navigate('/createReminder', {
            state: { 
                frequency,
                date: info.start
            }
        })
    }

    // 正常顯示
    return (
        <div className="reminderHome">
            <RemindCalendar
                events={eventStates}
                onDateSelect={onDateSelect}
                onDatesChange={(args) => {
                    fetchRemindersToEvent(args.start, args.end);
                }}
            />
        </div>
    );
}