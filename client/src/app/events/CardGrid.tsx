import React from "react";
import { Row, Col } from "antd";
import EventCard from "@/components/EventCard/EventCard";
import { CardGridProps, Event } from "@/interfaces/interfaces";



function CardGrid(props: CardGridProps) {
  const { events } = props;

  const convertToBase64 = (arrayBuffer: ArrayBuffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
  };

  return (
    <Row justify="space-between" style={{ marginRight: "3rem" }}>
      {events ? (
        events.map((event: Event, index: number) => {
          // Convert image to base64 string
          const base64Image = event.image
            ? `data:image/jpeg;base64,${convertToBase64(event.image.data)}`
            : "";

          return (
            <Col span={5} key={index} style={{ margin: "1rem 2.5rem" }}>
              <EventCard
                key={index}
                event_id={event.id}
                title={event.title}
                coordinator_id={event.coordinator_id}
                location={event.location}
                image={base64Image}
                event_start={event.event_start}
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
