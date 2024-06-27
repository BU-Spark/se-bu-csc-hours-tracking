"use client";
import React, { useEffect, useState } from "react";
import Sider from "antd/es/layout/Sider";
import { usePathname } from "next/navigation";
import "./CustomSider.css";
import { useSession } from "next-auth/react";
import { Feedback } from "@/interfaces/interfaces";
import { getFeedback } from "@/app/(admin)/admin/events/[events_id]/action";
import { buRed } from "@/_common/styles";

function AdminEventSider() {
  //session and path vars
  const path = usePathname();
  const { data: session, status } = useSession();
  const isDisplayed = path === "/admin/events";

  //useState variables
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<Feedback[]>([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      try {
        const response = await getFeedback();
        if (!response) {
          console.error("bad response from getFeedback");
          return;
        }
        console.log("feedback", response);
        setFeedback(response);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
        return;
      }
    };
    fetchFeedback();
  }, []);

  const FeedbackBubble = ({ feedback }: { feedback: Feedback }) => {
    return (
      <div>
        <div
          style={{
            backgroundColor: "#f0f0f0",
            padding: "1rem",
            borderRadius: "15px",
            width: "70%",
            minHeight: "4rem",
            maxHeight: "10rem",
            overflow: "hidden", // Ensure content beyond maxHeight is hidden
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
            position: "relative",
          }}
        >
          <p
            style={{
              color: buRed,
              margin: 0,
              fontSize: "0.9rem",
              fontWeight: "800",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {feedback.event.title}
          </p>
          <p
            style={{
              margin: "0.5rem 0 0 0",
              fontSize: "0.7rem",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 7, // Limits the text to 3 lines
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {'"'}
            {feedback.content}
            {'"'}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "start",
            justifyContent: "start",
          }}
        >
          <p
            style={{
              fontSize: "0.5rem",
              marginTop: "0.4rem",
              marginBottom: "1rem",
              marginLeft: "1rem",
            }}
          >
            {feedback.dateWritten.toDateString()} by {feedback.author.name}
          </p>
        </div>
      </div>
    );
  };

  return isDisplayed ? (
    <Sider
      width="20%"
      style={{
        background: "white",
        marginTop: "0em",
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        zIndex: 2,
        right: 0,
        top: 0,
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)",
        paddingLeft: "1rem",
      }}
    >
      <div
        className="sider-content"
        style={{
          marginLeft: 0,
          marginRight: 0,
          marginTop: "5rem",
          fontWeight: "900",
          display: "flex",
          alignItems: "start",
          flexDirection: "column",
        }}
      >
        <p
          style={{
            marginBottom: "2rem",
            fontSize: "large",
          }}
        >
          Feedback
        </p>
        <div style={{ fontWeight: 200, fontSize: "medium" }}>
          {loading ? (
            <p>Loading feedback...</p>
          ) : (
            feedback.map((f: Feedback, index: number) => (
              <FeedbackBubble key={index} feedback={f} />
            ))
          )}
        </div>
      </div>
    </Sider>
  ) : (
    ""
  );
}

export default AdminEventSider;
