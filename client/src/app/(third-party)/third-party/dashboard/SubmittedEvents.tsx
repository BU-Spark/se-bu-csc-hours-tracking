"use client";

import React from "react";
import { Tag } from "antd";

interface SubmittedEvent {
  id: number;
  title: string;
  event_start: Date;
  approval_status: string;
}

interface SubmittedEventsProps {
  events: SubmittedEvent[];
}

const SubmittedEvents: React.FC<SubmittedEventsProps> = ({ events }) => {
  return (
    <section style={{ padding: "2rem" }}>
      <h2>Events Submitted to BU CSC</h2>
      <div>
        {events.map((event) => (
          <div
            key={event.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <div>
              <p style={{ margin: 0 }}>
                {new Date(event.event_start).toLocaleDateString()}
              </p>
              <h3 style={{ margin: 0 }}>{event.title}</h3>
            </div>
            <Tag
              color={
                event.approval_status === "Approved" ? "green" : "orange"
              }
            >
              {event.approval_status}
            </Tag>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SubmittedEvents;
