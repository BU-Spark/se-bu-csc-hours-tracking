"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getEvent, updateEvent } from "./action";
import { Event } from "@prisma/client";
import { Button, message, Typography } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { buRed } from "../../../../../_common/styles";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import {
  formatDate,
  formatTime,
} from "../../../../../app/_utils/DateFormatters";
import AdminEventForm from "../new/AdminEventForm";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import AdminEditEventForm from "./AdminEditEventForm";
import { getEventSpotsLeft } from "../../student-signups/action";

dayjs.extend(customParseFormat);

export default function EventDetailPage() {
  const [event, setEvent] = useState<Event | null>(null);
  const [modifying, setModifying] = useState<boolean>(false);
  const [capacity, setCapacity] = useState<number>();
  const params = useParams();
  const event_id = Number(params.events_id);

  useEffect(() => {
    const fetchEvent = async () => {
      if (isNaN(event_id)) {
        console.error("Invalid event ID:", event_id);
        return;
      }

      const response = await getEvent(event_id);
      if (response) {
        const eventFromDTO: Event = {
          ...response,
          image: Buffer.from(response.image, "base64"),
        };
        setEvent(eventFromDTO);
      }
    };
    const fetchCapacity = async () => {
      const response = await getEventSpotsLeft(event_id);
      if (response) {
        setCapacity(response);
      }
    };
    fetchEvent();
    fetchCapacity();
  }, [event_id]);

  const handleUpdateEvent = async (updatedEvent: Partial<Event>) => {
    try {
      const updatedEventDTO = {
        ...updatedEvent,
        image: updatedEvent.image
          ? updatedEvent.image.toString("base64")
          : undefined,
      };
      await updateEvent(event_id, updatedEventDTO as any);
      message.success("Event updated successfully");
      setModifying(false);
      setEvent({ ...event, ...updatedEvent } as Event);
    } catch (error) {
      message.error("Error updating event");
    }
  };

  return event ? (
    <div style={{ width: "100%", position: "relative", marginRight: "4rem" }}>
      <div
        className="image-holder"
        style={{
          width: "100%",
          height: "50vh",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <img
          src={`data:image/jpeg;base64,${event.image.toString("base64")}`}
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
            className="capacity"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TeamOutlined
              style={{ fontSize: "2rem", color: buRed, padding: "0rem 1rem" }}
            />
            {capacity ? (
              <p>
                {capacity} / {event.estimated_participants} spots
              </p>
            ) : (
              <></>
            )}
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
        <div
          className="signup"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            style={{
              borderRadius: "20px",
              marginBottom: "1rem",
              width: "6rem",
              color: buRed,
              borderColor: buRed,
            }}
            onClick={() => setModifying(!modifying)}
          >
            {modifying ? "Close" : "Modify"}
          </Button>
        </div>
        {modifying ? (
          <AdminEditEventForm
            key={Math.random()}
            event={event}
            onUpdate={handleUpdateEvent}
            onCancel={() => setModifying(false)}
          />
        ) : (
          <div className="description">{event.description}</div>
        )}
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
}
