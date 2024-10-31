import React, { useEffect, useState } from "react";
import { Card } from "antd";
import { buRed } from "@/_common/styles";
import { EventCardProps, EventInput, ThirdPartyEventCardProps } from "@/interfaces/interfaces";
import { Person } from "@prisma/client";
import Link from "next/link";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import { Category } from "@prisma/client";
import LockOutlined from "@mui/icons-material/LockOutlined";
import LockIcon from "@mui/icons-material/Lock";

const EventCard: React.FC<ThirdPartyEventCardProps> = ({
  event_id,
  title,
  image,
  event_start,
  event_end
}) => {
  const eventPath = decodeURIComponent(event_id.toString());

  useEffect(() => {

  }, []);
  return eventPath && title ? (
    <Link
      href={
        `/third-party/my-events/${eventPath}`
      }
    >
      <Card
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "10rem",
          width: "12rem",
          position: "relative",
          overflow: "hidden",
          marginBottom: "3rem",
          filter: event_end < new Date() ? "grayscale(100%)" : "none",
        }}
        hoverable
      >
        <div
          style={{
            backgroundColor: `rgba(204, 0, 0, 0.6)`, //change if buRed changes
            height: "4em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            bottom: "0",
            left: "0",
            width: "100%",
            zIndex: 2,
          }}
        >
          <div
            className="card-text"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              justifyContent: "center",
              padding: "1rem",
            }}
          >
            <h3
              style={{
                color: "white",
                zIndex: 3,
                marginTop: "0",
                marginBottom: "0",
                // marginLeft: "0.1rem",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {title}
              {/* {category.name} */}
            </h3>
            <p
              style={{
                color: "white",
                padding: 0,
                margin: 0,
                fontSize: "0.8rem",
              }}
            >
              {`${formatDate(event_start)} - ${formatDate(event_end)}`}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  ) : (
    <p>...</p>
  );
};

function formatDate(date : Date){
  const nonTimeOptions: Intl.DateTimeFormatOptions = {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", nonTimeOptions);
}


export default EventCard;
