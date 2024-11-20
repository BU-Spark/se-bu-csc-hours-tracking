"use client";
import React, { useState, useEffect } from "react";
import { Event } from "@prisma/client";
import { Button, Layout, Spin, Row, Col} from "antd";
import { Content } from "antd/es/layout/layout";
import { useSession } from '@clerk/clerk-react';
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
import ThirdPartyFeedback from "./Feedback";


function MyEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { session } = useSession();
  const [sessionLoaded, setSessionLoaded] = useState<boolean>(false);
  const router = useRouter();
  const [organizationId, setOrganizationId] = useState<number>(0);
  const [dateFilter, setDateFilter] = useState<Date>(new Date());



  useEffect(() => {
    
  }, [])

  const handleSetDateFilter = (date: Date) => {
    setDateFilter(date);
  };

  // const today = new Date();
  // const isToday = (date: Date) =>
  //   date.getDate() === today.getDate() &&
  //   date.getMonth() === today.getMonth() &&
  //   date.getFullYear() === today.getFullYear();

  // const eventsToday = events.filter((event) =>
  //   isToday(new Date(event.event_start))
  // );
  // const upcomingEvents = events.filter(
  //   (event) => new Date(event.event_start) > today
  // );

  return (
    <Layout style={{ backgroundColor: 'white' }}>
      <Content>
        <EventsBar/>
        <Row>
          <Col span={12}>
            <ThirdPartyFeedback />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default MyEvents;
