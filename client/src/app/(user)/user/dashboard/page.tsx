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
        <header className={styles.header}>
          <div>
            <h1 className={styles.greeting}>Hey, {person?.name}</h1>
            <p className={styles.date}>
              Today is {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                year: 'numeric' 
              })}
            </p>
          </div>
          <div className={styles.notificationIcon}>
            <img src="/notification-icon.png" alt="Notifications" />
          </div>
        </header>

        <div className={styles.featuredCards}>
          <div className={styles.card}>
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/a79c10b2df66d06f7d3afd2a1fb0673833d6e9120738075e3f0ec116a0ce9b6b" alt="CSC Programs" className={styles.cardImage} />
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>CSC Programs</h3>
              <a href="#" className={styles.cardLink}>Learn More</a>
            </div>
          </div>
          <div className={styles.card}>
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/824021eddd5d093bf5256b71a125e5b62b481665715b72c63f8ac770f3fcb06b" alt="Join the CSC" className={styles.cardImage} />
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Join the CSC</h3>
              <a href="#" className={styles.cardLink}>Learn More</a>
            </div>
          </div>
          <div className={styles.card}>
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/b45508b446396513217812dc9ed04a322366668c0644f412be05d0d877cab59b" alt="Newsletter" className={styles.cardImage} />
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Newsletter</h3>
              <a href="#" className={styles.cardLink}>Sign Up</a>
            </div>
          </div>
        </div>

        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statsCard}>
              <h3>You Completed</h3>
              <p className={styles.statValue}>{stats.approvedHours}h</p>
              <p className={styles.statLabel}>this semester</p>
            </div>
            <div className={styles.statsCard}>
              <h3>You Attended</h3>
              <p className={styles.statValue}>{stats.totalEvents}</p>
              <p className={styles.statLabel}>Events this semester</p>
            </div>
            <div className={styles.statsCard}>
              <h3>You Submitted</h3>
              <p className={styles.statValue}>{stats.pendingHours}</p>
              <p className={styles.statLabel}>Service Opportunities</p>
            </div>
          </div>

          <div className={styles.progressSection}>
            <h3 className={styles.progressTitle}>Current Progress</h3>
            <div className={styles.progressCard}>
              <p className={styles.progressText}>
                Your are {90 - stats.approvedHours} hours away from your goals for this semester.
              </p>
              <div className={styles.progressBarContainer}>
                <div 
                  className={styles.progressBar} 
                  style={{ width: `${(stats.approvedHours / 90) * 100}%` }} 
                />
              </div>
              <div className={styles.progressLabels}>
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </section>

        <UserCalendar />
      </section>
    </HeaderOffset>
  );
};

export default Dashboard;
