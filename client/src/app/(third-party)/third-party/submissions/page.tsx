"use client";
import {
  HeaderOffset,
  SummaryContainer,
  SummaryBox,
} from "@/_common/styledDivs";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  EventApplicationTableParams,
  EventApplicationsTableData,
} from "@/interfaces/interfaces";
import StyledButton from "@/components/StyledButton";
import {
  getEventApplicationsTableData,
  getOrganizationByUserId
} from "./action";
import { Application } from "@prisma/client";
import EventApplicationTable from "./EventApplicationTable";
import { buRed } from "@/_common/styles";

const PendingSubmissions: React.FC = () => {
  const { data: session } = useSession();
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [pendingApplications, setPendingApplications] = useState<
    EventApplicationsTableData[]
  >([]);
  const [reviewedApplications, setReviewedApplications] = useState<
    EventApplicationsTableData[]
  >([]);

  const [eventTitles, setEventTitles] = useState<Set<string>>(new Set(["All Events"]));
  const [selectedEvent, setSelectedEvent] = useState<string>("All Events");
  const [loading, setLoading] = useState<boolean>(true);

  const filterTableDataByEvent = (tableData: EventApplicationsTableData[]) => {
    // console.log("tableData  =", tableData);
    // console.log("selected evt = ", selectedEvent);
    if (selectedEvent == "All Events") { return tableData; }
    const filtered = tableData.filter(data => data.eventTitle == selectedEvent);
    // console.log("filtered size =", filtered.length);

    return filtered
}
  
  const input: EventApplicationTableParams = {
    data: showHistory ? filterTableDataByEvent(reviewedApplications) : filterTableDataByEvent(pendingApplications),
    set1: setPendingApplications,
    val1: pendingApplications,
    set2: setReviewedApplications,
    val2: reviewedApplications,
  };

  useEffect(() => {
    const fetchAllApplications = async () => {
      const userId = session?.user.id;
      // console.log("user id:", userId);
      let org;
      if (userId) {
        org = await getOrganizationByUserId(Number(userId));
      }
      console.log(org);

      if (org?.affiliation?.id) {
        const response = await getEventApplicationsTableData(org.affiliation.id);

        console.log(org.affiliation.id);

        if (!response) {
            console.error("invalid response");
            return;
        }
        setPendingApplications(response.pendingApplicationRows);
        setReviewedApplications(response.reviewedApplicationRows);
        // Create a new Set to hold the updated event titles
        const updatedEventTitles = new Set(eventTitles);
        // Add new event titles from pending submissions
        response.pendingApplicationRows.forEach((tableData) => {
            updatedEventTitles.add(tableData.eventTitle);
        });
        // Add new event titles from reviewed submissions
        response.reviewedApplicationRows.forEach((tableData) => {
            updatedEventTitles.add(tableData.eventTitle);
        });
        // Update the state with the new Set
        setEventTitles(updatedEventTitles);
        setLoading(false);
      }
    };

    setLoading(true);
    fetchAllApplications();
  }, []);

  return (
    <div>
        <div
            style={{
                display: "flex",
                width: "100%",
            }}
        >
            <SummaryBox>
                <h2>
                    {pendingApplications ? filterTableDataByEvent(pendingApplications).length.toString() : 0}
                </h2>
                <p>Pending Submissions</p>
            </SummaryBox>
            <SummaryBox>
                <h2>
                    {reviewedApplications ? filterTableDataByEvent(reviewedApplications).length.toString() : 0}
                </h2>
                <p>Approved Submissions</p>
            </SummaryBox>
        </div>
        <div style={{ display: "flex", margin: "1rem 0", gap: "16px",}} >
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
        <div style={{ display: "flex", margin: "1rem 0", gap: "16px",}} >
            {Array.from(eventTitles).map((title) => (
                <StyledButton
                    key={title} // Make sure to provide a unique key for each button
                    text={title}
                    onClick={() => {
                        setSelectedEvent(title); // Set the selected event
                    }}
                    selected={selectedEvent === title} // Compare to highlight the selected button
                />
            ))}
        </div>
        
        <EventApplicationTable
            data={input.data}
            set1={input.set1}
            val1={input.val1}
            set2={input.set2}
            val2={input.val2}
        />
    </div>
  );
};

export default PendingSubmissions;
