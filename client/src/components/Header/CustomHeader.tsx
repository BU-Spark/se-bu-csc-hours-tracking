"use client";
import React from "react";
import { Layout } from "antd";
import Image from "next/image";
import "./CustomHeader.css";
import { accentBackground, buRed } from "../../_common/styles";
import Pfp from "../Pfp";
import { signOut, useSession } from "next-auth/react";
import StyledButton from "../StyledButton";

const { Header } = Layout;

const CustomHeader: React.FC = () => {
  const { data: session, status } = useSession();

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
        justifyContent: "space-between",
      }}
    >
      <Image
        src="/photos/full_logo.png"
        alt="logo"
        width={100}
        height={40}
        className="header-logo"
      />

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
        <Pfp dimension={"2.5rem"} session={session} />
      </div>
    </Header>
  );
};

export default CustomHeader;
