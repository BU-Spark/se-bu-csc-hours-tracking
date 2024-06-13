/* eslint-disable @next/next/no-img-element */
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getEvent } from "./action";
import { Event } from "@/interfaces/interfaces";
import { Button, Typography } from "antd";
import e from "express";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { buRed } from "@/common/styles";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import { formatDate, formatTime } from "@/app/utils/DateFormatters";
import convertToBase64 from "@/app/utils/BufferToString";

export default function Page() {
  const [event, setEvent] = useState<Event>();
  const event_id: string = useParams().event_id.toString();

  useEffect(() => {
    const fetchEvent = async () => {
      const response = await getEvent(Number(event_id));
      if (response) {
        setEvent(response);
      }
    };
    fetchEvent();
  }, [event_id]);

  return event ? (
    <div
      style={{
        width: "100%",
        height: "50vh",
        position: "relative",
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
          src={`data:image/jpeg;base64,${convertToBase64(event.image)}`}
          alt={event.title.toString()}
          style={{
            width: "100%",
            position: "absolute",
            bottom: "0",
            objectFit: "cover",
            height: "100%",
            zIndex: "1",
            borderTopRightRadius: "1rem",
            borderTopLeftRadius: "1rem",
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
        <Button
          danger
          style={{
            borderRadius: "20px",
            marginBottom: "1rem",
            width: "6rem",
          }}
        >
          Sign Up
        </Button>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography.Title style={{ fontSize: "1.5rem", marginLeft: "1rem" }}>
            At a Glance
          </Typography.Title>
          <Typography.Text style={{ fontSize: "1.2rem" }}>
            Apply by {formatDate(event.reg_end, true)}{" "}
          </Typography.Text>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "2rem 0rem",
          }}
        >
          <div
            className="start-time"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CalendarOutlined
              style={{ fontSize: "2rem", color: buRed, padding: "0rem 1rem" }}
            />{" "}
            {formatDate(event.event_start, false)}
          </div>
          <div
            className="time-window"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ClockCircleOutlined
              style={{ fontSize: "2rem", color: buRed, padding: "0rem 1rem" }}
            />{" "}
            {formatTime(event.event_start)} - {formatTime(event.event_end)}
          </div>
          <div
            className="location"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FmdGoodOutlinedIcon style={{ fontSize: "2.2rem", color: buRed }} />{" "}
            {event.location}
          </div>
        </div>
        <div className="description">{event.description}</div>
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
}
