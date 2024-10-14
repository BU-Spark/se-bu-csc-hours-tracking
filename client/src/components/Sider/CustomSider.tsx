"use client";

import "./CustomSider.css";
import React from "react";
import { Layout, Menu, MenuProps, Typography } from "antd";
import { useRouter, usePathname } from "next/navigation";
const { Sider } = Layout;
import Pfp from "../Pfp";
import { useSession } from "next-auth/react";

const CustomSider: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  type MenuItem = Required<MenuProps>["items"][number];

  const items: MenuItem[] =
  session?.user.role === "USER"
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
    : session?.user.role === "ADMIN"
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
    : session?.user.role === "ORGANIZER"
    ? [
        {
          key: "my-events",
          label: "My Events",
          onClick: () => router.push("/third-party/my-events"),
        },
        {
          key: "submissions",
          label: "Submissions",
          onClick: () => router.push("/third-party/submissions"),
        },
        {
          key: "pending-hours",
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

  return session?.user?.image ? (
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
          <Pfp dimension={"6em"} sessionImage={session.user.image} />
          <div className="sider-profile-details">
            <Typography.Text strong className="user-name">
              {session?.user.name}
            </Typography.Text>
            <br />
            <Typography.Text>{session?.user.email}</Typography.Text>
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
