import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/ko';
import '../css/Calendar.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(null);
  
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
        isNextMonth: false,
        hasEvent: false
      });
    }
    
    // 현재 달의 날짜 추가
    for (let i = 1; i <= daysInMonth; i++) {
      const date = moment(currentDate).date(i);
      calendarDays.push({
        date,
        currentMonth: true,
        isPrevMonth: false,
        isNextMonth: false,
        // 예시로 몇몇 날짜에 이벤트가 있다고 표시
        hasEvent: [5, 12, 18, 25].includes(i)
      });
    }
    
    // 다음 달의 날짜 추가 (마지막 주 빈칸 채우기)
    const remainingDays = 42 - calendarDays.length; // 7x6 그리드
    for (let i = 1; i <= remainingDays; i++) {
      const date = moment(lastDay).add(i, 'days');
      calendarDays.push({
        date,
        currentMonth: false,
        isPrevMonth: false,
        isNextMonth: true,
        hasEvent: false
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
    setSelectedDate(date);
  };
  
  // 날짜 셀 렌더링
  const renderDayCell = (dayInfo) => {
    const isToday = dayInfo.date.isSame(moment(), 'day');
    const isSelected = selectedDate && dayInfo.date.isSame(selectedDate, 'day');
    
    const cellClasses = [
      'calendar-day',
      !dayInfo.currentMonth ? 'other-month' : '',
      dayInfo.isPrevMonth ? 'prev-month-day' : '',
      dayInfo.isNextMonth ? 'next-month-day' : '',
      isToday ? 'today' : '',
      isSelected ? 'selected' : ''
    ].filter(Boolean).join(' ');
    
    return (
      <div 
        key={dayInfo.date.format('YYYY-MM-DD')} 
        className={cellClasses}
        onClick={() => handleDateClick(dayInfo.date)}
      >
        {dayInfo.date.date()}
        {dayInfo.hasEvent && <div className="event-dot"></div>}
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