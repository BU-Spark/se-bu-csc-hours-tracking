"use client";
import { useSession } from "next-auth/react";
import React from "react";

const Dashboard: React.FC = () => {
  const { data: session, status } = useSession();
  return session ? <div>{session?.user.role} </div> : <div></div>;
};

export default Dashboard;
