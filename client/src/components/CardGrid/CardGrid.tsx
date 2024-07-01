"use client";
import React, { useEffect, useState } from "react";
import { Row, Col, Spin } from "antd";
import EventCard from "@/components/EventCard/EventCard";
import { CardGridProps, EventImage } from "@/interfaces/interfaces";
import { Event } from "@prisma/client";
import convertToBase64 from "../../app/_utils/BufferToString";
import { buRed } from "@/_common/styles";

function CardGrid(props: CardGridProps) {
  const { events, filter, myEvents, view, pastEvents } = props;

  let filteredEvents: Event[] = [];

  if (myEvents && filter == 1) {
    filteredEvents = myEvents;
  } else {
    if (events) filteredEvents = events;
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
      const eventDate = new Date(event.event_start);

      return regEnd > currentTime;
    });
  }

  filteredEvents.sort(
    (a, b) => new Date(b.reg_end).getTime() - new Date(a.reg_end).getTime()
  );

  if (filteredEvents.length == 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          top: 0,
          bottom: 0,
        }}
      >
        <p>No events</p>
      </div>
    );
  }

  return (
    <Row justify="start" style={{ marginRight: "3rem" }}>
      {filteredEvents ? (
        filteredEvents.map((event: Event, index: number) => {
          // Convert image to base64 string
          const base64Image = event.image
            ? `data:image/jpeg;base64,${convertToBase64(event.image)}`
            : "https://picsum.photos/200/300";

          return (
            <Col
              span={5}
              key={index}
              style={{
                margin: "0rem 2.5rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "start",
              }}
            >
              <EventCard
                key={index}
                event_id={event.id}
                title={event.title}
                coordinator_id={event.coordinator_id}
                location={event.location}
                image={base64Image}
                category_id={event.category_id}
                reg_start={event.reg_start}
                reg_end={event.reg_end}
                hasPassword={
                  event.application_password != undefined &&
                  event.application_password.length > 0
                }
                isAdmin={view == "admin"}
              />
            </Col>
          );
        })
      ) : (
        <div>
          <p>Loading events...</p>
        </div>
      )}
    </Row>
  );
}

export default CardGrid;
