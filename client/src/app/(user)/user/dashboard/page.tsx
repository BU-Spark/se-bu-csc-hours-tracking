"use client";

import React, { useEffect, useState } from "react";
import { useSession } from '@clerk/clerk-react';
import { useRouter } from "next/navigation";
import { checkIfNewUser } from "@/app/(user)/user/settings/action";
import { getPersonFromUser } from "@/lib/getPersonFromUser";
import { HeaderOffset } from "@/_common/styledDivs";
import { Spin } from "antd";
import { getHourSubmissionsByUserEmail, getUpcomingHoursByUser } from "../my-hours/action";
import UserCalendar from "@/components/UserCalendar";
import styles from './Dashboard.module.css';
import EventSider from "@/components/Sider/EventSider";
import DashboardHeader from "./components/DashboardHeader";
import FeaturedCards from "./components/FeaturedCards";
import StatsGrid from "./components/StatsGrid";
import ProgressSection from "./components/ProgressSection";

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
      <section className={styles.mainContent}>
        <DashboardHeader name={person?.name} />
        <FeaturedCards />
        <StatsGrid stats={stats} />
        <ProgressSection person={person} approvedHours={stats.approvedHours} />
        <UserCalendar />
      </section>
      <EventSider />
    </HeaderOffset>
  );
};

export default Dashboard;
