"use client";

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import { getHoursByUserEmail } from './action';
import { AiOutlinePlus } from 'react-icons/ai';
import { FaComment } from 'react-icons/fa';

interface Hour {
  id: number;
  image: string;
  eventName: string;
  organization: string;
  location: string;
  status: string;
  date: string;
  reviewer: string | null;
  hours: number;
}

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

const HoursItem = styled.div<{ status: string }>`
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
    color: ${(props) => (props.status === 'approved' ? 'green' : props.status === 'denied' ? 'red' : 'orange')};
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

const MyHours: React.FC = () => {
  const [hours, setHours] = useState<Hour[]>([]);
  const [approvedHours, setApprovedHours] = useState(0);
  const [pendingHours, setPendingHours] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchHours = async () => {
      const session = await getSession();
      if (session?.user?.email) {
        try {
          const data = await getHoursByUserEmail(session.user.email);
          setHours(data);
          const approved = data.filter((hour: Hour) => hour.status === 'approved');
          const pending = data.filter((hour: Hour) => hour.status === 'pending');
          const total = data.reduce((acc: number, hour: Hour) => acc + hour.hours, 0);

          setApprovedHours(approved.length);
          setPendingHours(pending.length);
          setTotalHours(total);

          const currentDate = new Date();
          const upcoming = data.filter((hour: Hour) => new Date(hour.date) > currentDate).length;
          setUpcomingEvents(upcoming);
        } catch (error) {
          console.error('Error fetching hours:', error);
        }
      }
    };

    fetchHours();
  }, []);

  return (
    <HeaderOffset>
      <SummaryContainer>
        <SummaryBox>
          <h2>{upcomingEvents}</h2>
          <p>Upcoming Events</p>
        </SummaryBox>
        <SummaryBox>
          <h2>{totalHours}</h2>
          <p>Submitted Hours</p>
        </SummaryBox>
        <SummaryBox>
          <h2>{approvedHours}</h2>
          <p>Approved Hours</p>
        </SummaryBox>
      </SummaryContainer>
      <HoursGrid>
        {hours.map((hour: Hour) => (
          <HoursItem key={hour.id} status={hour.status}>
            <img src={hour.image} alt={hour.eventName} />
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
                <BoldText className="status">{hour.status}</BoldText>
                <SubText>Reviewed By: {hour.reviewer ? hour.reviewer : "N/A"}</SubText>
              </div>
              <div className="section">
                <BoldText>{new Date(hour.date).toLocaleDateString()}</BoldText>
              </div>
              <div className="section">
                <FaComment />
              </div>
            </div>
          </HoursItem>
        ))}
      </HoursGrid>
      <AddHoursButtonContainer>
        <AddHoursButton onClick={() => router.push('/my-hours/add-hours')}>
          <PlusCircle>
            <AiOutlinePlus />
          </PlusCircle>
          <Rectangle>
            Log Hours
          </Rectangle>
        </AddHoursButton>
      </AddHoursButtonContainer>
    </HeaderOffset>
  );
};

export default MyHours;
