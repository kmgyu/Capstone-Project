import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "../styles.css"; 

const Calendar = () => {
  const [events, setEvents] = useState([
    { title: "농약 살포", date: "2025-03-10" },
    { title: "수확 시작", date: "2025-03-15" },
  ]);

  return (
    <div className="calendar">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        locale="ko"
        height="auto"
      />
    </div>
  );
};

export default Calendar;
