"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getEvent } from "./action";
import { Event } from "@/interfaces/interfaces";
import { Typography } from "antd";
import e from "express";

export default function Page() {
  const [event, setEvent] = useState<Event>();
  const event_id: string = useParams().event_id.toString();
  let regEnd;

  useEffect(() => {
    const fetchEvent = async () => {
      const response = await getEvent(Number(event_id));
      if (response) {
        setEvent(response);
      }
    };
    fetchEvent();
  }, [event_id]);

  if (event) {
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    const formattedDate = event.reg_end.toLocaleDateString("en-US", options);
    console.log(formattedDate);
    regEnd = formattedDate;
  }

  return event ? (
    <div
      style={{
        width: "100%",
        height: "50vh",
        position: "relative",
        border: "1px black solid",
        marginRight: "4rem",
      }}
    >
      <div
        className="image-holder"
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <img
          src={event.image.toString()}
          alt={event.title.toString()}
          style={{
            width: "100%",
            position: "absolute",
            bottom: "0",
            objectFit: "cover",
            height: "100%",
            zIndex: "1",
          }}
        />
        <h1
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            margin: "1rem 1rem",
            color: "white",
            textShadow: "1px 1px 2px black",
            zIndex: "2",
          }}
        >
          {event.title}
        </h1>
      </div>
      <div style={{ padding: "2rem 4rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography.Title style={{ fontSize: "1.5rem" }}>
            At a Glance
          </Typography.Title>
          <Typography.Text style={{ fontSize: "1.2rem" }}>
            Apply by {regEnd}{" "}
          </Typography.Text>
        </div>
        <div style={{ display: "flex", alignContent: "space-between" }}></div>
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
}
