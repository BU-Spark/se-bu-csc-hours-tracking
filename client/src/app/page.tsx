/* eslint-disable @next/next/no-img-element */
"use client";

import "./page.css";
import Dashboard from "./(user)/user/dashboard/page";
import Login from "./login/page";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import icon from "../../public/photos/full_logo.png";
import Image from 'next/image';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { data: session, status } = useSession();

  // console.log('Session:', session);
  // console.log('Status:', status);

  useEffect(() => {
    if (status !== "authenticated") {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, [status]);

  return status === "loading" ? (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center ",
        height: "100vh",
      }}
    >
      <Image src={icon} alt="icon" width={500} height={100} className="loading-image"/>
    </div>
  ) : !isLoggedIn ? (
    <Login />
  ) : (
    <>
      <Layout>
        <CustomHeader session={session} />
      </Layout>
      <Layout hasSider>
        <CustomSider session={session} />
      </Layout>
      <Content style={{ marginLeft: "15rem" }}>
        <Dashboard session={session} />
      </Content>
    </>
  );
}