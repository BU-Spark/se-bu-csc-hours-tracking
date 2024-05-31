/* eslint-disable @next/next/no-img-element */
"use client";

import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import CustomHeader from "../components/Header/CustomHeader";
import CustomSider from "../components/Sider/CustomSider";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import "./page.css";
import icon from '../../../public/full_logo.png'
import Image from 'next/image';


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
      <Image src={icon} alt="icon" width={500} height={100} className="loading-image"/>
    </div>
  ) : isLoggedIn ? (
    <Login />
  ) : (
    <>
      <Layout>
        <CustomHeader />
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
