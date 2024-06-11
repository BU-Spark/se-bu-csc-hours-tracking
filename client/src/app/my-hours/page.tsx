"use client";

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getSession } from 'next-auth/react';
import { getHoursByUserEmail } from './action';

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

const HoursSummary = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const HoursBox = styled.div`
  text-align: center;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
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

const HoursList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const HoursItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 20px;
  }
`;

const MyHours: React.FC = () => {
  const [hours, setHours] = useState<Hour[]>([]);
  const [approvedHours, setApprovedHours] = useState(0);
  const [pendingHours, setPendingHours] = useState(0);
  const [submittedHours, setSubmittedHours] = useState(0);

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
        } catch (error) {
          console.error('Error fetching hours:', error);
        }
      }
    };

    fetchHours();
  }, []);

  return (
    <HeaderOffset>
      <HoursSummary>
        <HoursBox>
          <h2>{approvedHours}</h2>
          <p>Approved</p>
          <button>View more</button>
        </HoursBox>
        <HoursBox>
          <h2>{pendingHours}</h2>
          <p>Pending</p>
          <button>View more</button>
        </HoursBox>
        <HoursBox>
          <h2>{submittedHours}</h2>
          <p>Submitted</p>
          <button>View more</button>
        </HoursBox>
      </HoursSummary>
      <FilterButtons>
        <button>This Month</button>
        <button>This Year</button>
        <button>Cumulative</button>
      </FilterButtons>
      <HoursList>
        {hours.map((hour: Hour) => (
          <HoursItem key={hour.id}>
            <img src={hour.image} alt={hour.eventName} />
            <div>
              <p>{hour.eventName}</p>
              <p>
                {hour.hours} Hours - {hour.location} - {hour.status.charAt(0).toUpperCase() + hour.status.slice(1)} - {new Date(hour.date).toLocaleDateString()} - Reviewed by: {hour.reviewer}
              </p>
            </div>
          </HoursItem>
        ))}
      </HoursList>
    </HeaderOffset>
  );
};

export default MyHours;
