import React from "react";
import { Row, Col } from "antd";
import EventCard from "@/components/EventCard/EventCard";
import { Event } from "@/interfaces/interfaces";

function CardGrid({ events }: Event[]) {
  return (
    <Row justify="start" style={{ marginRight: "3rem" }}>
      {events ? (
        events.map((e, index) => (
          <Col span={4} key={index} style={{ margin: "1rem 3.5rem" }}>
            <EventCard
              key={index}
              event_id={e.id}
              title={e.title}
              coordinator_id={e.coordinator_id}
              location={e.location}
              image={e.image}
              event_start={e.event_start}
            />
          </Col>
        ))
      ) : (
        <div>
          <p>Loading events...</p>
        </div>
      )}
    </Row>
  );
}

export default CardGrid;
