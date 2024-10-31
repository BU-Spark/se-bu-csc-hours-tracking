// src/components/Sider/ThirdPartyEventSider.tsx

"use client";

import React, { useEffect, useState } from "react";
import Sider from "antd/es/layout/Sider";
import { usePathname } from "next/navigation";
import "./CustomSider.css";
import { Event } from "@prisma/client";
import { getEventsByOrganizerId, getOrganizationByUserId } from "@/app/(third-party)/third-party/dashboard/action"; // Adjust the import path as needed
import { buRed } from "@/_common/styles";
import Link from "next/link";
import { useSession } from "next-auth/react";

function ThirdPartyEventSider() {
  // Session and path variables
  const { data: session, status } = useSession();
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

  useEffect(() => {
    if (!isDisplayed || status !== "authenticated") return;

    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get organization ID using user ID
        const organization = await getOrganizationByUserId(Number(session.user.id));
        if (!organization || !organization.affiliation || !organization.affiliation.id) {
          setError("Organization not found.");
          setLoading(false);
          return;
        }

        const organizationId = Number(organization.affiliation.id);
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
  }, [isDisplayed, session, status]);

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
            <Link href={`/third-party/events/${event.id}`} style={{ color: buRed }}>
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

  return isDisplayed && status === "authenticated" ? (
    <Sider
      width="20%"
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
        
      }}
    >
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
            events.map((event: Event) => <EventBubble key={event.id} event={event} />)
          ) : (
            <p>No upcoming events found.</p>
          )}
        </div>
      </div>
    </Sider>
  ) : null;
}

export default ThirdPartyEventSider;