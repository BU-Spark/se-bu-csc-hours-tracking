"use client";
import StyledButton from "@/components/StyledButton";
import React, { useEffect, useState } from "react";
import {
  HeaderOffset,
  SummaryContainer,
  SummaryBox,
} from "@/_common/styledDivs";
import { HourSubmission } from "@prisma/client";
import { getHourSubmissionTableData, getPendingSubmissions } from "./action";
import CustomTable from "@/components/Table/CustomTable";
import { CustomTableParams, HoursTableData } from "@/interfaces/interfaces";

const StudentHours: React.FC = () => {
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [pendingSubmissions, setPendingSubmissions] = useState<
    HoursTableData[]
  >([]);
  const [reviewedSubmissions, setReviewedSubmissions] = useState<
    HoursTableData[]
  >([]);

  const input: CustomTableParams = {
    data: showHistory ? reviewedSubmissions : pendingSubmissions,
    set1: setPendingSubmissions,
    val1: pendingSubmissions,
    set2: setReviewedSubmissions,
    val2: reviewedSubmissions,
  };

  useEffect(() => {
    const fetchAllSubmissions = async () => {
      const response = await getHourSubmissionTableData();
      if (!response) {
        console.error("invalid response");
        return;
      }
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
            <p>Pending Approvals</p>
          </SummaryBox>
          <SummaryBox>
            <h2>
              {reviewedSubmissions
                ? reviewedSubmissions.reduce((accumulator, current) => {
                    if (current.approvalStatus === 1) {
                      return accumulator + current.hours;
                    } else {
                      return accumulator;
                    }
                  }, 0)
                : 0}
            </h2>{" "}
            <p>Approved Hours</p>
          </SummaryBox>
        </div>
      </SummaryContainer>
      <CustomTable
        data={input.data}
        set1={input.set1}
        val1={input.val1}
        set2={input.set2}
        val2={input.val2}
      />
    </HeaderOffset>
  );
};

export default StudentHours;
