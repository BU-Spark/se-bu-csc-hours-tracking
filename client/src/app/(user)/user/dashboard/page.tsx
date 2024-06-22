"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { checkIfNewUser } from "@/app/(user)/user/settings/action";

const Dashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkFirstTimeLogin = async () => {
      try {
        const response = await checkIfNewUser();
        if (response.isNewUser) {
          router.push("/settings");
        }
      } catch (error) {
        console.error("Error checking if new user:", error);
      }
    };

    if (status === "authenticated" && session?.user) {
      checkFirstTimeLogin();
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return <div>Dashboard Content</div>;
};

export default Dashboard;
