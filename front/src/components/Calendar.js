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
        isNextMonth: false,
        hasEvent: false,
        schedules: []
      });
    }
    
    // 현재 달의 날짜 추가 - 이벤트 처리 개선
    for (let i = 1; i <= daysInMonth; i++) {
      const date = moment(currentDate).date(i);
      const dateStr = date.format('YYYY-MM-DD');
      
      // 해당 날짜의 일정 찾기
      const allDateSchedules = schedules.filter(schedule => {
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
      });
      
      // 일정 정렬 및 위치 할당
      const assignedSchedules = assignSchedulePositions(allDateSchedules);
      
      calendarDays.push({
        date,
        currentMonth: true,
        isPrevMonth: false,
        isNextMonth: false,
        hasEvent: assignedSchedules.length > 0,
        schedules: assignedSchedules
      });
    }
    
    // 다음 달의 날짜 추가 
    const remainingDays = 35 - calendarDays.length; // 7x5 그리드
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
  
  // 일정 위치 할당 함수
  const assignSchedulePositions = (schedules) => {
    // 이미 할당된 위치를 추적하는 배열
    const occupiedPositions = [false, false]; // 위치 0과 1이 할당됐는지 추적
    const result = [];
    
    // 일정 정렬 (기간이 긴 것, 시작일이 빠른 것 우선)
    const sortedSchedules = [...schedules].sort((a, b) => {
      // 1. 기간이 긴 일정 우선
      const aLen = moment(a.end).diff(moment(a.start), 'days');
      const bLen = moment(b.end).diff(moment(b.start), 'days');
      if (bLen !== aLen) return bLen - aLen;
      
      // 2. 시작일이 빠른 일정 우선
      return moment(a.start).diff(moment(b.start));
    });
    
    // 각 일정에 위치 할당
    sortedSchedules.forEach(schedule => {
      // 사용 가능한 첫 번째 위치 찾기
      let position = occupiedPositions.findIndex(pos => !pos);
      
      // 모든 위치가 이미 사용 중이면 더 이상 표시하지 않음
      if (position === -1) return;
      
      // 위치 할당 및 점유 상태 업데이트
      occupiedPositions[position] = true;
      result.push({
        ...schedule,
        position // 위치 정보 추가
      });
    });
    
    return result;
  };
  
  // 날짜 셀 렌더링 - 이벤트 표시 부분 수정
  const renderDayCell = (dayInfo) => {
    const dateStr = dayInfo.date.format('YYYY-MM-DD');
    const isToday = dayInfo.date.isSame(moment(), 'day');
    const isSelected = dateStr === selectedDate;
    
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
      
      return dayInfo.schedules.map((schedule) => {
        // 이벤트 클래스 결정 - position 속성 사용
        const eventClasses = [
          'event-bar',
          `event-position-${schedule.position}`, // 할당된 위치 사용
          schedule.isStart ? 'event-start' : '',
          schedule.isEnd ? 'event-end' : '',
          schedule.isMiddle ? 'event-middle' : '',
          schedule.isSingleDay ? 'event-single' : ''
        ].filter(Boolean).join(' ');
        
        return (
          <div 
            key={`${dateStr}-event-${schedule.id}`} 
            className={eventClasses}
            style={{ 
              backgroundColor: schedule.color,
              opacity: schedule.completed ? 0.7 : 1
            }}
            title={`${schedule.title}${schedule.start !== schedule.end ? ` (${moment(schedule.start).format('M/D')}~${moment(schedule.end).format('M/D')})` : ''}`}
          >
            {/* 시작일이거나 한 날짜 이벤트인 경우에만 텍스트 표시 - 타이틀 표시 조건 개선 */}
            {(schedule.isStart || schedule.isSingleDay) && (
              <span className="event-title">
                {schedule.title}
              </span>
            )}
            {/* 중간일의 경우 텍스트 표시하지 않음 */}
            {schedule.isMiddle && !schedule.isStart && !schedule.isEnd && (
              <span className="event-title-hidden"></span>
            )}
            {/* 종료일이지만 시작일이 아닌 경우, 텍스트 표시하지 않음 */}
            {schedule.isEnd && !schedule.isStart && (
              <span className="event-title-hidden"></span>
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
  
  // 캘린더 데이터 생성
  const calendarDays = generateCalendarDays();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  
  // 컴포넌트 렌더링
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