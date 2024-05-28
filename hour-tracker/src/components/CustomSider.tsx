import React from 'react'
import {PageProps} from '@/common/interfaces'
import { Layout, Typography } from "antd";
const { Sider } = Layout;
import { buRed, accentBackground } from "@/common/styles";
import Pfp from "./Pfp";

const CustomSider: React.FC<PageProps> = ({ session }) => {
  return (
    <Sider
      style={{
        background: "FFFFFF",
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
      <div
        style={{
          padding: "0.5em 0.5em",
          margin: "5em 0.5em",
          display: "flex",
          justifyContent: "center",
          height: "90%",
        }}
      >
        <div
          style={{
            marginTop: "3em",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Pfp session={session} dimension={"6em"} />
          <div
            style={{
              marginTop: "1.5em",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography.Text
              strong
              style={{ fontSize: "20px", marginBottom: "-0.8em" }}
            >
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

export default CustomSider