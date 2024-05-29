import React from "react";
import { PageProps } from "@/common/interfaces";
import { Layout, Typography } from "antd";
import "./CustomSider.css"; // Import the CSS file
const { Sider } = Layout;
import Pfp from "../Pfp";

const CustomSider: React.FC<PageProps> = ({ session }) => {
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
        </div>
      </div>
    </Sider>
  );
};

export default CustomSider;
