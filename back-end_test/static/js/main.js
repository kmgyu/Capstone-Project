// main.js
// 필요한 DOM 요소 가져오기

document.addEventListener("DOMContentLoaded", () => {
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskModal = document.getElementById('task-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const saveTaskBtn = document.getElementById('save-task-btn');

    // 모달 열기
    addTaskBtn.addEventListener('click', () => {
        taskModal.classList.remove('hidden'); 
    });

    // 모달 닫기 (닫기 버튼 클릭 시)
    closeModalBtn.addEventListener('click', () => {
        taskModal.classList.add('hidden');
    });

    // 모달 닫기 (저장 버튼 클릭 시)
    saveTaskBtn.addEventListener('click', () => {
        alert('할 일이 저장되었습니다!'); 
        taskModal.classList.add('hidden');
    });

    const sidebar = document.querySelector(".sidebar"); // 사이드바 요소
    const toggleButton = document.querySelector(".toggle-sidebar"); // 토글 버튼

    // 초기 상태 아이콘 설정
    toggleButton.innerHTML = '<span>&gt;</span>'; // 닫힌 상태일 때 표시

    toggleButton.addEventListener("click", () => {
        const isExpanded = sidebar.classList.toggle("expanded"); // 상태 토글
        toggleButton.innerHTML = isExpanded ? "&lt;" : "&gt;"; // 버튼 아이콘 변경
    });

    const calendarEl = document.getElementById('calendar');
    
    if (calendarEl) {
        // FullCalendar 초기화
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth', // 기본 월별 보기
            locale: 'ko', // 한국어 설정
            height: 'auto', // 높이를 부모 컨테이너에 맞춤
            contentHeight: 400, // 캘린더 내용의 최대 높이 (픽셀로 지정)
            headerToolbar: {
                left: 'prevYear,nextYear today',
                center: 'title',
                right: 'prev,next'
            },
            dateClick: function(info) {
                selectedDate = info.dateStr; // 클릭한 날짜 저장
                openCalendarModal(info.dateStr);
            },
            eventDidMount: function(info) {
                // recommend 작업에 빨간색 배경 적용
                if (info.event.extendedProps.type === 'recommend') {
                    info.el.style.backgroundColor = 'red';
                    info.el.style.color = 'white'; // 텍스트 색상 조정
                }
            },
            selectable: true, // 날짜 선택 가능
            editable: true, // 이벤트 드래그 가능
            eventDisplay: 'none', // 이벤트 텍스트 숨기기
            events: [
                { title: '작업1 기릿', start: '2024-12-10', end: '2024-12-10', type: 'today' },
                { title: '작업2 이름', start: '2024-12-10', end: '2024-12-13', type: 'today' },
                { title: '이건 병충해', start: '2024-12-10', end: '2024-12-10', type: 'recommend' },
                { title: '작업1 이름', start: '2024-12-11', end: '2024-12-11', type: 'today' },
                { title: '병충쓰', start: '2024-12-11', type: 'recommend' },
            ],
            dayCellContent: function(arg) {
                // 날짜를 UTC → KST로 변환
                const formattedDate = utcToKst(arg.date).toISOString().split('T')[0];
                console.log(formattedDate)
                // 해당 날짜의 이벤트 가져오기
                const events = calendar.getEvents().filter(event => {
                    // 이벤트 시작 날짜와 종료 날짜를 UTC → KST로 변환
                    const eventStartKST = utcToKst(event.start);
                    const eventEndKST = event.end ? utcToKst(event.end) : eventStartKST;
    
                    // 포맷된 이벤트 시작/종료 날짜
                    const eventFormattedDate = eventStartKST.toISOString().split('T')[0];
                    const eventFormattedDateEnd = eventEndKST.toISOString().split('T')[0];
    
                    // 날짜 범위 비교
                    return (
                        formattedDate >= eventFormattedDate &&
                        formattedDate <= eventFormattedDateEnd
                    );
                });
    
                // 이벤트 타입별 dot 생성
                const dots = [];
                const hasToday = events.some(event => event.extendedProps.type === 'today');
                const hasRecommend = events.some(event => event.extendedProps.type === 'recommend');
    
                if (hasToday) {
                    dots.push('<span class="dot today-dot"></span>'); // 파란색 dot
                }
                if (hasRecommend) {
                    dots.push('<span class="dot recommend-dot"></span>'); // 빨간색 dot
                }
    
                // 날짜와 dot을 포함한 셀 내용 반환
                return {
                    html: `
                        <div class="day-content">
                            <span class="date">${arg.date.getDate()}</span>
                            <div class="dots">
                                ${dots.join('')} <!-- dot들을 가로로 배치 -->
                            </div>
                        </div>
                    `,
                };
            },
        });
        // 캘린더 렌더링
        calendar.render();
        const calendarModal = document.getElementById('calendar-modal');
        const todayTaskList = document.getElementById('today-task-list');
        const recommendTaskList = document.getElementById('recommend-task-list');
        const closeCalendarModalBtn = document.getElementById('close-calendar-modal-btn');
        // UTC → KST 변환 함수
        function utcToKst(date) {
            return new Date(date.getTime() + 9 * 60 * 60 * 1000);
        }
    
        // 모달창 열기 함수
        function openCalendarModal(date) {
            const selectedDate = utcToKst(new Date(date));
            const formattedDate = selectedDate.toISOString().split('T')[0];
            document.querySelector('.clicked-date strong').innerText = date;
            // 기존 리스트 초기화
            todayTaskList.innerHTML = '';
            recommendTaskList.innerHTML = '';
    
            const todayTasks = calendar.getEvents().filter(event => {
                const eventStartKST = utcToKst(event.start);
                const eventEndKST = event.end ? utcToKst(event.end) : eventStartKST;
                const eventFormattedDate = eventStartKST.toISOString().split('T')[0];
                const eventFormattedDateEnd = eventEndKST.toISOString().split('T')[0];
    
                return (
                    formattedDate >= eventFormattedDate &&
                    formattedDate <= eventFormattedDateEnd &&
                    event.extendedProps.type === 'today'
                );
            });
    
            const recommendTasks = calendar.getEvents().filter(event => {
                const eventStartKST = utcToKst(event.start);
                const eventEndKST = event.end ? utcToKst(event.end) : eventStartKST;
                const eventFormattedDate = eventStartKST.toISOString().split('T')[0];
                const eventFormattedDateEnd = eventEndKST.toISOString().split('T')[0];
    
                return (
                    formattedDate >= eventFormattedDate &&
                    formattedDate <= eventFormattedDateEnd &&
                    event.extendedProps.type === 'recommend'
                );
            });
    
            // 작업 리스트 업데이트
            todayTasks.forEach(task => {
                const li = document.createElement('li');
                li.innerText = task.title;
                todayTaskList.appendChild(li);
            });
    
            recommendTasks.forEach(task => {
                const li = document.createElement('li');
                li.innerText = task.title;
                recommendTaskList.appendChild(li);
            });
    
            // 모달창 표시
            calendarModal.classList.remove('hidden');
        }
        // 모달창 닫기 버튼
        closeCalendarModalBtn.addEventListener('click', function () {
            calendarModal.classList.add('hidden');
        });
        
    } else {
        console.error("캘린더 요소를 찾을 수 없습니다.");
    }

    const calendarAddTaskBtn = document.getElementById('add-calendar-task-btn'); // 캘린더 모달의 "할 일 추가" 버튼
    // "할 일 추가" 버튼 클릭 이벤트
    calendarAddTaskBtn.addEventListener('click', () => {    
        taskModal.classList.remove('hidden'); // task-modal 표시
        const taskStartDateInput = document.querySelector('.task-start-date');
        if (taskStartDateInput && selectedDate) {
            taskStartDateInput.value = selectedDate; // 선택된 날짜 설정
        }
    });
});
