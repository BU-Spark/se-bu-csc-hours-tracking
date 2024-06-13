/* eslint-disable @next/next/no-img-element */
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getEvent } from "./action";
import { Event } from "@/interfaces/interfaces";
import { Button, Checkbox, DatePicker, Form, Input, Typography } from "antd";
import e from "express";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { buRed } from "@/common/styles";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import { formatDate, formatTime } from "@/app/utils/DateFormatters";
import convertToBase64 from "@/app/utils/BufferToString";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Title from "antd/es/skeleton/Title";
import StyledButton from "@/components/StyledButton";

dayjs.extend(customParseFormat);

export default function Page() {
  const [event, setEvent] = useState<Event>();
  const [registering, setRegistering] = useState<boolean>(false);
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

  const RegisterForm = () => {
    return (
      <div
        className="event-register"
        style={{
          width: "30rem",
          display: "flex",
          position: "relative",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F1F1F1",

          borderRadius: "4px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)",
          margin: "0rem auto",
        }}
      >
        <Form
          layout="horizontal"
          style={{ padding: "2rem", paddingBottom: "0rem" }}
        >
          <Form.Item
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography.Title level={3}>
              Registration Confirmation
            </Typography.Title>
          </Form.Item>
          <Form.Item label="Confirm the Date">
            <DatePicker
              format="YYYY-MM-DD hh:mm A"
              showTime={{ format: "hh:mm A" }}
              width="10rem"
            />
          </Form.Item>
          <Form.Item>
            <Checkbox>
              I agree to attend this event if application accepted
            </Checkbox>
            <Form.Item
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              <Button
                style={{
                  borderRadius: "20px",
                  marginBottom: "0rem",
                  width: "6rem",
                  color: buRed,
                  borderColor: buRed,
                }}
              >
                Apply
              </Button>
            </Form.Item>
          </Form.Item>
        </Form>
      </div>
    );
  };

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
            onClick={() => setRegistering(!registering)}
          >
            {registering ? "Close" : "Register"}
          </Button>
        </div>
        {registering ? (
          <RegisterForm />
        ) : (
          <div className="description">{event.description}</div>
        )}
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
}
