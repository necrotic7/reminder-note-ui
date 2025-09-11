import { useState } from 'react';
import { GetUserReminders } from '../apis/reminders';
import RemindCalendar from '../components/reminders/ReminderCalendar';
import { DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core/index.js';
import { useNavigate } from 'react-router-dom';
import { EnumReminderFrequency } from '../types/reminders';
import { EnumLocalStorageKey } from '../consts/localStorage';
import dayjs from 'dayjs';

export default function Home() {
    const navigate = useNavigate();

    const [eventStates, setEvents] = useState<EventInput[]>([]);

    const fetchRemindersToEvent = async (start: Date, end: Date) => {
        try {
            const lineId = localStorage.getItem(EnumLocalStorageKey.LineID)!;
            const resp = await GetUserReminders(lineId,{
                createStartTime: dayjs(start),
                createEndTime: dayjs(end),
            });
            const events: EventInput[] =
                resp?.data?.records?.map((data) => {
                    const { year, month, date, hour, minute } = data.remindTime;
                    const startTime = dayjs(
                        `${year}-${month}-${date} ${hour}:${minute}:00`,
                    );
                    let endTime = startTime.clone().add(30, 'minutes');
                    if (endTime.date() != startTime.date()) {
                        endTime = startTime.clone().endOf('date');
                    }
                    return {
                        id: data.id,
                        title: data.title,
                        start: startTime.format('YYYY-MM-DD HH:mm:ss'),
                        end: endTime.format('YYYY-MM-DD HH:mm:ss'),
                        editable: false,
                        detail: data,
                    };
                }) ?? [];
            setEvents(events);
        } catch (err) {
            console.error('API Error:', err);
        }
    };

    // 當日期格被點選時
    const onDateSelect = (info: DateSelectArg) => {
        let frequency = EnumReminderFrequency.Once;
        if (dayjs(info.start).isBefore(dayjs())) {
            frequency = EnumReminderFrequency.Annually;
        }
        navigate('/createReminder', {
            state: {
                frequency,
                date: info.start,
            },
        });
    };

    // 當事件被點選時，跳轉到編輯頁
    const onEventClick = (info: EventClickArg) => {
        navigate('/reminderList', {
            state: {
                detail: info.event.extendedProps.detail,
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
                onEventClick={onEventClick}
            />
        </div>
    );
}
