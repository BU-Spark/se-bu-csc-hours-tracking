"use client";

import "./CustomSider.css";
import React, { useState, useEffect } from "react";
import { Layout, Menu, MenuProps, Typography } from "antd";
import { useRouter, usePathname } from "next/navigation";
const { Sider } = Layout;
import Pfp from "../Pfp";
import { useSession } from '@clerk/clerk-react';
import { getPersonFromUser } from "@/lib/getPersonFromUser";

const CustomSider: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { session, isSignedIn } = useSession();
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

  type MenuItem = Required<MenuProps>["items"][number];

  const items: MenuItem[] =
    person?.role === "USER"
      ? [
          {
            key: "my_hours",
            label: "My Hours",
            onClick: () => router.push("/user/my-hours"),
          },
          {
            key: "events",
            label: "Events",
            onClick: () => router.push("/user/events"),
          },
          {
            key: "forms",
            label: "Forms",
            onClick: () => router.push("/user/forms"),
          },
          {
            key: "settings",
            label: "Settings",
            onClick: () => router.push("/user/settings"),
          },
        ]
      : person?.role === "ADMIN"
      ? [
          {
            key: "student_hours",
            label: "Student Hours",
            onClick: () => router.push("/admin/student-hours"),
          },
          {
            key: "student_applications",
            label: "Student Signups",
            onClick: () => router.push("/admin/student-signups"),
          },
          {
            key: "events",
            label: "Events",
            onClick: () => router.push("/admin/events"),
          },
          {
            key: "forms",
            label: "Forms",
            onClick: () => router.push("/admin/forms"),
          },
        ]
      : person?.role === "ORGANIZER"
      ? [
          {
            key: "dashboard",
            label: "Dashboard",
            onClick: () => router.push("/third-party/dashboard"),
          },
          {
            key: "my_events",
            label: "My Events",
            onClick: () => router.push("/third-party/my-events"),
          },
          {
            key: "submissions",
            label: "Submissions",
            onClick: () => router.push("/third-party/submissions"),
          },
          {
            key: "pending_hours",
            label: "Pending Hours",
            onClick: () => router.push("/third-party/pending-hours"),
          },
          {
            key: "settings",
            label: "Settings",
            onClick: () => router.push("/third-party/settings"),
          },
        ]
      : [];

  const getSelectedKey = () => {
    if (pathname.startsWith("/user/my-hours")) {
      return "my_hours";
    }
    if (pathname.startsWith("/user/events")) {
      return "events";
    }
    if (pathname.startsWith("/user/forms")) {
      return "forms";
    }
    if (pathname.startsWith("/user/settings")) {
      return "settings";
    }
    if (pathname.startsWith("/admin/student-hours")) {
      return "student_hours";
    }
    if (pathname.startsWith("/admin/student-signups")) {
      return "student_applications";
    }
    if (pathname.startsWith("/admin/events")) {
      return "events";
    }
    if (pathname.startsWith("/admin/forms")) {
      return "forms";
    }
    if (pathname.startsWith("/third-party/dashboard")) {
      return "dashboard";
    }
    if (pathname.startsWith("/third-party/my-events")) {
      return "my_events";
    }
    if (pathname.startsWith("/third-party/submissions")) {
      return "submissions";
    }
    if (pathname.startsWith("/third-party/pending-hours")) {
      return "pending_hours";
    }
    if (pathname.startsWith("/third-party/settings")) {
      return "settings";
    }
    return "";
  };

  return person?.image ? (
    <Sider
      style={{
        background: "white",
        marginTop: "0em",
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        zIndex: 2,
        left: 0,
        top: 0,
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)",
        minWidth: "30rem !important",
      }}
    >
      <div className="sider-content">
        <div className="sider-profile">
          <Pfp dimension={"6em"} sessionImage={person.image} />
          <div className="sider-profile-details">
            <Typography.Text strong className="user-name">
              {person.name}
            </Typography.Text>
            <br />
            <Typography.Text>{person.email}</Typography.Text>
          </div>
          <Menu
            style={{
              marginTop: "3em",
              fontSize: "large",
              width: "100%",
            }}
            items={items}
            selectedKeys={[getSelectedKey()]}
            className="custom-menu"
            mode="inline"
          />
        </div>
      </div>
    </Sider>
  ) : (
    <></>
  );
};

export default CustomSider;
