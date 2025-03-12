"use client";

import React, { useEffect, useState } from "react";
import { useSession } from '@clerk/clerk-react';
import { useRouter } from "next/navigation";
import { checkIfNewUser } from "@/app/(user)/user/settings/action";
import { getPersonFromUser } from "@/lib/getPersonFromUser";
import { HeaderOffset, SummaryContainer, SummaryBox } from "@/_common/styledDivs";
import { Spin } from "antd";
import { getHourSubmissionsByUserEmail, getUpcomingHoursByUser } from "../my-hours/action";
import UserCalendar from "@/components/UserCalendar";

const Dashboard: React.FC = () => {
  const { session, isSignedIn } = useSession();
  const router = useRouter();
  const [person, setPerson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    approvedHours: 0,
    pendingHours: 0,
    upcomingHours: 0,
    totalEvents: 0
  });

  useEffect(() => {
    if (isSignedIn && session?.user) {
      const fetchData = async () => {
        try {
          const person = await getPersonFromUser(session.user.id);
          setPerson(person);

          const isNewUser = await checkIfNewUser();
          if (isNewUser.isNewUser) {
            router.push("/user/onboarding");
            return;
          }

          // Fetch hours data
          if (person?.email) {
            const hourData = await getHourSubmissionsByUserEmail(person.email);
            const upcoming = await getUpcomingHoursByUser(Number(person.id));

            const approved = hourData.filter(hour => hour.approval_status === 1);
            const pending = hourData.filter(hour => hour.approval_status === 0);

            const approvedTotal = approved.reduce((acc, hour) => acc + hour.hours, 0);
            const pendingTotal = pending.reduce((acc, hour) => acc + hour.hours, 0);

            setStats({
              approvedHours: approvedTotal,
              pendingHours: pendingTotal,
              upcomingHours: upcoming ? Number(upcoming) : 0,
              totalEvents: hourData.length
            });
          }
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [isSignedIn, session, router]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <HeaderOffset>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
        Welcome back, {person?.name}!
      </h1>
      
      <SummaryContainer>
        <SummaryBox>
          <h2>{stats.approvedHours}</h2>
          <p>Approved Hours</p>
        </SummaryBox>
        <SummaryBox>
          <h2>{stats.pendingHours}</h2>
          <p>Pending Hours</p>
        </SummaryBox>
        <SummaryBox>
          <h2>{stats.upcomingHours}</h2>
          <p>Upcoming Hours</p>
        </SummaryBox>
        <SummaryBox>
          <h2>{stats.totalEvents}</h2>
          <p>Total Events</p>
        </SummaryBox>
      </SummaryContainer>

      <div style={{ marginTop: "2rem", padding: "0 2rem" }}>
        <UserCalendar />
      </div>

      {/* You can add more sections here like:
          - Recent activity
          - Upcoming events
          - Quick actions
          - Important announcements
      */}
    </HeaderOffset>
  );
};

export default Dashboard;
