"use client";

import React from "react";
import { Event } from "@prisma/client";
import { Spin } from "antd";
import {
  CalendarContainer,
  CalendarGrid,
  DayCell,
  DayHeader,
  EventIndicator,
  EventDot,
  EventLabel,
} from "@/_common/styledDivs";

interface CalendarProps {
  events: Event[];
  loading: boolean;
  currentDate: Date;
  onEventClick?: (event: Event) => void;
}

const Calendar: React.FC<CalendarProps> = ({ events, loading, currentDate, onEventClick }) => {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
  
    let firstDayIndex = firstDayOfMonth.getDay();
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  
    const days = [];
    
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex; i > 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i + 1),
        isCurrentMonth: false,
      });
    }
  
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }
  
    while (days.length < 42) {
      days.push({
        date: new Date(year, month + 1, days.length - daysInMonth - firstDayIndex + 1),
        isCurrentMonth: false,
      });
    }
  
    return days;
  };

  const getEventForDate = (date: Date) => {
    return events.find(event => 
      new Date(event.event_start).toDateString() === date.toDateString()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Spin />
      </div>
    );
  }

  return (
    <CalendarContainer>
      <CalendarGrid>
        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(day => (
          <DayHeader key={day}>{day}</DayHeader>
        ))}

        {getDaysInMonth(currentDate).map((day, index) => {
          const event = getEventForDate(day.date);
          return (
            <DayCell
              key={index}
              isToday={isToday(day.date)}
              isCurrentMonth={day.isCurrentMonth}
            >
              {day.date.getDate()}
              {event && (
                <EventIndicator
                  onClick={() => onEventClick?.(event)}
                  style={{ cursor: onEventClick ? 'pointer' : 'default' }}
                >
                  <EventDot />
                  <EventLabel>
                    <span className="time">
                      {new Date(event.event_start).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="event">{event.title}</span>
                  </EventLabel>
                </EventIndicator>
              )}
            </DayCell>
          );
        })}
      </CalendarGrid>
    </CalendarContainer>
  );
};

export default Calendar; 