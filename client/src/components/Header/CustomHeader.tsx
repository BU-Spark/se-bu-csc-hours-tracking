"use client";

import "./CustomHeader.css";
import React from "react";
import { Layout } from "antd";
import Image from "next/image";
import { accentBackground, buRed } from "../../_common/styles";
import Pfp from "../Pfp";
import { signOut, useSession } from "next-auth/react";
import StyledButton from "../StyledButton";

const { Header } = Layout;

const CustomHeader: React.FC = () => {
  const { data: session, status } = useSession();

  return session?.user?.image ? (
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
        justifyContent: "space-between",
      }}
    >
      <span className="header-logo">
        {/* <Image src="/photos/icon.png" alt="logo" width={60} height={50} /> */}
        Community Service Center
      </span>

      <div className="header-right">
        {status === "authenticated" && (
          <>
            <div style={{ marginRight: "1rem" }}>
              <StyledButton
                onClick={() => signOut({ callbackUrl: "/login" })}
                text="Sign out"
                selected={false}
              />
            </div>
            {session?.user.role === "ADMIN" && (
              <b style={{ marginRight: "1rem" }}>Administrator</b>
            )}
          </>
        )}
        <Pfp dimension={"2.5rem"} sessionImage={session.user.image} />
      </div>
    </Header>
  ) : (
    <></>
  );
};

export default CustomHeader;
