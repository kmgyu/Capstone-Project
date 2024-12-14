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
            var calendar = new FullCalendar.Calendar(calendarEl, {
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
                { title: '드론 비행행', start: '2024-12-15', type: 'today' },
                { title: '섹터 1 농약', start: '2024-12-15', type: 'today' },
                { title: '섹터 2 수분 공급', start: '2024-12-15', type: 'today' },
                { title: '섹터 3 작물 심기', start: '2024-12-15', type: 'today' },
            ],
            dayCellContent: function(arg) {
                // 날짜를 UTC → KST로 변환
                const formattedDate = utcToKst(arg.date).toISOString().split('T')[0];
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

    function updateTodoList() {
        const todoListEl = document.getElementById('todo');
    
        // 오늘 날짜 계산
        const today = utcToKst(new Date()).toISOString().split('T')[0]; // YYYY-MM-DD 형식
        console.log(today);
    
        const events = calendar.getEvents().filter(event => {
            // 이벤트 시작 날짜와 종료 날짜를 UTC → KST로 변환
            const eventStartKST = utcToKst(event.start);
            console.log(eventStartKST);
            const eventEndKST = event.end ? utcToKst(event.end) : eventStartKST;
    
            // 포맷된 이벤트 시작/종료 날짜
            const eventFormattedDate = eventStartKST.toISOString().split('T')[0];
            const eventFormattedDateEnd = eventEndKST.toISOString().split('T')[0];
    
            // 날짜 범위 비교
            return (
                today >= eventFormattedDate &&
                today <= eventFormattedDateEnd
            );
        });
        console.log(events);
    
        // 기존 리스트 초기화
        todoListEl.innerHTML = '<h3>TODO 리스트</h3>'; // 제목 추가
    
        // TODO 항목 컨테이너 생성
        const todoItemsContainer = document.createElement('div');
        todoItemsContainer.className = 'todo-items';
        todoListEl.appendChild(todoItemsContainer);
    
        // 오늘 이벤트 필터링
        events.forEach(event => {
            const start = event.startStr; // YYYY-MM-DD 형식
            const end = event.endStr || start;
    
            if (start <= today && today <= end) {
                // 이벤트가 오늘 포함된다면 추가
                console.log("add");
                const div = document.createElement('div');
                div.className = 'todo-item';
                div.textContent = event.title;
                todoItemsContainer.appendChild(div);
            }
        });
    
        // 할 일 추가 버튼 생성 및 추가
        const addButton = document.createElement('button');
        addButton.id = 'add-task-btn';
        addButton.className = 'add-task-btn';
        addButton.textContent = '할 일 추가';
        todoListEl.appendChild(addButton);
    }
    
    

    // 초기 호출
    updateTodoList();
    // 날씨 정보 표시를 위한 JavaScript 코드

    const serviceKey = "wGvp1N3oiF2JaBTqPZZt2X8t6/lE8LjMzSKc0I4UpD98tKCnEEzYEajAw5HnBDrzO1y3evtljDkcgT5BG2dNjg==";

    const fetchShortTermWeather = async () => {
        const now = new Date();
        if (now.getHours() < 6) {
            now.setDate(now.getDate() - 1);
        }

        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const baseDate = year + month + day;
        const baseTime = "0200"; // 기준 시간
        const nx = 60; // 위도 좌표
        const ny = 127; // 경도 좌표

        const apiUrl = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst`;
        const params = new URLSearchParams({
            serviceKey,
            pageNo: 1,
            numOfRows: 1000,
            dataType: "JSON",
            base_date: baseDate,
            base_time: baseTime,
            nx,
            ny
        });

        const response = await fetch(`${apiUrl}?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch short-term weather data");

        const data = await response.json();

        // 디버깅용: 실제 응답 데이터를 확인
        console.log("Short-term weather API response:", data);

        // 응답 구조 검증
        if (!data.response || !data.response.body || !Array.isArray(data.response.body.items?.item)) {
            throw new Error("Unexpected API response structure");
        }

        return data.response.body.items.item;
    };

    // 날씨 데이터를 합치기
    const mergeWeatherData = (shortTermData) => {
        const mergedData = [];
        const today = new Date();

        // 단기 데이터 처리 (오늘 ~ 3일 후)
        for (let i = 0; i < 3; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = (date.getDate()).toString().padStart(2, '0');
            const formattedDate = `${year}${month}${day}`

            const maxTemp = shortTermData.find(item => item.category === "TMX" && item.fcstDate === formattedDate)?.fcstValue;
            const minTemp = shortTermData.find(item => item.category === "TMN" && item.fcstDate === formattedDate)?.fcstValue;
            const weather = shortTermData.find(item => item.category === "SKY" && item.fcstDate === formattedDate)?.fcstValue;

            mergedData.push({
                date: formattedDate,
                maxTemp,
                minTemp,
                weather: mapWeatherCodeToText(weather)
            });
        }
        console.log(mergedData)
        return mergedData;
    };

    // 날씨 코드 -> 텍스트 변환 함수
    const mapWeatherCodeToText = (code) => {
        switch (code) {
            case "1": return "맑음";
            case "3": return "구름많음";
            case "4": return "흐림";
            default: return "정보 없음";
        }
    };

    // 날씨 정보를 HTML에 표시
    const displayWeather = (weatherData) => {
        const weatherSection = document.querySelector(".weather");

        weatherData.forEach(day => {
            const weatherItem = document.createElement("div");
            weatherItem.className = "weather-item";
            weatherItem.innerHTML = `
                <h3>${day.date}</h3>
                <p>${day.weather} | <span class="max-temp">${day.maxTemp || "-"}</span>°C | <span class="min-temp">${day.minTemp || "-"}</span>°C</p>
            `;
            weatherSection.appendChild(weatherItem);
        });
    };

    // 메인 실행 함수
    (async () => {
        try {
            const shortTermData = await fetchShortTermWeather();
            const weatherData = mergeWeatherData(shortTermData);
            displayWeather(weatherData);
        } catch (error) {
            console.error("Error fetching or displaying weather data:", error);
        }
    })();
})