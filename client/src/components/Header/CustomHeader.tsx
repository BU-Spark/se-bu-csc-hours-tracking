"use client";

import "./CustomHeader.css";
import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import Image from "next/image";
import { accentBackground, buRed } from "../../_common/styles";
import Pfp from "../Pfp";
import StyledButton from "../StyledButton";
import { useClerk } from '@clerk/nextjs';
import { useSession } from '@clerk/clerk-react';
import { getPersonFromUser } from "@/lib/getPersonFromUser";

const { Header } = Layout;

const CustomHeader: React.FC = () => {
  const { session, isSignedIn } = useSession();
  const { signOut } = useClerk();
  const [person, setPerson] = useState<any>(null);

  useEffect(() => {
    if (isSignedIn && session) {
      const fetchPerson = async () => {
        const person = await getPersonFromUser(session.user.id);
        setPerson(person);
      };
      fetchPerson();
    }
  }, [isSignedIn, session]);

  return person?.image ? (
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
        {isSignedIn && (
          <>
            <div style={{ marginRight: "1rem" }}>
              <StyledButton
                onClick={() => signOut({ redirectUrl: '/login' })}
                text="Sign out"
                selected={false}
              />
            </div>
            {person.role === "ADMIN" && (
              <b style={{ marginRight: "1rem" }}>Administrator</b>
            )}
            {person.role === "ORGANIZER" && (
              <b style={{ marginRight: "1rem" }}>Organizer</b>
            )}
          </>
        )}
        <Pfp dimension={"2.5rem"} sessionImage={person.image} />
      </div>
    </Header>
  ) : (
    <></>
  );
};

export default CustomHeader;
