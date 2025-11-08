import React, {useState} from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import './CalendarWidget.css';

export const CalendarWidget = () => {
    // State để lưu ngày được chọn (mặc định là hôm nay)
    const [date, setDate] = useState(new Date());

    return(
        <div className="calendar-widget-container">
            <Calendar
                onChange={setDate}
                value={date}
            />
        </div>
    );
}