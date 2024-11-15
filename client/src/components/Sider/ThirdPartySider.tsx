"use client";

import React, { useEffect, useState } from "react";
import Sider from "antd/es/layout/Sider";
import { usePathname } from "next/navigation";
import "./CustomSider.css";
import { Event } from "@prisma/client";
import {
  getEventsByOrganizerId,
  getOrganizationByUserId,
} from "@/app/(third-party)/third-party/dashboard/action"; // Adjust the import path as needed
import { buRed } from "@/_common/styles";
import Link from "next/link";
import { useSession } from "@clerk/clerk-react";
import { Button } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

function ThirdPartyEventSider() {
  // Session and path variables
  const { session, isSignedIn, isLoaded } = useSession();
  const path = usePathname();

  // Define paths where the sider should be displayed for organizers
  const isDisplayed =
    path.startsWith("/third-party/dashboard") ||
    path.startsWith("/third-party/my-events") ||
    path.startsWith("/third-party/submissions") ||
    path.startsWith("/third-party/pending-hours") ||
    path.startsWith("/third-party/settings");

  // State variables
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // Hover state
  const siderWidth = 240; // Adjust as needed

  useEffect(() => {
    if (!isDisplayed || !isSignedIn || !isLoaded) return;

    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get organization ID using user ID
        const user = session?.user;
        const organization = await getOrganizationByUserId(user?.id);
        console.log(organization);
        if (!organization) {
          setError("Organization not found.");
          setLoading(false);
          return;
        }

        const organizationId = Number(organization.id);
        // Fetch events by organizer ID
        const fetchedEvents = await getEventsByOrganizerId(organizationId);
        setEvents(fetchedEvents);
      } catch (err: any) {
        console.error("Error fetching events:", err);
        setError("Failed to load upcoming events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [isDisplayed, session, isSignedIn, isLoaded]);

  const EventBubble: React.FC<{ event: Event }> = ({ event }) => {
    return (
      <div style={{ marginBottom: "1rem" }}>
        <div
          style={{
            backgroundColor: "#f0f0f0",
            padding: "1rem",
            borderRadius: "15px",
            width: "12rem",
            minHeight: "4rem",
            maxHeight: "10rem",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
          }}
        >
          <p
            style={{
              color: buRed,
              margin: 0,
              fontSize: "0.9rem",
              fontWeight: "800",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            <Link
              href={`/third-party/events/${event.id}`}
              style={{ color: buRed }}
            >
              {event.title}
            </Link>
          </p>
          <p
            style={{
              margin: "0.5rem 0 0 0",
              fontSize: "0.7rem",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3, // Adjust number of lines as needed
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {new Date(event.event_start).toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  };

  return isDisplayed && isSignedIn ? (
    <>
      {/* Sider */}
      <Sider
        width={siderWidth}
        style={{
          background: "white",
          marginTop: "0em",
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          zIndex: 2,
          right: 0,
          top: 0,
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)",
          paddingLeft: "1rem",
          transition: "transform 0.3s ease-in-out",
          transform: collapsed ? "translateX(100%)" : "translateX(0)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Remove the collapse button inside the Sider */}
        {/* Sider content */}
        <div
          className="sider-content"
          style={{
            marginLeft: 0,
            marginRight: 0,
            marginTop: "5rem",
            fontWeight: "900",
            display: "flex",
            alignItems: "start",
            flexDirection: "column",
          }}
        >
          <p
            style={{
              marginBottom: "2rem",
              fontSize: "large",
            }}
          >
            Your Recent and Upcoming Events
          </p>
          <div style={{ fontWeight: 200, fontSize: "medium" }}>
            {loading ? (
              <p>Loading upcoming events...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : events.length > 0 ? (
              events.map((event: Event) => (
                <EventBubble key={event.id} event={event} />
              ))
            ) : (
              <p>No upcoming events found.</p>
            )}
          </div>
        </div>
      </Sider>
      {/* Collapse button when Sider is open and hovered over */}
      {!collapsed && isHovered && (
        <div
          style={{
            position: "fixed",
            right: siderWidth,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 3,
            background: "white",
            padding: "0.5rem",
            borderRadius: "4px 0 0 4px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)",
            cursor: "pointer",
          }}
          onClick={() => setCollapsed(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <MenuUnfoldOutlined />
        </div>
      )}
      {/* Expand button when Sider is collapsed */}
      {collapsed && (
        <div
          style={{
            position: "fixed",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 3,
            background: "white",
            padding: "0.5rem",
            borderRadius: "4px 0 0 4px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)",
            cursor: "pointer",
          }}
          onClick={() => setCollapsed(false)}
        >
          <MenuFoldOutlined />
        </div>
      )}
    </>
  ) : null;
}

export default ThirdPartyEventSider;
