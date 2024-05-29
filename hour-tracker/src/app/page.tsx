/* eslint-disable @next/next/no-img-element */
"use client";

import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import CustomHeader from "@/components/Header/CustomHeader";
import CustomSider from "@/components/Sider/CustomSider";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import "./page.css";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { data: session, status } = useSession();

  // console.log('Session:', session);
  // console.log('Status:', status);

  useEffect(() => {
    if (status != "authenticated") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
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
      <img src="./full_logo.png" alt="icon" />
    </div>
  ) : isLoggedIn ? (
    <Login />
  ) : (
    <>
      <Layout>
        <CustomHeader session={session} />
      </Layout>
      <Layout hasSider>
        <CustomSider session={session} />
      </Layout>
      <Content style={{ marginLeft: "35%" }}>
        <Dashboard session={session} />
      </Content>
    </>
  );
}
