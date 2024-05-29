import React from "react";
import { Layout } from "antd";
import Image from "next/image";
import icon from "../../../public/full_logo.png";
import { PageProps } from "@/common/interfaces";
import "./CustomHeader.css";
import { accentBackground, buRed } from "@/common/styles";
import Pfp from "../Pfp";

const { Header } = Layout;

const CustomHeader: React.FC<PageProps> = ({ session }) => {
  return (
    <Header
      style={{
        height: "4em",
        zIndex: 4,
        background: accentBackground,
        borderBottom: `0.3rem solid ${buRed}`,
        paddingLeft: "0.2rem",
        display: "flex",
        alignItems: "center",
        margin: 0,
      }}
    >
      <Image src={icon} alt="logo" className="header-logo" />
      <div className="header-right">
        <Pfp session={session} height={"2.5rem"} />
      </div>
    </Header>
  );
};

export default CustomHeader;
