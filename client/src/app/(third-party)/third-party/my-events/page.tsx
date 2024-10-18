"use client";
import React, { useState, useEffect } from "react";
import { Event } from "@prisma/client";
import { Button, Layout, Spin } from "antd";
import { Content } from "antd/es/layout/layout";
import { useSession } from "next-auth/react";
import {
  getEvents,
  getEventsByOrganizerId,
    getOrganizationByUserId,
} from "./action";
import {
  AddHoursButton,
  PlusCircle,
  Rectangle,
  SummaryBox,
  SummaryContainer,
} from "@/_common/styledDivs";
import { AiOutlinePlus } from "react-icons/ai";
import { useRouter } from "next/navigation";
import DateFilter from "./DateFilter";
import EventsBar from "./EventsBar";

function MyEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession();
  const router = useRouter();
  const [organizationId, setOrganizationId] = useState<number>(0);
  const [dateFilter, setDateFilter] = useState<Date>(new Date());



  useEffect(() => {
    const fetchEvents = async () => {
      const userId = session?.user.id;
				if (userId){
					const org = await getOrganizationByUserId(Number(userId));
          const orgId = org?.affiliation?.id || 0;
					const eventResult = await getEventsByOrganizerId(orgId);
					setEvents(eventResult);
          setLoading(false);
				}
    };
    setLoading(true);
    fetchEvents();
  }, [dateFilter]);

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
    <EventsBar/>
    
  );
}

export default MyEvents;
