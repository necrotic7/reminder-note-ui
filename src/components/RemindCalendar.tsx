import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput, EventClickArg, DateSelectArg } from '@fullcalendar/core';
import './RemindCalendar.css';

interface DaisyFullCalendarProps {
  events?: EventInput[];
  onEventClick?: (info: EventClickArg) => void;
  onDateSelect?: (info: DateSelectArg) => void;
  height?: string | number;
  initialView?: string;
  className?: string;
}

const RemindCalendar: React.FC<DaisyFullCalendarProps> = ({
  events = [],
  onEventClick,
  onDateSelect,
  height = 'auto',
  initialView = 'dayGridMonth',
  className = ''
}) => {
  const calendarRef = useRef<FullCalendar>(null);

  // 預設事件數據
  const defaultEvents: EventInput[] = [
    {
      id: '1',
      title: '團隊會議',
      start: '2024-08-05T10:00:00',
      end: '2024-08-05T11:00:00',
      backgroundColor: 'hsl(var(--p))',
      borderColor: 'hsl(var(--p))'
    },
    {
      id: '2',
      title: '專案截止日',
      start: '2024-08-10',
      backgroundColor: 'hsl(var(--er))',
      borderColor: 'hsl(var(--er))'
    },
    {
      id: '3',
      title: '客戶拜訪',
      start: '2024-08-15T14:00:00',
      end: '2024-08-15T16:00:00',
      backgroundColor: 'hsl(var(--su))',
      borderColor: 'hsl(var(--su))'
    },
    {
      id: '4',
      title: '產品發布',
      start: '2024-08-20',
      backgroundColor: 'hsl(var(--wa))',
      borderColor: 'hsl(var(--wa))'
    }
  ];

  const handleEventClick = (info: EventClickArg) => {
    if (onEventClick) {
      onEventClick(info);
    } else {
      // 預設行為：顯示事件詳情
      alert(`事件: ${info.event.title}\n時間: ${info.event.start?.toLocaleString('zh-TW')}`);
    }
  };

  const handleDateSelect = (info: DateSelectArg) => {
    if (onDateSelect) {
      onDateSelect(info);
    } else {
      // 預設行為：建立新事件
      const title = prompt('請輸入事件標題:');
      if (title) {
        const newEvent: EventInput = {
          id: Date.now().toString(),
          title,
          start: info.start,
          end: info.end,
          backgroundColor: 'hsl(var(--p))',
          borderColor: 'hsl(var(--p))'
        };
        
        // 這裡你可以加入實際的新增事件邏輯
        console.log('新增事件:', newEvent);
      }
    }
  };

  return (
    <div className={`daisy-fullcalendar-container w-full max-w-6xl mx-auto ${className}`}>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={initialView}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={events.length > 0 ? events : defaultEvents}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            height={height}
            eventClick={handleEventClick}
            select={handleDateSelect}
            buttonText={{
              today: '今天',
              month: '月',
              week: '週',
              day: '日'
            }}
            locale="zh-tw"
            firstDay={1} // 週一開始
            // 自訂日期標題格式
            dayHeaderContent={(args) => {
              const date = args.date;
              const month = date.getMonth() + 1;
              const day = date.getDate();
              const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
              const weekday = weekdays[date.getDay()];
              
              return (
                <div className="text-center">
                  <div className="font-bold">{month}/{day}</div>
                  <div className="text-sm">{weekday}</div>
                </div>
              );
            }}
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            allDayText="全天"
            moreLinkText="更多"
            noEventsText="沒有事件顯示"
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
            // 加入自定義 CSS 類別
            themeSystem="standard"
          />
        </div>
      </div>
    </div>
  );
};

export default RemindCalendar;