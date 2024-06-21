"use client";
import StyledButton from "@/components/StyledButton";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import {
  HeaderOffset,
  SummaryContainer,
  SummaryBox,
} from "@/app/user/my-hours/page";
import { HourSubmission } from "@prisma/client";

const StudentHours: React.FC = () => {
  const { data: session, status } = useSession();
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [pendingSubmissions, setPendingSubmissions] = useState<
    HourSubmission[]
  >([]);
  const [approvedSubmissions, setApprovedSubmissions] = useState<
    HourSubmission[]
  >([]);
  return (
    <HeaderOffset>
      <SummaryContainer
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "inherit",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            width: "30%",
            margin: "1rem 0",
          }}
        >
          <StyledButton
            text="Pending"
            onClick={() => {
              setShowHistory(false);
            }}
            selected={showHistory == false}
          />
          <StyledButton
            text="History"
            onClick={() => {
              setShowHistory(true);
            }}
            selected={showHistory == true}
          />
        </div>
        <div
          style={{
            gap: "2rem",
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          <SummaryBox>
            <h2>{pendingSubmissions.length.toString()}</h2>
            <p>Pending Submissions</p>
          </SummaryBox>
          <SummaryBox>
            <h2>{approvedSubmissions.length.toString()}</h2>
            <p>Approved Submissions</p>
          </SummaryBox>
        </div>
      </SummaryContainer>
    </HeaderOffset>
  );
};

export default StudentHours;
