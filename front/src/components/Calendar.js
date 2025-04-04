import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/ko';
import '../css/Calendar.css';

const Calendar = ({ selectedDate, onDateSelect, schedules, onMonthChange }) => {
  const [currentDate, setCurrentDate] = useState(moment());
  
  // 월이 변경될 때마다 일정 데이터 가져오기
  useEffect(() => {
    const year = currentDate.year();
    const month = currentDate.month() + 1; // moment는 0부터 시작
    onMonthChange(year, month);
  }, [currentDate, onMonthChange]);
  
  // 캘린더 데이터 생성 (월별 날짜 배열)
  const generateCalendarDays = () => {
    const firstDay = moment(currentDate).startOf('month');
    const lastDay = moment(currentDate).endOf('month');
    
    // 이전 달의 마지막 몇 일 계산 (첫째 주 빈칸 채우기)
    const prevMonthDays = firstDay.day();
    const daysInMonth = lastDay.date();
    
    let calendarDays = [];
    
    // 이전 달의 날짜 추가
    for (let i = 0; i < prevMonthDays; i++) {
      const date = moment(firstDay).subtract(prevMonthDays - i, 'days');
      calendarDays.push({
        date,
        currentMonth: false,
        isPrevMonth: true,
        isNextMonth: false, // 이부분이 잘못되어 있습니다. isNextMonth를 false로 변경
        hasEvent: false,
        schedules: []
      });
    }
    
    // 현재 달의 날짜 추가 - 이벤트 처리 수정
    for (let i = 1; i <= daysInMonth; i++) {
      const date = moment(currentDate).date(i);
      const dateStr = date.format('YYYY-MM-DD');
      
      // 해당 날짜의 일정 찾기
      const dateSchedules = schedules.filter(schedule => {
        const start = moment(schedule.start);
        const end = moment(schedule.end);
        return date.isSameOrAfter(start, 'day') && date.isSameOrBefore(end, 'day');
      }).map(schedule => {
        // 시작일, 종료일, 중간일 여부 확인
        const isStart = date.isSame(moment(schedule.start), 'day');
        const isEnd = date.isSame(moment(schedule.end), 'day');
        const isMiddle = !isStart && !isEnd;
        
        return {
          ...schedule,
          isStart,
          isEnd,
          isMiddle,
          // 1일짜리 이벤트인 경우 시작과 종료가 모두 true
          isSingleDay: isStart && isEnd
        };
      }).slice(0, 2); // 최대 2개까지만 표시
      
      calendarDays.push({
        date,
        currentMonth: true,
        isPrevMonth: false,
        isNextMonth: false,
        hasEvent: dateSchedules.length > 0,
        schedules: dateSchedules
      });
    }
    
    // 다음 달의 날짜 추가 (마지막 주 빈칸 채우기) - 이 부분이 누락되었습니다!
    const remainingDays = 35 - calendarDays.length; // 7x6 그리드
    for (let i = 1; i <= remainingDays; i++) {
      const date = moment(lastDay).add(i, 'days');
      calendarDays.push({
        date,
        currentMonth: false,
        isPrevMonth: false,
        isNextMonth: true,
        hasEvent: false,
        schedules: []
      });
    }
    
    return calendarDays;
  };
  
  // 이전 달로 이동
  const goToPrevMonth = () => {
    setCurrentDate(moment(currentDate).subtract(1, 'month'));
  };
  
  // 다음 달로 이동
  const goToNextMonth = () => {
    setCurrentDate(moment(currentDate).add(1, 'month'));
  };
  
  // 날짜 선택 처리
  const handleDateClick = (date) => {
    onDateSelect(date.format('YYYY-MM-DD'));
  };
  
  // 날짜 셀 렌더링 - 이벤트 표시 부분 수정
  const renderDayCell = (dayInfo) => {
    const dateStr = dayInfo.date.format('YYYY-MM-DD');
    const isToday = dayInfo.date.isSame(moment(), 'day');
    const isSelected = dateStr === selectedDate;
    
    // 오늘 표시 스타일이 다른 스타일을 덮어쓰지 않도록 클래스 순서 조정
    const cellClasses = [
      'calendar-day',
      !dayInfo.currentMonth ? 'other-month' : '',
      dayInfo.isPrevMonth ? 'prev-month-day' : '',
      dayInfo.isNextMonth ? 'next-month-day' : '',
      isToday ? 'today' : '',
      isSelected ? 'selected' : ''
    ].filter(Boolean).join(' ');
    
    // 이벤트 렌더링 함수
    const renderEvents = () => {
      if (!dayInfo.schedules || dayInfo.schedules.length === 0) return null;
      
      return dayInfo.schedules.map((schedule, index) => {
        // 이벤트 클래스 결정
        const eventClasses = [
          'event-bar',
          schedule.isStart ? 'event-start' : '',
          schedule.isEnd ? 'event-end' : '',
          schedule.isMiddle ? 'event-middle' : '',
          schedule.isSingleDay ? 'event-single' : ''
        ].filter(Boolean).join(' ');
        
        return (
          <div 
            key={`${dateStr}-event-${index}`} 
            className={eventClasses}
            style={{ 
              backgroundColor: schedule.color,
              opacity: schedule.completed ? 0.7 : 1
              // top, left, right 속성 제거
            }}
            title={`${schedule.title}${schedule.start !== schedule.end ? ` (${moment(schedule.start).format('M/D')}~${moment(schedule.end).format('M/D')})` : ''}`}
          >
            {/* 시작일이거나 한 날짜 이벤트인 경우에만 텍스트 표시 */}
            {(schedule.isStart || schedule.isSingleDay) && (
              <span className="event-title">{schedule.title}</span>
            )}
          </div>
        );
      });
    };
    
    return (
      <div 
        key={dateStr} 
        className={cellClasses}
        onClick={() => handleDateClick(dayInfo.date)}
      >
        <div className="calendar-day-number">{dayInfo.date.date()}</div>
        <div className="event-container">
          {renderEvents()}
        </div>
      </div>
    );
  };
  
  const calendarDays = generateCalendarDays();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  
  return (
    <section className="calendar-section">
      <h3 className="section-title">작업 캘린더</h3>
      <div className="calendar-header">
        <div className="calendar-title" id="calendar-month-year">
          {currentDate.format('YYYY년 M월')}
        </div>
        <div className="calendar-nav">
          <button className="nav-button" onClick={goToPrevMonth}>이전</button>
          <button className="nav-button" onClick={goToNextMonth}>다음</button>
        </div>
      </div>
      <div className="calendar-grid" id="calendar-weekdays">
        {weekdays.map(day => (
          <div key={day} className="calendar-weekday">{day}</div>
        ))}
      </div>
      <div className="calendar-grid" id="calendar-days">
        {calendarDays.map(day => renderDayCell(day))}
      </div>
    </section>
  );
};

export default Calendar;