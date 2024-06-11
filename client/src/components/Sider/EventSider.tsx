"use client";
import React from "react";
import Sider from "antd/es/layout/Sider";
import { usePathname } from "next/navigation";
import "./CustomSider.css";

function EventSider() {
  const path = usePathname();
  const isDisplayed = path === "/events";
  console.log(path, isDisplayed);
  return isDisplayed ? (
    <Sider
      width="18%"
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
      }}
    >
      <div
        className="sider-content"
        style={{ marginTop: "6rem", fontWeight: "900" }}
      >
        Upcoming Events
      </div>
    </Sider>
  ) : (
    ""
  );
}

export default EventSider;
