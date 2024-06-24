"use client";
import CustomTable from "@/components/Table/CustomTable";
import {
  HeaderOffset,
  SummaryContainer,
  SummaryBox,
} from "@/_common/styledDivs";
import { useState, useEffect } from "react";
import {
  EventApplicationsTableData,
  HoursTableData,
} from "@/interfaces/interfaces";
import { CustomTableParams } from "@/interfaces/interfaces";
import StyledButton from "@/components/StyledButton";
import {
  getAllPendingApplications,
  getEventApplicationsTableData,
} from "./action";
import { Application } from "@prisma/client";

const StudentHours: React.FC = () => {
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [pendingApplications, setPendingApplications] = useState<
    EventApplicationsTableData[]
  >([]);
  const [reviewedApplications, setReviewedApplications] = useState<
    EventApplicationsTableData[]
  >([]);

  const input: CustomTableParams = {
    data: showHistory ? reviewedApplications : pendingApplications,
    dataType: "hoursTableData[]",
    set1: setPendingApplications,
    val1: pendingApplications,
    set2: setReviewedApplications,
    val2: reviewedApplications,
  };

  useEffect(() => {
    const fetchAllApplications = async () => {
      const response:
        | {
            pendingApplicationRows: EventApplicationsTableData[];
            reviewedApplicationRows: EventApplicationsTableData[];
          }
        | undefined = await getEventApplicationsTableData();
      if (!response) {
        console.error("bad response");
        return;
      }

      console.log("response:", response);
      setPendingApplications(response.pendingApplicationRows);
      setReviewedApplications(response.reviewedApplicationRows);
    };

    fetchAllApplications();
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
              {pendingApplications ? pendingApplications.length.toString() : 0}
            </h2>
            <p>Pending Applications</p>
          </SummaryBox>
        </div>
      </SummaryContainer>
      <CustomTable
        data={input.data}
        dataType={input.dataType}
        set1={input.set1}
        val1={input.val1}
        set2={input.set2}
        val2={input.val2}
      />
    </HeaderOffset>
  );
};

export default StudentHours;
