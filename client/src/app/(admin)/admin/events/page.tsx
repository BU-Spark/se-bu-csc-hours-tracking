"use client";
import React, { useState, useEffect } from "react";
import { Event } from "@prisma/client";
import { Button, Layout, Spin } from "antd";
import { Content } from "antd/es/layout/layout";
import {
  getApplicationsByUserId,
  getEvents,
  getEventsByApplicationEventIds,
} from "@/app/(user)/user/events/action";
import CardGrid from "@/components/CardGrid/CardGrid";
import {
  AddHoursButton,
  PlusCircle,
  Rectangle,
  SummaryBox,
  SummaryContainer,
  CalendarContainer,
  CalendarHeader,
  CalendarButton,
  EventContent,
  DayCell,
  DayHeader,
  CalendarBody,
} from "@/_common/styledDivs";
import { AiOutlinePlus } from "react-icons/ai";
import { useRouter } from "next/navigation";
import DateFilter from "./DataFilter";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { EventInput } from "@fullcalendar/core";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [dbEvents, setDbEvents] = useState<Event[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<EventInput[]>([]);
  const [dateFilter, setDateFilter] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      const eventResult = await getEvents();
      setDbEvents(eventResult);

      const formattedEvents: EventInput[] = eventResult.map((event) => ({
        id: event.id.toString(),
        title: event.title,
        start: event.event_start,
        end: event.event_end,
        allDay: true,
      }));
      setCalendarEvents(formattedEvents);
      setLoading(false);
    };
    setLoading(true);
    fetchEvents();
  }, []);

  const handleSetDateFilter = (date: Date) => {
    setDateFilter(date);
  };

  const today = new Date();
  const isToday = (date: Date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const eventsToday = events.filter((event) =>
    isToday(new Date(event.event_start))
  );
  const upcomingEvents = events.filter(
    (event) => new Date(event.event_start) > today
  );

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
        <DateFilter setDateFilter={handleSetDateFilter} />
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <CalendarHeader>
            <CalendarButton onClick={() => {/* Handle previous month */}}>
              <ChevronLeft />
            </CalendarButton>
            <div style={{ flex: 1, textAlign: "center" }}>
              <h2>Event Calendar</h2>
            </div>
            <CalendarButton onClick={() => {/* Handle next month */}}>
              <ChevronRight />
            </CalendarButton>
          </CalendarHeader>
          <div>
            <CalendarButton onClick={() => (document.querySelector(".fc-dayGridMonth-button") as HTMLElement)?.click()}>
              Month
            </CalendarButton>
            <CalendarButton onClick={() => (document.querySelector(".fc-timeGridWeek-button") as HTMLElement)?.click()}>
              Week
            </CalendarButton>
            <CalendarButton onClick={() => (document.querySelector(".fc-timeGridDay-button") as HTMLElement)?.click()}>
              Day
            </CalendarButton>
          </div>
        </div>
        <CalendarContainer>
          {loading ? (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <Spin />
            </div>
          ) : (
            <>
              <div className="flex w-full">
                {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day, index) => (
                  <DayHeader key={index}>{day}</DayHeader>
                ))}
              </div>

              <CalendarBody>
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                  initialView="dayGridMonth"
                  events={calendarEvents}
                  eventClick={(info) => {
                    const eventId = info.event.id;
                    router.push(`/admin/events/${eventId}`);
                  }}
                  height="auto"
                  selectable={true}
                  eventContent={(eventInfo) => (
                    <EventContent>{eventInfo.event.title}</EventContent>
                  )}
                  dayCellContent={(arg) => (
                    <DayCell>{arg.dayNumberText}</DayCell>
                  )}
                  dayCellDidMount={(info) => {
                    info.el.style.backgroundColor = "#f9f9f9";
                    info.el.style.border = "1px solid #ccc";
                  }}
                />
              </CalendarBody>
            </>
          )}
        </CalendarContainer>
      </Content>
    </Layout>
  );
}

export default Events;