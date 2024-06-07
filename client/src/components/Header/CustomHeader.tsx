"use client";
import React from "react";
import { Layout } from "antd";
import Image from "next/image";
import "./CustomHeader.css";
import { accentBackground, buRed } from "../../common/styles";
import Pfp from "../Pfp";

const { Header } = Layout;

const CustomHeader: React.FC = () => {
  return (
    <Header
      className="fixedHeader"
      style={{
        height: "4em",
        zIndex: 1001,
        background: accentBackground,
        borderBottom: `0.3rem solid ${buRed}`,
        paddingLeft: "0.2rem",
        display: "flex",
        alignItems: "center",
        margin: 0,
      }}
    >
      <Image src="/photos/full_logo.png" alt="logo" width={100} height={40} className="header-logo" />
      <div className="header-right">
        <Pfp height={"2.5rem"} />
      </div>
    </Header>
  );
};

export default CustomHeader;

