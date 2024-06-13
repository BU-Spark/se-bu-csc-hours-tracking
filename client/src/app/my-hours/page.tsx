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
  location: string;
  status: string;
  date: string;
  reviewer: string;
  hours: number;
}

const HeaderOffset = styled.div`
  margin-top: 70px;
`;

const SummaryContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const SummaryBox = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 150px;

  h2 {
    color: rgba(204, 0, 0, 1);
    font-size: 2rem;
    margin: 0;
  }

  p {
    font-size: 1rem;
    color: #000;
  }
`;

const FilterButtons = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  button {
    margin: 0 10px;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    background-color: #ccc;
    cursor: pointer;
    &:hover {
      background-color: #bbb;
    }
  }
`;

const HoursGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  padding: 0 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const HoursItem = styled.div<{ status: string }>`
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  img {
    width: 80px;
    height: 80px;
    border-radius: 10px;
    margin-right: 20px;
    object-fit: cover;
  }
  div {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  .details {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .status {
    font-weight: bold;
    color: ${(props) => (props.status === 'approved' ? 'green' : 'orange')};
  }
  .date {
    color: #888;
  }
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
  const [submittedHours, setSubmittedHours] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchHours = async () => {
      const session = await getSession();
      if (session?.user?.email) {
        try {
          const data = await getHoursByUserEmail(session.user.email);
          setHours(data);
          setApprovedHours(data.filter((hour: Hour) => hour.status === 'approved').length);
          setPendingHours(data.filter((hour: Hour) => hour.status === 'pending').length);
          setSubmittedHours(data.length);

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
          <h2>{submittedHours}</h2>
          <p>Submitted Hours</p>
        </SummaryBox>
        <SummaryBox>
          <h2>{approvedHours}</h2>
          <p>Approved Hours</p>
        </SummaryBox>
      </SummaryContainer>
      <FilterButtons>
        <button>This Month</button>
        <button>This Year</button>
        <button>Cumulative</button>
      </FilterButtons>
      <HoursGrid>
        {hours.map((hour: Hour) => (
          <HoursItem key={hour.id} status={hour.status}>
            <img src={hour.image} alt={hour.eventName} />
            <div>
              <div className="details">
                <div>
                  <h3>{hour.eventName}</h3>
                  <p>{hour.hours} Hours</p>
                  <p>{hour.location}</p>
                </div>
                <div>
                  <p className="status">{hour.status}</p>
                  <p className="date">{new Date(hour.date).toLocaleDateString()}</p>
                  <p>Reviewed By: {hour.reviewer}</p>
                </div>
              </div>
            </div>
            <FaComment />
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
