import Calendar from './Calendar';
import TodoModal from './TodoModal'; // TodoList 대신 TodoModal 사용
import '../css/Dashboard.css';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import moment from 'moment';

const Dashboard = () => {
  // 공통 상태
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [schedules, setSchedules] = useState([]);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false); // 모달 상태 추가
  const previousYearMonth = useRef('');
  
  // 선택된 날짜의 일정만 필터링
  const filteredSchedules = schedules.filter(schedule => {
    const start = moment(schedule.start);
    const end = moment(schedule.end);
    const selected = moment(selectedDate);
    
    // 선택된 날짜가 시작일과 종료일 사이에 있으면 true
    return selected.isSameOrAfter(start, 'day') && selected.isSameOrBefore(end, 'day');
  });
  
  // 날짜 선택 핸들러 수정 - 날짜 선택 시 모달 열기
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setIsTodoModalOpen(true); // 날짜 선택 시 모달 열기
  };
  
  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsTodoModalOpen(false);
  };
  
  // useCallback을 사용하여 함수 메모이제이션
  const fetchMonthSchedules = useCallback((year, month) => {
    // 이전에 호출했던 연/월과 같으면 재호출 방지
    const yearMonthKey = `${year}-${month}`;
    if (previousYearMonth.current === yearMonthKey) return;
    previousYearMonth.current = yearMonthKey;
    
    // 실제로는 API 호출
    // 예시 코드:
    // const response = await fetch(`/api/schedules?year=${year}&month=${month}`);
    // const data = await response.json();
    // setSchedules(data);
    
    // 임시 데이터
    const dummyData = [
      { 
        id: 1, 
        title: '벼 생육 관찰', 
        type: 'farming',
        start: '2025-04-05', 
        end: '2025-04-07',
        color: '#4CAF50',
        completed: false
      },
      { 
        id: 2, 
        title: '진딧물 발생 대응', 
        type: 'pest',
        start: '2025-04-10', 
        end: '2025-04-10',
        color: '#FF5722',
        completed: false
      },
      { 
        id: 3, 
        title: '비료 살포', 
        type: 'farming',
        start: '2025-04-15', 
        end: '2025-04-16',
        color: '#4CAF50',
        completed: true
      }
    ];
    
    setSchedules(dummyData);
  }, []); // 빈 의존성 배열 - 컴포넌트가 마운트될 때만 생성
  
  // 일정 추가 (useCallback 사용)
  const addSchedule = useCallback((newSchedule) => {
    // API 호출 후 상태 업데이트
    setSchedules(prevSchedules => [...prevSchedules, { ...newSchedule, id: Date.now() }]);
  }, []); // 빈 의존성 배열 사용
  
  // 일정 삭제 (useCallback 사용)
  const deleteSchedule = useCallback((id) => {
    // API 호출 후 상태 업데이트
    setSchedules(prevSchedules => prevSchedules.filter(schedule => schedule.id !== id));
  }, []); // 빈 의존성 배열 사용
  
  // 일정 완료 상태 변경 (useCallback 사용)
  const toggleScheduleComplete = useCallback((id) => {
    setSchedules(prevSchedules => 
      prevSchedules.map(schedule => 
        schedule.id === id ? { ...schedule, completed: !schedule.completed } : schedule
      )
    );
  }, []); // 빈 의존성 배열 사용
  
  return (
    <div className="dashboard">
      <div className="dashboard-section">
        <div className="dashboard-row">
          <div className="dashboard-card calendar-card">
            {/* Calendar 컴포넌트에 새로운 핸들러 전달 */}
            <Calendar 
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              schedules={schedules}
              onMonthChange={fetchMonthSchedules}
            />
          </div>
          
          {/* TodoList 컴포넌트 제거하고 TodoModal 컴포넌트 추가 */}
          <TodoModal
            isOpen={isTodoModalOpen}
            onClose={handleCloseModal}
            date={selectedDate}
            todos={filteredSchedules}
            onAddTodo={addSchedule}
            onDeleteTodo={deleteSchedule}
            onToggleComplete={toggleScheduleComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;