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
  AddEventButton,
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
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay() || 7; // Convert Sunday (0) to 7

    const days = [];

    // Add days from previous month
    const prevMonthDays = firstDayOfWeek - 1;
    const prevMonth = new Date(year, month - 1);
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }

    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Add days from next month
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
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

          <AddEventButton>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/d444ba2e-c739-453e-9d83-f2693fcfed1a?placeholderIfAbsent=true&apiKey=7d881e0539ab4a4a95fff82ac7844ccb"
              alt="Add"
              className="object-contain shrink-0 my-auto aspect-square stroke-[1px] stroke-red-700 w-[11px]"
            />
            Add Events
          </AddEventButton>

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
