"use client";

import React, { useState, useEffect } from "react";
import { Event, Person as PrismaUser } from "@prisma/client";
import { Layout, Spin } from "antd";
import { getEvents, getEventsByUserId } from "@/app/(user)/user/events/action";
import { useSession } from '@clerk/clerk-react';
import Calendar from "@/components/Calendar";
import {
  CalendarWrapper,
  MonthYearDisplay,
  NavigationButton,
  CalendarButton,
} from "@/_common/styledDivs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

// Extend the Person type to include events
interface Person extends PrismaUser {
  events?: Event[];
}

const UserCalendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [person, setPerson] = useState<Person>();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const { session, isSignedIn } = useSession();
  const router = useRouter();

  const monthYear = currentDate.toLocaleString('default', { 
    month: 'long', 
    year: 'numeric' 
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (isSignedIn && session) {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const url = new URL('/api/get-person', baseUrl);
        url.searchParams.append('clerk_id', session.user.id);

        const response = await fetch(url.toString());
        const data = response.ok ? await response.json() : null;

        if (data && data.person) {
          setPerson(data.person);
        } else {
          console.warn("Person data is not available");
        }
      }
    };

    fetchUserData();
  }, [isSignedIn, session]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (person) {
        const userEvents = await getEventsByUserId(person.id);
        setEvents(userEvents);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [person]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
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
        onEventClick={(event) => router.push(`/user/events/${event.id}`)}
      />
    </CalendarWrapper>
  );
};

export default UserCalendar; 