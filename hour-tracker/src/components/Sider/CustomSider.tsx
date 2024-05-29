import React from "react";
import { PageProps } from "@/common/interfaces";
import { Layout, Menu, MenuProps, Typography } from "antd";
import "./CustomSider.css"; // Import the CSS file
const { Sider } = Layout;
import Pfp from "../Pfp";

const CustomSider: React.FC<PageProps> = ({ session }) => {
  type MenuItem = Required<MenuProps>["items"][number];

  const items: MenuItem[] = [
    {
      key: "dashboard",
      label: "Dashboard",
    },
    {
      key: "my_hours",
      label: "My Hours",
      disabled: true,
    },
    {
      key: "my_events",
      label: "My Events",
      disabled: true,
    },
    {
      key: "service_history",
      label: "Service History",
      disabled: true,
    },
    {
      key: "documents",
      label: "Documents",
    },
    {
      key: "forms",
      label: "Forms",
    },
    {
      key: "settings",
      label: "Settings",
      disabled: true,
    },
  ];

  return (
    //didn't use class because antd was getting buggy
    <Sider
      style={{
        background: "white",
        marginTop: "0em",
        overflow: "auto",
        height: "100vh",
        position: "absolute",
        zIndex: 2,
        left: 0,
        top: 0,
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)",
      }}
    >
      <div className="sider-content">
        <div className="sider-profile">
          <Pfp session={session} dimension={"6em"} />
          <div className="sider-profile-details">
            <Typography.Text strong className="user-name">
              {session?.user.name}
            </Typography.Text>
            <br />
            <Typography.Text>{session?.user.email}</Typography.Text>
          </div>
          <Menu
            style={{ marginTop: "3em", fontSize: "large" }}
            items={items}
            defaultSelectedKeys={["dashboard"]}
            className="custom-menu"
            mode="inline"
          ></Menu>
        </div>
      </div>
    </Sider>
  );
};

export default CustomSider;
