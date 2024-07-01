/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import {
  getHourSubmissionsByUserEmail,
  getUpcomingHoursByUser,
} from "./action";
import { AiOutlinePlus } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { EventHours } from "@/interfaces/interfaces";
import StyledButton from "@/components/StyledButton";
import {
  HeaderOffset,
  SummaryContainer,
  SummaryBox,
  HoursGrid,
  HoursItem,
  BoldText,
  SubText,
  AddHoursButtonContainer,
  AddHoursButton,
  PlusCircle,
  Rectangle,
  Overlay,
  PopupContainer,
} from "@/_common/styledDivs";
import { Spin } from "antd";

const MyHours: React.FC = () => {
  const [eventHours, setEventHours] = useState<EventHours[]>();
  const [expandedHour, setExpandedHour] = useState<EventHours | null>(null);
  const [approvedHours, setApprovedHours] = useState<Number>(0);
  const [submittedHours, setSubmittedHours] = useState<Number>(0);
  const [deniedHours, setDeniedHours] = useState<Number>(0);
  const [upcomingHours, setUpcomingHours] = useState<Number>(0); // you can't submit hours for it yet, projected amount
  const [filter, setFilter] = useState<number>(0); // 0 is pending, 1 is approved, 2 is denied, 3 is all
  const router = useRouter();

  useEffect(() => {
    const fetchHours = async () => {
      const session = await getSession();
      if (session?.user?.email) {
        try {
          const data = await getHourSubmissionsByUserEmail(session.user.email);
          setEventHours(data);
          const approved = data.filter(
            (hour: EventHours) => hour.approval_status === 1
          );

          const denied = data.filter(
            (hour: EventHours) => hour.approval_status === 2
          );

          const approvedTotal = approved.reduce(
            (acc: number, hour: EventHours) => acc + hour.hours,
            0
          );

          const deniedTotal = denied.reduce(
            (acc: number, hour: EventHours) => acc + hour.hours,
            0
          );

          const submittedTotal = data.reduce(
            (acc: number, hour: EventHours) => acc + hour.hours,
            0
          );

          setApprovedHours(approvedTotal);
          setDeniedHours(deniedTotal);
          setSubmittedHours(submittedTotal - approvedTotal - deniedTotal);

          const upcoming = await getUpcomingHoursByUser(
            Number(session.user.id)
          );
          if (upcoming) setUpcomingHours(upcoming);
        } catch (error) {
          console.error("Error fetching hours:", error);
        }
      }
    };

    fetchHours();
  }, []);

  const toggleExpand = (hour: EventHours) => {
    setExpandedHour(expandedHour === hour ? null : hour);
  };

  let filteredHours;

  if (eventHours) {
    filteredHours = eventHours.filter((hour: EventHours) => {
      if (filter === 1) return hour.approval_status === 1; // Approved
      if (filter === 2) return hour.approval_status === 2; // Denied
      if (filter === 0) return hour.approval_status === 0; // Pending
      return true; // Show all for filter === 3 (none)
    });
  }

  return (
    <HeaderOffset>
      <SummaryContainer>
        <SummaryBox>
          <h2>{upcomingHours.toString()}</h2>
          <p>Upcoming Hours</p>
        </SummaryBox>
        <SummaryBox>
          <h2>{submittedHours.toString()}</h2>
          <p>Pending Hours</p>
        </SummaryBox>
        <SummaryBox>
          <h2>{approvedHours.toString()}</h2>
          <p>Approved Hours</p>
        </SummaryBox>
      </SummaryContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "40%",
          margin: "1rem auto",
        }}
      >
        <StyledButton
          text="See All"
          onClick={() => {
            setFilter(3);
          }}
          selected={filter == 3}
        />
        <StyledButton
          text="Approved"
          onClick={() => {
            setFilter(1);
          }}
          selected={filter == 1}
        />
        <StyledButton
          text="Pending"
          onClick={() => {
            setFilter(0);
          }}
          selected={filter == 0}
        />
        <StyledButton
          text="Denied"
          onClick={() => {
            setFilter(2);
          }}
          selected={filter == 2}
        />
      </div>
      {eventHours && filteredHours ? (
        <HoursGrid>
          {filteredHours.map((hour: EventHours) => {
            return (
              <HoursItem key={hour.id} status={hour.approval_status}>
                <img
                  src={`data:image/png;base64,${hour.image}`}
                  alt={hour.eventName}
                />
                <div className="divider"></div>
                <div className="details">
                  <div className="section">
                    <BoldText>{hour.eventName}</BoldText>
                    <SubText>{hour.organization}</SubText>
                  </div>
                  <div className="section">
                    <BoldText>{hour.hours} Hours</BoldText>
                    <SubText>{hour.location}</SubText>
                  </div>
                  <div className="section">
                    <BoldText className="status">
                      {hour.approval_status === 1
                        ? "Approved"
                        : hour.approval_status === 0
                        ? "Pending"
                        : "Denied"}
                    </BoldText>
                    {hour.approval_status != 0 ? (
                      <SubText>
                        {/* Reviewed By: {hour.reviewer ? hour.reviewer : "N/A"}  CHANGE TO GET USER*/}
                        <div
                          style={{
                            textDecoration: "underline",
                            marginTop: "0.5rem",
                          }}
                        >
                          Reviewed By:
                        </div>{" "}
                        {hour.reviewer ? hour.reviewer : "N/A"}
                      </SubText>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="section">
                    <BoldText>
                      {new Date(hour.date).toLocaleDateString()}
                    </BoldText>
                  </div>
                  <div className="section">
                    <FaComment
                      onClick={() => toggleExpand(hour)}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </div>
              </HoursItem>
            );
          })}{" "}
        </HoursGrid>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            top: 0,
            bottom: 0,
          }}
        >
          <Spin />
        </div>
      )}

      {expandedHour && (
        <>
          <Overlay onClick={() => setExpandedHour(null)} />
          <PopupContainer>
            <h3>Description</h3>
            <p>{expandedHour.description}</p>
            <h3>Feedback</h3>
            <p>{expandedHour.feedback}</p>
            <button onClick={() => setExpandedHour(null)}>Close</button>
          </PopupContainer>
        </>
      )}
      <AddHoursButtonContainer>
        <AddHoursButton onClick={() => router.push("/user/my-hours/add-hours")}>
          <PlusCircle>
            <AiOutlinePlus />
          </PlusCircle>
          <Rectangle>Log Hours</Rectangle>
        </AddHoursButton>
      </AddHoursButtonContainer>
    </HeaderOffset>
  );
};

export default MyHours;
