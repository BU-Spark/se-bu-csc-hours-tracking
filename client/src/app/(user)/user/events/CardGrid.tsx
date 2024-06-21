import React, { useEffect } from "react";
import { Row, Col } from "antd";
import EventCard from "@/components/EventCard/EventCard";
import { CardGridProps, Event, EventImage } from "@/interfaces/interfaces";
import convertToBase64 from "../../../utils/BufferToString";

function CardGrid(props: CardGridProps) {
  const { events, filter, myEvents } = props;

  let filteredEvents = events;

  if (myEvents && filter == 1) {
    filteredEvents = myEvents;
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
                event_start={event.event_start}
                category_id={event.category_id}
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
