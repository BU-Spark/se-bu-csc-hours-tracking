"use client";

import React, { useEffect, useState } from "react";
import { useSession } from '@clerk/clerk-react';
import { useRouter } from "next/navigation";
import { checkIfNewUser } from "@/app/(user)/user/settings/action";
import { getPersonFromUser } from "@/lib/getPersonFromUser";

const Dashboard: React.FC = () => {
  const { session, isSignedIn, isLoaded } = useSession();
  const router = useRouter();
  const [person, setPerson] = useState<any>(null);

  useEffect(() => {
    if (isSignedIn && session?.user) {
      const fetchPersonAndCheck = async () => {
        const person = await getPersonFromUser(session.user.id);
        setPerson(person);
        try {
          const response = await checkIfNewUser();
          if (response.isNewUser && person?.role === "USER") {
            router.push("/user/onboarding");
          } else {
            if (person?.role === "USER") {
              router.push("/user/my-hours");
            }
            if (person?.role === "ADMIN") {
              router.push("/admin/student-hours");
            }
            if (person?.role === "ORGANIZER") {
              router.push("/third-party/dashboard");
            }
          }
        } catch (error) {
          console.error("Error checking if new user:", error);
        }
      };
      fetchPersonAndCheck();
    }
  }, [isSignedIn, session, router]);

  if (isLoaded) {
    return <div>Loading...</div>;
  }

  return <div></div>;
};

export default Dashboard;
