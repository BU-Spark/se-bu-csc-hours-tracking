import React from "react";
import { Card } from "antd";
import { buRed } from "@/common/styles";
import { EventCardProps } from "@/interfaces/interfaces";
import Link from "next/link";

const EventCard: React.FC<EventCardProps> = ({
  event_id,
  title,
  coordinator_id,
  location,
  image,
  event_start,
}) => {
  const eventPath = decodeURIComponent(event_id.toString());
  return (
    <Link href={`events/${eventPath}`}>
      <Card
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "13rem",
          width: "13rem",
          position: "relative",
          overflow: "hidden",
          marginBottom: "3rem",
        }}
        hoverable
      >
        <div
          style={{
            backgroundColor: `rgba(204, 0, 0, 0.6)`, //change if buRed changes
            height: "7.5em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            bottom: "0",
            left: "0",
            width: "15rem",
            zIndex: 2,
          }}
        >
          <div
            className="card-text"
            style={{
              position: "relative",
              top: "0",
            }}
          >
            <h3 style={{ color: "white", zIndex: 3, marginTop: "0" }}>
              {title}
            </h3>{" "}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default EventCard;
