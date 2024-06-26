"use client";

import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { useRouter } from "next/navigation";
import { getEvents } from "./[events_id]/action";
import { Event } from "@prisma/client";
import { AiOutlinePlus } from "react-icons/ai";
import {
  AddHoursButtonContainer,
  AddHoursButton,
  PlusCircle,
  Rectangle,
} from "../../../../_common/styledDivs";
import { Buffer } from "buffer";
import CardGrid from "@/app/(user)/user/events/CardGrid";

const { Content } = Layout;

const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      const eventResult = await getEvents();
      setEvents(eventResult);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

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
        <AddHoursButtonContainer>
          <AddHoursButton onClick={() => router.push("/admin/events/new")}>
            <PlusCircle>
              <AiOutlinePlus />
            </PlusCircle>
            <Rectangle>Create Event</Rectangle>
          </AddHoursButton>
        </AddHoursButtonContainer>
        {events ? (
          <CardGrid events={events} filter={0} myEvents={undefined} />
        ) : (
          <p>loading</p>
        )}
      </Content>
    </Layout>
  );
};

export default AdminEvents;
