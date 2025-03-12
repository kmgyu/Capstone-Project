import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Localization for calendar
moment.locale('ko');
const localizer = momentLocalizer(moment);

function SmartFarmDashboard() {
  const [todoItems, setTodoItems] = useState([
    { id: 1, name: '작업1 이름', completed: false },
    { id: 2, name: '작업2 이름', completed: false },
    { id: 3, name: '작업3 이름', completed: false }
  ]);

  const [hospitalTasks, setHospitalTasks] = useState([
    { id: 1, name: '병증해 대응 작업1', completed: false },
    { id: 2, name: '병증해 대응 작업2', completed: false }
  ]);

  const [events] = useState([
    {
      title: '농약 살포',
      start: new Date(2025, 2, 10),
      end: new Date(2025, 2, 10)
    },
    {
      title: '수확 시작',
      start: new Date(2025, 2, 14),
      end: new Date(2025, 2, 14)
    }
  ]);

  const toggleTodoCompletion = (id, type) => {
    if (type === 'todo') {
      setTodoItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, completed: !item.completed } : item
        )
      );
    } else {
      setHospitalTasks(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, completed: !item.completed } : item
        )
      );
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 flex justify-between items-center">
        <div>스마트팜</div>
        <div className="flex space-x-4">
          <button>로그인</button>
          <button>회원가입</button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="w-1/4 bg-green-100 p-4">
          <div className="mb-4">
            <div className="bg-yellow-200 p-2 rounded">
              20°C 풍속: 2m/s
            </div>
          </div>

          <div className="mb-4">
            <h2 className="font-bold mb-2">Todo List</h2>
            {todoItems.map(item => (
              <div key={item.id} className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={item.completed}
                  onChange={() => toggleTodoCompletion(item.id, 'todo')}
                />
                <span className="ml-2">{item.name}</span>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <h2 className="font-bold mb-2">병증해 대응 추천</h2>
            {hospitalTasks.map(item => (
              <div key={item.id} className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={item.completed}
                  onChange={() => toggleTodoCompletion(item.id, 'hospital')}
                />
                <span className="ml-2">{item.name}</span>
              </div>
            ))}
          </div>

          <button className="w-full bg-orange-500 text-white p-2 rounded">
            일정 생성
          </button>
        </div>

        {/* Main Content Area */}
        <div className="w-3/4 p-4">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            culture="ko"
          />

          {/* Bottom Section for Node Image */}
          <div className="mt-4 bg-green-200 p-4">
            <h3>노지 항공사진</h3>
            <div className="flex justify-between items-center">
              <img 
                src="/path/to/node/image" 
                alt="노지 항공사진" 
                className="max-h-64 object-cover"
              />
              <div>
                <button className="mr-2 bg-white p-2 rounded">병충해</button>
                <button className="bg-white p-2 rounded">항공사진</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SmartFarmDashboard;