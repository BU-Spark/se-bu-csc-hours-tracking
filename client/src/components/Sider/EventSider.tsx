"use client";
import React from "react";
import Sider from "antd/es/layout/Sider";
import { usePathname } from "next/navigation";

function EventSider() {
  const path = usePathname();
  const isDisplayed = path === "/events";
  console.log(path, isDisplayed);
  return isDisplayed ? (
    <Sider
      width={200}
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
      <div style={{ marginTop: "3rem" }}>Sider</div>
    </Sider>
  ) : (
    ""
  );
}

export default EventSider;
