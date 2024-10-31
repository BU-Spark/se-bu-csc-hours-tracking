// dashboard/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  getEventsByOrganizerId,
  getOrganizationByUserId,
  getPendingSubmissions,
  getOrganizationStats,
  getSubmittedEvents,
} from "./action";
import EventsBar from "./EventsBar";
import PendingSubmissions from "./PendingSubmissions";
import YourStats from "./YourStats";
import { Layout, Spin } from "antd";
import { HourSubmission, Event, Person } from "@prisma/client";

interface HourSubmissionWithRelations extends HourSubmission {
  volunteer: Person;
  event: Event;
}

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [organizationId, setOrganizationId] = useState<number>(0);
  const { data: session } = useSession();
  const [pendingSubmissions, setPendingSubmissions] = useState<
    HourSubmissionWithRelations[]
  >([]);
  const [stats, setStats] = useState<{
    totalSubmissions: number;
    approvedSubmissions: number;
    pendingSubmissions: number;
    totalHoursLogged: number;
    pendingHours: number;
  } | null>(null);
  const [submittedEvents, setSubmittedEvents] = useState<
    { id: number; title: string; event_start: Date; approval_status: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) return;

      const userId = session.user.id;
      const person = await getOrganizationByUserId(Number(userId));
      const orgId = person?.affiliation?.id
        ? Number(person.affiliation?.id)
        : 0;
      setOrganizationId(orgId);
      console.log(orgId);

      // Fetch events
      const eventResult = await getEventsByOrganizerId(orgId);
      setEvents(eventResult);
      console.log(eventResult);

      // Fetch pending submissions
      const submissions: HourSubmissionWithRelations[] =
        await getPendingSubmissions(orgId);
      setPendingSubmissions(submissions);

      // Fetch stats
      const statsResult = await getOrganizationStats(orgId);
      setStats(statsResult);

      // Fetch submitted events
      const submittedEventsResult = await getSubmittedEvents(orgId);
      setSubmittedEvents(submittedEventsResult);

      setLoading(false);
    };
    fetchData();
  }, [session]);

  return (
    <Layout style={{backgroundColor: "#fff" }}>
      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh", // Ensure spinner is centered vertically
          }}
        >
          <Spin />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          <EventsBar />
          <PendingSubmissions submissions={pendingSubmissions} />
          {stats && <YourStats stats={stats} />}
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;