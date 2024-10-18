"use client";

import React from "react";
import { Progress } from "antd";
import { accentBackground } from "@/_common/styles";

interface YourStatsProps {
  stats: {
    totalSubmissions: number;
    approvedSubmissions: number;
    pendingSubmissions: number;
    totalHoursLogged: number;
    pendingHours: number;
  };
}

const YourStats: React.FC<YourStatsProps> = ({ stats }) => {
  const submissionApprovalRate = stats.totalSubmissions
    ? Math.round((stats.approvedSubmissions / stats.totalSubmissions) * 100)
    : 0;

  const hoursLoggedRate =
    stats.totalHoursLogged + stats.pendingHours > 0
      ? Math.round(
          (stats.totalHoursLogged /
            (stats.totalHoursLogged + stats.pendingHours)) *
            100
        )
      : 0;

  return (
    <section>
      <h2>Your Stats</h2>
      <div style={{ display: "flex", alignItems: "start" }}>
        <div style={{
    textAlign: "center",
    background: accentBackground,
    borderRadius: "15px",
    padding: "1rem",
        }}>
          <h3>Submissions Approved</h3>
          <Progress
            type="circle"
            percent={submissionApprovalRate}
            format={(percent) => `${percent}%`}
          />
          <small></small>
        </div>
        <div style={{
    textAlign: "center",
    background: accentBackground,
    borderRadius: "15px",
    padding: "1rem",
        }}>
          <h3>Hours Logged</h3>
          <Progress
            type="circle"
            percent={hoursLoggedRate}
            format={(percent) => `${percent}%`}
          />
          <small></small>
        </div>
      </div>
    </section>
  );
};

export default YourStats;
