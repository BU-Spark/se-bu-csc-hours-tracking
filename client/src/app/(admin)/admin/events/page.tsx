"use client";
import React, { useState, useEffect } from "react";
import { Event } from "@prisma/client";
import { Layout, Spin } from "antd";
import { Content } from "antd/es/layout/layout";
import { getEvents } from "@/app/(user)/user/events/action";
import {
  AddHoursButton,
  PlusCircle,
  Rectangle,
  SummaryBox,
  SummaryContainer,
  CalendarContainer,
  CalendarHeader,
  CalendarButton,
  DayCell,
  DayHeader,
  CalendarGrid,
  EventIndicator,
  EventDot,
  EventLabel,
  CalendarWrapper,
  MonthYearDisplay,
  NavigationButton,
} from "@/_common/styledDivs";
import { AiOutlinePlus } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      const eventResult = await getEvents();
      setEvents(eventResult);
      setLoading(false);
    };
    setLoading(true);
    fetchEvents();
  }, []);

  const today = new Date();
  const isToday = (date: Date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const eventsToday = events.filter((event) =>
    isToday(new Date(event.event_start)),
  );
  const upcomingEvents = events.filter(
    (event) => new Date(event.event_start) > today,
  );

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
  
    // Adjust Sunday (0) to align with Monday as first day
    let firstDayIndex = firstDayOfMonth.getDay();
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  
    const days = [];
  
    // Fill previous month days for correct alignment
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex; i > 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i + 1),
        isCurrentMonth: false,
      });
    }
  
    // Fill current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }
  
    // Fill next month days to ensure exactly 42 cells (6 rows)
    while (days.length < 42) {
      days.push({
        date: new Date(year, month + 1, days.length - daysInMonth - firstDayIndex + 1),
        isCurrentMonth: false,
      });
    }
  
    return days;
  };
  
  
  

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  const getEventForDate = (date: Date) => {
    return events.find(
      (event) =>
        new Date(event.event_start).toDateString() === date.toDateString(),
    );
  };

  return (
    <Layout
      style={{
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "60vw",
      }}
    >
      <Content style={{ width: "100%" }}>
        <div style={{ margin: "2rem 0" }}>
          <AddHoursButton onClick={() => router.push("/admin/events/new")}>
            <PlusCircle>
              <AiOutlinePlus />
            </PlusCircle>
            <Rectangle>Create Event</Rectangle>
          </AddHoursButton>
        </div>

        <SummaryContainer
          style={{ alignItems: "start", justifyContent: "start" }}
        >
          <SummaryBox>
            <h2>{eventsToday.length}</h2>
            <p>Events Today</p>
          </SummaryBox>
          <SummaryBox>
            <h2>{upcomingEvents.length}</h2>
            <p>Upcoming Events</p>
          </SummaryBox>
        </SummaryContainer>

        <CalendarWrapper>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <MonthYearDisplay>Event Calendar</MonthYearDisplay>
              <div className="flex gap-2">
                <NavigationButton onClick={handlePrevMonth}>
                  <ChevronLeft className="w-2.5 h-4" />
                </NavigationButton>
                <NavigationButton onClick={handleNextMonth}>
                  <ChevronRight className="w-2.5 h-4" />
                </NavigationButton>
              </div>
            </div>
            <div className="flex gap-2">
              <CalendarButton variant="outline">Day</CalendarButton>
              <CalendarButton variant="outline">Week</CalendarButton>
              <CalendarButton variant="filled">Month</CalendarButton>
            </div>
          </div>

          <CalendarContainer>
            {loading ? (
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <Spin />
              </div>
            ) : (
              <CalendarGrid>
                {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                  (day) => (
                    <DayHeader key={day}>{day}</DayHeader>
                  ),
                )}

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
                        <EventIndicator>
                          <EventDot />
                          <EventLabel>
                            <span className="time">
                              {new Date(event.event_start).toLocaleTimeString(
                                [],
                                {
                                  hour: "numeric",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                            <span className="event"> {event.title}</span>
                          </EventLabel>
                        </EventIndicator>
                      )}
                    </DayCell>
                  );
                })}
              </CalendarGrid>
            )}
          </CalendarContainer>
        </CalendarWrapper>
      </Content>
    </Layout>
  );
}

export default Events;
