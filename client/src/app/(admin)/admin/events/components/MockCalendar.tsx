// File: src/app/(admin)/admin/events/components/MockCalendar.tsx
"use client";

import React, { useState } from "react";
import {
  CalendarContainer,
  CalendarGrid,
  DayCell,
  DayHeader,
  EventIndicator,
  EventDot,
  EventLabel,
} from "@/_common/styledDivs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styled from "styled-components";

// Mock event type
interface MockEvent {
  id: string;
  event_start: string; // ISO string
  title: string;
}

// Controls wrapper
const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export default function MockCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Month-year label
  const monthYear = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // Mock events for demonstration
  const mockEvents: MockEvent[] = [
    { id: "1", event_start: "2024-03-06T15:00:00", title: "3:00pm SFR" },
    { id: "2", event_start: "2024-03-06T20:00:00", title: "8:00pm ASB" },
    { id: "3", event_start: "2024-03-25T15:00:00", title: "3:00pm SFR" },
  ];

  // Navigate months
  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Determine offset for Monday-first
    let firstDayIndex = firstDayOfMonth.getDay();
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    // Previous month's trailing days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex; i > 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i + 1),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    // Next month's leading days
    while (days.length < 42) {
      const nextDay = days.length - daysInMonth - firstDayIndex + 1;
      days.push({ date: new Date(year, month + 1, nextDay), isCurrentMonth: false });
    }

    return days;
  };

  // Find event for date
  const getEventForDate = (date: Date) =>
    mockEvents.find(
      (ev) => new Date(ev.event_start).toDateString() === date.toDateString()
    );

  // Check today
  const isToday = (date: Date) => {
    const now = new Date();
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  return (
    <div>
      {/* Month navigation */}
      <Controls>
        <ChevronLeft size={24} onClick={prevMonth} style={{ cursor: "pointer" }} />
        <span style={{ fontWeight: "bold" }}>{monthYear}</span>
        <ChevronRight size={24} onClick={nextMonth} style={{ cursor: "pointer" }} />
      </Controls>

      {/* Calendar Grid */}
      <CalendarContainer>
        <CalendarGrid>
          {['MON','TUE','WED','THU','FRI','SAT','SUN'].map((d) => (
            <DayHeader key={d}>{d}</DayHeader>
          ))}

          {getDaysInMonth(currentDate).map((day, idx) => {
            const ev = getEventForDate(day.date);
            return (
              <DayCell
                key={idx}
                isToday={isToday(day.date)}
                isCurrentMonth={day.isCurrentMonth}
              >
                {day.date.getDate()}
                {ev && (
                  <EventIndicator>
                    <EventDot />
                    <EventLabel>
                      <span className="time">
                        {new Date(ev.event_start).toLocaleTimeString([], {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className="event">{ev.title}</span>
                    </EventLabel>
                  </EventIndicator>
                )}
              </DayCell>
            );
          })}
        </CalendarGrid>
      </CalendarContainer>
    </div>
  );
}