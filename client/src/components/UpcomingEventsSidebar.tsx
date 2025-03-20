"use client";

import React from 'react';
import styled from 'styled-components';
import { Event } from '@prisma/client';

const SidebarContainer = styled.div`
  width: 300px;
  padding: 20px;
  background: white;
  position: fixed;
  right: 0;
  top: 70px;
  height: calc(100vh - 70px);
  border-left: 1px solid #eee;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 1.5rem;
`;

const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EventDate = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const EventItem = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
`;

const EventIndicator = styled.div<{ status: 'Approved' | 'Pending' }>`
  width: 4px;
  height: auto;
  background: #cc0000;
  border-radius: 2px;
`;

const EventDetails = styled.div`
  flex: 1;
`;

const EventTitle = styled.div`
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
`;

const EventStatus = styled.div<{ status: 'Approved' | 'Pending' }>`
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.25rem;
`;

interface Props {
  events: Array<{
    date: string;
    items: Event[]
  }>;
}

const UpcomingEventsSidebar: React.FC<Props> = ({ events }) => {
  return (
    <SidebarContainer>
      <Title>Upcoming Events</Title>
      <EventList>
        {events.map((dateGroup, index) => (
          <div key={index}>
            <EventDate>{dateGroup.date}</EventDate>
            {dateGroup.items.map((event, eventIndex) => (
              <EventItem key={eventIndex}>
                <EventIndicator status={event.approval_status === 1 ? 'Approved' : 'Pending'} />
                <EventDetails>
                  <EventTitle>{event.title}</EventTitle>
                  <EventStatus status={event.approval_status === 1 ? 'Approved' : 'Pending'}>
                    {event.approval_status === 1 ? 'Approved' : 'Pending'}
                  </EventStatus>
                </EventDetails>
              </EventItem>
            ))}
          </div>
        ))}
      </EventList>
    </SidebarContainer>
  );
};

export default UpcomingEventsSidebar; 