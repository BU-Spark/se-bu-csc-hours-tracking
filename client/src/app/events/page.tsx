import React from "react";
import { Card } from "antd";
import logo from "../../../public/photos/full_logo.png";
import { buRed } from "@/common/styles";

function Events() {
  return (
    <div>
      <Card
        style={{
          backgroundImage: `url(/photos/full_logo.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "15rem",
          width: "15rem",
          position: "relative",
          overflow: "hidden",
        }}
        hoverable
      >
        <div
          style={{
            backgroundColor: buRed,
            opacity: "60%",
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
              title here
            </h3>{" "}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Events;
