/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
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

const HeaderOffset = styled.div`
  margin-top: 70px;
`;

const SummaryContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const SummaryBox = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  width: 150px;
  margin: 10px;

  h2 {
    color: rgba(204, 0, 0, 1);
    font-size: 2rem;
    margin: 0 10px 0 0;
  }

  p {
    font-size: 1rem;
    color: #000;
    margin: 0;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    width: auto;
    h2 {
      margin: 0 0 10px 0;
    }
  }
`;

const HoursGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 20px;
`;

const HoursItem = styled.div<{ status: number }>`
  display: flex;
  align-items: center;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  width: calc(100% - 40px);
  max-width: 1000px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }

  img {
    width: 100px;
    height: 100px;
    border-radius: 10px;
    object-fit: cover;

    @media (max-width: 768px) {
      margin-bottom: 10px;
    }
  }

  .divider {
    width: 2px;
    height: 100px;
    background-color: rgba(204, 0, 0, 1);
    margin-left: 20px;
    margin-right: 20px;

    @media (max-width: 768px) {
      height: 2px;
      width: 100%;
      margin: 10px 0;
    }
  }

  .details {
    display: flex;
    flex-grow: 1;
    justify-content: space-between;
    align-items: center;
    padding-left: 20px;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      padding-left: 0;
    }
  }

  .section {
    flex: 1;
    padding: 0 20px;

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      padding-right: 0;
    }

    display: flex;
    flex-direction: column;
    justify-content: center;

    @media (max-width: 768px) {
      padding: 10px 0;
    }
  }

  .status {
    font-weight: bold;
    color: ${(props) =>
      props.status === 1 ? "green" : props.status === 0 ? "red" : "orange"};
    text-transform: capitalize;
  }

  .date {
    color: #888;
  }
`;

const EventName = styled.h3`
  font-weight: bold;
  margin: 0;
`;

const SubTitle = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #555;
`;

const BoldText = styled.p`
  font-weight: bold;
  margin: 0;
`;

const SubText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #555;
`;

const AddHoursButtonContainer = styled.div`
  position: fixed;
  top: 100px;
  right: 20px;
  display: flex;
  align-items: center;
`;

const AddHoursButton = styled.button`
  display: flex;
  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  position: relative;
  font-size: 1vw;

  @media (min-width: 600px) {
    font-size: 0.5rem;
  }

  @media (min-width: 768px) {
    font-size: 0.75rem;
  }

  @media (min-width: 992px) {
    font-size: 0.75rem;
  }
`;

const PlusCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3em;
  height: 3em;
  border-radius: 50%;
  background-color: #fff;
  border: 0.2em solid rgba(204, 0, 0, 1);
  color: rgba(204, 0, 0, 1);
  font-size: 1.5em;
  position: relative;
  z-index: 2;

  @media (max-width: 600px) {
    font-size: 1.5em;
  }
`;

const Rectangle = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(204, 0, 0, 1);
  color: #fff;
  border-radius: 25px;
  border: 0.25em solid rgba(204, 0, 0, 1);
  font-weight: bold;
  height: 4.5em;
  line-height: 1.5em;
  position: relative;
  left: -4em;
  padding-left: 4em;
  padding-right: 1.5em;
  font-size: 1em;

  @media (max-width: 600px) {
    font-size: 1em;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-width: 90%;
  width: 500px;

  h3 {
    margin-top: 0;
  }

  button {
    background-color: rgba(204, 0, 0, 1);
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
    margin-top: 20px;
    &:hover {
      background-color: rgba(153, 0, 0, 1);
    }
  }
`;

const MyHours: React.FC = () => {
  const [eventHours, setEventHours] = useState<EventHours[]>([]);
  const [expandedHour, setExpandedHour] = useState<EventHours | null>(null);
  const [approvedHours, setApprovedHours] = useState<Number>(0);
  const [submittedHours, setSubmittedHours] = useState<Number>(0);
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

          const approvedTotal = approved.reduce(
            (acc: number, hour: EventHours) => acc + hour.hours,
            0
          );
          const submittedTotal = data.reduce(
            (acc: number, hour: EventHours) => acc + hour.hours,
            0
          );

          setApprovedHours(approvedTotal);
          setSubmittedHours(submittedTotal - approvedTotal);

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

  const filteredHours = eventHours.filter((hour: EventHours) => {
    if (filter === 1) return hour.approval_status === 1; // Approved
    if (filter === 2) return hour.approval_status === 2; // Denied
    if (filter === 0) return hour.approval_status === 0; // Pending
    return true; // Show all for filter === 3 (none)
  });

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
      <HoursGrid>
        {filteredHours.map((hour: EventHours) => (
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
                  {hour.approval_status === 1 ? "Approved" : "Pending"}
                </BoldText>
                <SubText>
                  {/* Reviewed By: {hour.reviewer ? hour.reviewer : "N/A"}  CHANGE TO GET USER*/}
                  Reviewed By: {"N/A"}
                </SubText>
              </div>
              <div className="section">
                <BoldText>{new Date(hour.date).toLocaleDateString()}</BoldText>
              </div>
              <div className="section">
                <FaComment
                  onClick={() => toggleExpand(hour)}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
          </HoursItem>
        ))}
      </HoursGrid>
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
        <AddHoursButton onClick={() => router.push("/my-hours/add-hours")}>
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
