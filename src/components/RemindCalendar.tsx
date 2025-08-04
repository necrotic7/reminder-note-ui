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


/**
 * EventInput
 * {
      id: '1',
      title: '團隊會議',
      start: '2024-08-05T10:00:00',
      end: '2024-08-05T11:00:00',
      backgroundColor: 'hsl(var(--p))',
      borderColor: 'hsl(var(--p))'
    }
 */
const RemindCalendar: React.FC<DaisyFullCalendarProps> = ({
  events = [],
  onEventClick,
  onDateSelect,
  height = 'auto',
  initialView = 'dayGridMonth',
  className = ''
}) => {
  const calendarRef = useRef<FullCalendar>(null);

  // 跳轉到指定年月的簡單函式
  const goToDate = (year: number, month: number) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      // FullCalendar 內建的 gotoDate 方法
      calendarApi.gotoDate(new Date(year, month - 1, 1)); // month-1 因為 JS 月份從 0 開始
    }
  };

  // 年月選擇器的變更處理
  const handleDateJump = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const year = parseInt(formData.get('year') as string);
    const month = parseInt(formData.get('month') as string);
    goToDate(year, month);
  };

  // 生成年份選項
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

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
       {/* 簡單的年月跳轉器 */}
      <div className="card bg-base-100 shadow-xl mb-4">
        <div className="card-body py-4">
          <form onSubmit={handleDateJump} className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium">跳轉到：</span>
            
            <select name="year" className="select select-bordered select-sm w-24" defaultValue={currentYear}>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <span className="text-sm">年</span>
            
            <select name="month" className="select select-bordered select-sm w-20" defaultValue={new Date().getMonth() + 1}>
              {months.map(month => (
                <option key={month} value={month}>{month}月</option>
              ))}
            </select>
            
            <button type="submit" className="btn btn-primary btn-sm">
              跳轉
            </button>
            
            <div className="divider divider-horizontal"></div>
            
            <button 
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => {
                if (calendarRef.current) {
                  calendarRef.current.getApi().today(); // FullCalendar 內建方法
                }
              }}
            >
              回到今天
            </button>
          </form>
        </div>
      </div>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={initialView}
            headerToolbar={{
              left: 'prev,next',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={events}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            height={height}
            eventClick={handleEventClick}
            select={handleDateSelect}
            buttonText={{
              month: '月',
              week: '週',
              day: '日'
            }}
            locale="zh-tw"
            firstDay={1} // 週一開始
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