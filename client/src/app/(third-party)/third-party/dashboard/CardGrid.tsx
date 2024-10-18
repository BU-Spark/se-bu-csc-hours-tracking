"use client";
import React from "react";
import { Row, Col } from "antd";
import EventCard from "./EventCard";
import { CardGridProps } from "@/interfaces/interfaces";
import { Event } from "@prisma/client";
import convertToBase64 from "@/app/_utils/BufferToString";
import { buRed } from "@/_common/styles";
import { AiOutlinePlus } from "react-icons/ai";
import { useRouter } from "next/navigation";
// import { Event } from "@mui/icons-material";

function CardGrid(props: CardGridProps) {
  const { events, filter, myEvents, view, pastEvents } = props;
  const router = useRouter();

  let displayedEvents: Event[] = [];

  // Use 'myEvents' if 'view' is 'myEvents', else use 'events'
  if (view === "myEvents" && myEvents) {
    displayedEvents = myEvents;
  } else if (events) {
    displayedEvents = events;
  }

  // Filter events based on the 'filter' prop
  if (filter instanceof Date) {
    // If 'filter' is a Date, filter events starting from that date
    displayedEvents = displayedEvents.filter((event) => {
      const eventStartDate = new Date(event.event_start);
      const eventEndDate = new Date(event.event_end);
      return eventStartDate >= filter || eventEndDate >= filter;
    });
  } else if (typeof filter === "number") {
    // If 'filter' is a number, limit to that number of events
    displayedEvents = displayedEvents.slice(0, filter);
  }

  // Exclude past events if 'pastEvents' is false
  if (pastEvents === false) {
    const now = new Date();
    displayedEvents = displayedEvents.filter((event) => {
      const eventEnd = new Date(event.event_end);
      return eventEnd >= now;
    });
  }

  // Ensure only the first 5 upcoming events are displayed
  displayedEvents = displayedEvents.slice(0, 5);

  return (
    <Row justify="start" style={{ marginRight: "3rem" }}>
      {displayedEvents.length > 0 ? (
        <>
          {displayedEvents.map((event: Event, index: number) => {
            // Convert image to base64 string
            const base64Image = event.image
              ? `data:image/jpeg;base64,${convertToBase64(event.image)}`
              : "https://picsum.photos/200/300";

            return (
              <Col
                span={5}
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "start",
                }}
              >
                <EventCard
                  key={index}
                  event_id={event.id}
                  title={event.title}
                  image={base64Image}
                  event_start={event.event_start}
                  event_end={event.event_end}
                />
              </Col>
            );
          })}
          {/* Add the create event button */}
          <Col
            span={5}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "start",
            }}
          >
            <div
              onClick={() => router.push("/third-party/my-events/new")}
              style={{
                backgroundColor: buRed,
                height: "10rem",
                width: "12rem",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                borderRadius: "8px",
              }}
            >
              <AiOutlinePlus size={48} color="white" />
            </div>
          </Col>
        </>
      ) : (
        // If no upcoming events, still show the create event button
        <Col
          span={5}
          style={{
            margin: "0rem 2.5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "start",
          }}
        >
          <div
            onClick={() => router.push("/third-party/my-events/new")}
            style={{
              backgroundColor: buRed,
              height: "10rem",
              width: "12rem",
              position: "relative",
              overflow: "hidden",
              marginBottom: "3rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              borderRadius: "8px",
            }}
          >
            <AiOutlinePlus size={48} color="white" />
          </div>
        </Col>
      )}
    </Row>
  );
}

export default CardGrid;