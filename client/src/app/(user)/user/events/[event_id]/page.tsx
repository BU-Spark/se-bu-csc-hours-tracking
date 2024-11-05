/* eslint-disable @next/next/no-img-element */
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { checkIfApplied, checkIfWaitlisted, checkIfAcceptedApplication, cancelSignUp, getEvent } from "./action";
import { Event } from "@prisma/client";
import { Button, Typography } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { buRed } from "@/_common/styles";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import { formatDate, formatTime } from "@/app/_utils/DateFormatters";
import convertToBase64 from "@/app/_utils/BufferToString";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import RegisterForm from "./RegisterForm";
import { useSession } from "next-auth/react";
import { getEventSpotsLeft } from "@/app/(admin)/admin/student-signups/action";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import WaitlistForm from "./WaitlistForm";

dayjs.extend(customParseFormat);

export default function Page() {
  const [event, setEvent] = useState<Event>();
  const [registering, setRegistering] = useState<boolean>(false);
  const [cancelling, setCancelling] = useState<boolean>(false);
  const [hasRegistered, setHasRegistered] = useState<boolean>(false);
  const [hasWaitlisted, setHasWaitlisted] = useState<boolean>(false);
  const [hasAcceptedApplication, setHasAcceptedApplication] = useState<boolean>(false);
  const [capacity, setCapacity] = useState<number>();
  const event_id: number = Number(useParams().event_id);
  const session = useSession();

  //CHECK IF USER HAS ALREADY APPLIED
  useEffect(() => {
    const fetchCheckApplied = async () => {
      if (session?.data?.user) {
        const result: boolean = await checkIfApplied(
          event_id,
          Number(session?.data?.user.id)
        );
        setHasRegistered(result);
      }
    };
    const fetchCheckWaitlisted = async () => {
      if (session?.data?.user) {
        const result: boolean = await checkIfWaitlisted(
          event_id,
          Number(session?.data?.user.id)
        );
        setHasWaitlisted(result);
      }
    };
    const fetchCheckAcceptedApplication = async () => {
      if (session?.data?.user) {
        const result: boolean = await checkIfAcceptedApplication(
          event_id,
          Number(session?.data?.user.id)
        );
        setHasAcceptedApplication(result);
      }
    };
    if (session.status != "loading") {
      fetchCheckApplied(); 
      fetchCheckWaitlisted();
      fetchCheckAcceptedApplication();
    }
  }, [session.status]);

  // GET EVENT DETAILS
  useEffect(() => {
    console.log("hello")
    const fetchEvent = async () => {
      const response = await getEvent(Number(event_id));
      if (response) {
        setEvent(response);
      }
    };

    const fetchCapacity = async () => {
      const response = await getEventSpotsLeft(event_id);
      if (response !== undefined && response !== null) {
        setCapacity(response);
      }else if(response === undefined){
        setCapacity(0);
      }
    };
    fetchEvent();
    fetchCapacity();
  }, [event_id]);

  const handleCancelSignUp = async () => {
    const success = await cancelSignUp(event_id, Number(session?.data?.user.id));
    if (success) {
      console.log("It worked!!")
      setCancelling(false);
      setHasAcceptedApplication(false);
      setHasRegistered(false);
      setHasWaitlisted(false);
    }
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
        {event.application_password ? (
          <div
            className="password"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: "0",
              right: "10px",
              margin: "1rem 1rem",
              color: "white",
              textShadow: "1px 1px 2px black",
              zIndex: "2",
            }}
          >
            <LockOutlinedIcon style={{ fontSize: "2.2rem", color: buRed }} />
          </div>
        ) : (
          <></>
        )}
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
              <p>{0} / {event.estimated_participants} spots</p>
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
          { hasAcceptedApplication ? (
            <Button
              style={{
                borderRadius: "30px",
                marginBottom: "1rem",
                width: "10rem",
                color: buRed,
                borderColor: buRed,
              }}
              onClick={handleCancelSignUp}
            >
              {"Cancel Registration"}
            </Button>
          )  : hasRegistered ? (
            <p style={{ color: buRed }}>Applied!</p>
          ) : hasWaitlisted ? (
            <p style={{ color: buRed }}>Waitlisted!</p>
          ) : event.reg_end < new Date() ? (
            <p style={{ color: buRed }}>Registration Ended</p>
          ) : (
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
              {registering ? "Close" : (capacity == 0 ? "Waitlist":"Apply")}
            </Button>
          )}
        </div>
        { registering && session.data?.user.id ? (capacity !== 0 ? (
          <RegisterForm
            event={event}
            userId={Number(session.data?.user.id)}
            setRegistering={setRegistering}
            setHasRegistered={setHasRegistered}
          />
        ):(
          <WaitlistForm
            event={event}
            userId={Number(session.data?.user.id)}
            setRegistering={setRegistering}
            setHasWaitlisted={setHasWaitlisted}
          />
        )) : (
          <div className="description">{event.description}</div>
        )}
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
}
