"use client";
import StyledButton from "./StyledButton";
import React, { useEffect, useState } from "react";
import {
    HeaderOffset,
    SummaryContainer,
    SummaryBox,
} from "@/_common/styledDivs";
import { HourSubmission } from "@prisma/client";
import { getHourSubmissionTableData, getOrganizationByUserId } from "./action";
import CustomTable from "./CustomTable";
import { CustomTableParams, HoursTableData } from "@/interfaces/interfaces";
import { useSession } from '@clerk/nextjs';
import { getPersonFromUser } from "@/lib/getPersonFromUser";

const PendingHours: React.FC = () => {
    const { session } = useSession();
    const [showHistory, setShowHistory] = useState<boolean>(false);
    const [pendingSubmissions, setPendingSubmissions] = useState<
        HoursTableData[]
    >([]);
    const [reviewedSubmissions, setReviewedSubmissions] = useState<
        HoursTableData[]
    >([]);
    const [eventTitles, setEventTitles] = useState<Set<string>>(new Set(["All Events"]));
    const [selectedEvent, setSelectedEvent] = useState<string>("All Events");
    //do sum w this
    const [loading, setLoading] = useState<boolean>(true);

    const filterTableDataByEvent = (tableData: HoursTableData[]) => {
        // console.log("tableData  =", tableData);
        // console.log("selected evt = ", selectedEvent);
        if (selectedEvent == "All Events") { return tableData; }
        const filtered = tableData.filter(data => data.eventTitle == selectedEvent);
        // console.log("filtered size =", filtered.length);

        return filtered
    }
    const input: CustomTableParams = {
        data: showHistory ? filterTableDataByEvent(reviewedSubmissions) : filterTableDataByEvent(pendingSubmissions),
        set1: setPendingSubmissions,
        val1: pendingSubmissions,
        set2: setReviewedSubmissions,
        val2: reviewedSubmissions,
    };

    useEffect(() => {
        const fetchAllSubmissions = async () => {
            const { userId } = await getPersonFromUser(String(session?.user.id));
            let org;
            if (userId) {
                org = await getOrganizationByUserId(Number(userId));
            }
            // console.log("org = ", org)
            // console.log("org aff = ", org?.affiliation)
            // console.log("org aff id = ", org?.affiliation?.id)
            if (org?.affiliation?.id) {
                const response = await getHourSubmissionTableData(org.affiliation.id);
                if (!response) {
                    console.error("invalid response");
                    return;
                }
                setPendingSubmissions(response.pendingHourRows);
                setReviewedSubmissions(response.reviewHourRows);

                // Create a new Set to hold the updated event titles
                const updatedEventTitles = new Set(eventTitles);

                // Add new event titles from pending submissions
                response.pendingHourRows.forEach((tableData) => {
                    updatedEventTitles.add(tableData.eventTitle);
                });

                // Add new event titles from reviewed submissions
                response.reviewHourRows.forEach((tableData) => {
                    updatedEventTitles.add(tableData.eventTitle);
                });

                // Update the state with the new Set
                setEventTitles(updatedEventTitles);
                setLoading(false);
            }

        };
        setLoading(true);
        fetchAllSubmissions();
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
                        {pendingSubmissions ? filterTableDataByEvent(pendingSubmissions).length.toString() : 0}
                    </h2>
                    <p>Pending Approvals</p>
                </SummaryBox>
                <SummaryBox>
                    <h2>
                        {reviewedSubmissions
                            ? filterTableDataByEvent(reviewedSubmissions).reduce((accumulator, current) => {
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
            
            <CustomTable
                data={input.data}
                set1={input.set1}
                val1={input.val1}
                set2={input.set2}
                val2={input.val2}
            />
        </div>
    );
};

export default PendingHours;
