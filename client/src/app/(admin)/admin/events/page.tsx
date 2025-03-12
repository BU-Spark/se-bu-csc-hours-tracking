"use client";
import React, { useState, useEffect } from "react";
import { Event } from "@prisma/client";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { getEvents } from "@/app/(user)/user/events/action";
import {
  AddHoursButton,
  PlusCircle,
  Rectangle,
  SummaryBox,
  SummaryContainer,
  CalendarWrapper,
  MonthYearDisplay,
  NavigationButton,
  CalendarButton,
} from "@/_common/styledDivs";
import { AiOutlinePlus } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Calendar from "@/components/Calendar";

function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const monthYear = currentDate.toLocaleString('default', { 
    month: 'long', 
    year: 'numeric' 
  });

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
    isToday(new Date(event.event_start))
  );
  const upcomingEvents = events.filter(
    (event) => new Date(event.event_start) > today
  );

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
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

        <SummaryContainer style={{ alignItems: "start", justifyContent: "start" }}>
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
              <MonthYearDisplay>{monthYear}</MonthYearDisplay>
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

          <Calendar 
            events={events} 
            loading={loading} 
            currentDate={currentDate}
            onEventClick={(event) => router.push(`/admin/events/${event.id}`)}
          />
        </CalendarWrapper>
      </Content>
    </Layout>
  );
}

export default Events;