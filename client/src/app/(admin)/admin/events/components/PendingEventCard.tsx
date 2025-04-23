import { Card } from "antd";
import React from "react";

interface PendingEventCardProps {
  title: string;
  dateSubmitted: string;
  imageLink: string;
}

export default function PendingEventCard({
  title,
  dateSubmitted,
  imageLink,
}: PendingEventCardProps) {
  return (
    <Card
      style={{
        marginTop: "1.25rem",
        minWidth: "18rem",
        maxWidth: "18rem",
        backgroundColor: "#CC0000",
        color: "white",
        borderRadius: "1.5625rem",
        border: "0.125rem solid #CC0000",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      styles={{
        body: {
          backgroundColor: "white",
          color: "black",
          borderBottomLeftRadius: "1.5625rem",
          borderBottomRightRadius: "1.5625rem",
          padding: "1rem",
          marginTop: "-1.875rem",
        },
      }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <img
            src={imageLink}
            alt={title}
            style={{
              height: "6.5rem",
              width: "3rem",
              borderRadius: "0.375rem",
            }}
          />
          <span style={{ color: "white", fontSize: "1rem", fontWeight: "bold" }}>
            {title}
          </span>
        </div>
      }
    >
      <p style={{ margin: 0 }}>
        <strong>Date Submitted:</strong> {dateSubmitted}
      </p>
      <a
        href="#"
        style={{
          marginTop: "0.5rem",
          textDecoration: "underline",
          color: "#CC0000",
          fontWeight: "bold",
          display: "inline-block",
        }}
      >
        Full Details
      </a>
    </Card>
  );
}