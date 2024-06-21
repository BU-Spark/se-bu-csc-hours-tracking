"use client";
import StyledButton from "@/components/StyledButton";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
  HeaderOffset,
  SummaryContainer,
  SummaryBox,
} from "@/app/(user)/user/my-hours/page";
import { HourSubmission } from "@prisma/client";
import { getHourSubmissionTableData, getPendingSubmissions } from "./action";
import CustomTable from "@/components/Table/CustomTable";
import { CustomTableParams, HoursTableData } from "@/interfaces/interfaces";

const StudentHours: React.FC = () => {
  const { data: session, status } = useSession();
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [pendingSubmissions, setPendingSubmissions] = useState<
    HoursTableData[]
  >([]);
  const [reviewedSubmissions, setReviewedSubmissions] = useState<
    HoursTableData[]
  >([]);

  const input: CustomTableParams = {
    data: showHistory ? reviewedSubmissions : pendingSubmissions,
    dataType: "hoursTableData[]",
  };

  useEffect(() => {
    const fetchAllSubmissions = async () => {
      const response = await getHourSubmissionTableData();
      if (!response) {
        console.log(response);
        console.error("invalid response");
        return;
      }
      console.log("All Submissions", response);
      setPendingSubmissions(response.pendingHourRows);
      setReviewedSubmissions(response.reviewHourRows);
    };
    fetchAllSubmissions();
  }, []);
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
            <h2>
              {pendingSubmissions ? pendingSubmissions.length.toString() : 0}
            </h2>
            <p>Pending Submissions</p>
          </SummaryBox>
          <SummaryBox>
            <h2>
              {reviewedSubmissions ? reviewedSubmissions.length.toString() : 0}
            </h2>{" "}
            {/* CHANGE TO HOURS APPROVED*/}
            <p>Approved Submissions</p>
          </SummaryBox>
        </div>
      </SummaryContainer>
      <CustomTable data={input.data} dataType={input.dataType} />
    </HeaderOffset>
  );
};

export default StudentHours;
