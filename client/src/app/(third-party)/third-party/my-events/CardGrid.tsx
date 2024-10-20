import React from "react";
import { Row, Col } from "antd";
import EventCard from "./EventCard";
import { CardGridProps } from "@/interfaces/interfaces";
import { Event } from "@prisma/client";
import convertToBase64 from "@/app/_utils/BufferToString";

function CardGrid(props: CardGridProps) {
  const { events, filter, myEvents, pastEvents } = props;

  let filteredEvents: Event[] = [];

  if (myEvents && filter === 1) {
    filteredEvents = myEvents;
  } else if (events) {
    filteredEvents = events;
  }

  if (filter instanceof Date) {
    filteredEvents = filteredEvents.filter((event) => {
      const eventDate = new Date(event.event_start);
      return (
        eventDate.getFullYear() === filter.getFullYear() &&
        eventDate.getMonth() === filter.getMonth()
      );
    });
  }

  if (pastEvents !== true) {
    const currentTime = new Date();
    filteredEvents = filteredEvents.filter((event) => {
      const regEnd = new Date(event.reg_end);
      return regEnd > currentTime;
    });
  }

  filteredEvents.sort(
    (a, b) => new Date(b.reg_end).getTime() - new Date(a.reg_end).getTime()
  );

  if (filteredEvents.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <p>No events</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto", padding: "1rem" }}>
      <Row
        gutter={16}  // Adjust gutter for horizontal and vertical spacing
        style={{
          display: "flex",
          flexWrap: "nowrap",  // No wrapping
          overflowX: "auto",   // Horizontal scrolling
        }}
      >
        {filteredEvents.map((event: Event, index: number) => {
          const base64Image = event.image
            ? `data:image/jpeg;base64,${convertToBase64(event.image)}`
            : "https://picsum.photos/200/300";

          return (
            <Col
              key={index}
              flex="0 0 auto"
              style={{
                minWidth: "200px", // Adjust size to your needs
                margin: "0.5rem 0.5rem", // Reduced horizontal margin
              }}
            >
              <EventCard
                event_id={event.id}
                title={event.title}
                image={base64Image}
                event_start={event.event_start}
                event_end={event.event_end}
              />
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default CardGrid;
