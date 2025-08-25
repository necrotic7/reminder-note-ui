import React, { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
    EventInput,
    EventClickArg,
    DateSelectArg,
    DatesSetArg,
} from '@fullcalendar/core';
import './ReminderCalendar.css';
import listPlugin from '@fullcalendar/list';
import { Button, Card, Col, DatePicker, Flex, Row } from 'antd';
import dayjs from 'dayjs';

interface DaisyFullCalendarProps {
    events?: EventInput[];
    onDatesChange?: (arg: DatesSetArg) => void;
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
      // TODO 加上顏色選擇功能
      backgroundColor: 'hsl(var(--p))',
      borderColor: 'hsl(var(--p))'
    }
 */
const RemindCalendar: React.FC<DaisyFullCalendarProps> = ({
    events = [],
    onDatesChange,
    onEventClick,
    onDateSelect,
    height = 'auto',
    initialView = 'dayGridMonth',
    className = '',
}) => {
    const calendarRef = useRef<FullCalendar>(null);
    // 跳轉到事件詳細頁
    const handleEventClick = (info: EventClickArg) => {
        if (onEventClick) {
            onEventClick(info);
        } else {
            // 預設行為：顯示事件詳情
            alert(
                `事件: ${info.event.title}\n時間: ${info.event.start?.toLocaleString('zh-TW')}`,
            );
        }
    };

    // 跳轉到新增提醒頁
    const handleDateSelect = (info: DateSelectArg) => {
        if (onDateSelect) {
            onDateSelect(info);
        }
    };

    return (
        <div className='w-full mx-auto overflow-x-auto'>
            <div
                className={`daisy-fullcalendar-container min-w-[700px] ${className}`}
            >
                <Row gutter={16}>
                    <Col span={24}>
                        {/* 簡單的年月跳轉器 */}
                        <DateJumpComponent ref={calendarRef} />
                        <Card>
                            <div className="card-body">
                                <FullCalendar
                                    defaultTimedEventDuration={'00:30'}
                                    ref={calendarRef}
                                    plugins={[
                                        dayGridPlugin,
                                        timeGridPlugin,
                                        interactionPlugin,
                                        listPlugin,
                                    ]}
                                    initialView={initialView}
                                    headerToolbar={{
                                        left: 'prev,next',
                                        center: 'title',
                                        right: 'dayGridMonth,timeGridWeek,listWeek',
                                    }}
                                    dayHeaderContent={(arg) => {
                                        const weekdayList = [
                                            '週日',
                                            '週一',
                                            '週二',
                                            '週三',
                                            '週四',
                                            '週五',
                                            '週六',
                                        ];
                                        const date = arg.date;
                                        const day = date.getDate();
                                        const weekday = weekdayList[date.getDay()];
                                        let title: string[] = [];
                                        if (arg.view.type == 'timeGridWeek') {
                                            title.push(`${date.getMonth() + 1}/${day}`, weekday)
                                        } else if (arg.view.type == 'listWeek') {
                                            title.push(`${date.getMonth() + 1}/${day} ${weekday}`)
                                        } else {
                                            title.push(weekday)
                                        }
                                        return (
                                            <div className="text-center leading-tight">
                                                {title.map((line, idx) => (
                                                    <span key={idx}>
                                                        {line}
                                                        {idx < title.length - 1 && <br />}
                                                    </span>
                                                ))}
                                            </div>
                                        )
                                    }}
                                    datesSet={(arg) => onDatesChange?.(arg)}
                                    events={events}
                                    editable={false}
                                    selectable={true}
                                    selectMirror={true}
                                    dayMaxEvents={3}
                                    weekends={true}
                                    height={height}
                                    eventClick={handleEventClick}
                                    select={handleDateSelect}
                                    buttonText={{
                                        month: '月',
                                        week: '週',
                                        day: '日',
                                        list: '列表',
                                    }}
                                    locale="zh-tw"
                                    firstDay={1} // 週一開始
                                    allDayText="全天"
                                    moreLinkText="更多"
                                    noEventsText="沒有事件顯示"
                                    eventTimeFormat={{
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false,
                                    }}
                                    displayEventEnd={false}
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

const DateJumpComponent = ({
    ref,
}: {
    ref: React.RefObject<FullCalendar | null>;
}) => {
    // 年月選擇器的變更處理
    const handleDateJump = (d: dayjs.Dayjs) => {
        if (ref.current) {
            const calendarApi = ref.current.getApi();
            // FullCalendar 內建的 gotoDate 方法
            calendarApi.gotoDate(d.startOf('month').toDate()); // month-1 因為 JS 月份從 0 開始
        }
    };

    return (
        <Card style={{ padding: 15, marginBottom: 15 }} >
            <Flex justify="space-between" align="center">
                {/* 左邊 */}
                <div>
                    <span className="text-sm">跳轉到： </span>
                    <DatePicker
                        format="YYYY-MM"
                        picker="month"
                        needConfirm
                        onOk={(d) => handleDateJump(d)}
                    />
                </div>

                {/* 右邊 */}
                <Button
                    color="primary" variant="outlined"
                    onClick={() => {
                        if (ref.current) {
                            ref.current.getApi().today();
                        }
                    }}
                >
                    回到今天
                </Button>
            </Flex>
        </Card>
    );
};

export default RemindCalendar;
