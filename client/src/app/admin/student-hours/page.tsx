"use client";
import { useSession } from "next-auth/react";
import React from "react";

const StudentHours: React.FC = () => {
  const { data: session, status } = useSession();
  return <div>Student Hours</div>;
};

export default StudentHours;
