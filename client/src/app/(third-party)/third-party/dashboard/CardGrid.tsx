// dashboard/CardGrid.tsx
"use client";
import React from "react";
import EventCard from "./EventCard";
import { CardGridProps } from "@/interfaces/interfaces";
import { Event } from "@prisma/client";
import convertToBase64 from "@/app/_utils/BufferToString";
import { accentBackground } from "@/_common/styles";
import { AiOutlinePlus } from "react-icons/ai";
import { useRouter } from "next/navigation";

function CardGrid(props: CardGridProps) {
  const { events, filter, myEvents, view, pastEvents } = props;
  const router = useRouter();

  let displayedEvents: Event[] = [];

  // Use 'myEvents' if 'view' is 'myEvents', else use 'events'
  if (view === "myEvents" && myEvents) {
    displayedEvents = myEvents;
  } else if (events) {
    displayedEvents = events;
  }

  // Filter events based on the 'filter' prop
  if (filter instanceof Date) {
    // If 'filter' is a Date, filter events starting from that date
    displayedEvents = displayedEvents.filter((event) => {
      const eventStartDate = new Date(event.event_start);
      const eventEndDate = new Date(event.event_end);
      return eventStartDate >= filter || eventEndDate >= filter;
    });
  } else if (typeof filter === "number") {
    // If 'filter' is a number, limit to that number of events
    displayedEvents = displayedEvents.slice(0, filter);
  }

  // Exclude past events if 'pastEvents' is false
  if (pastEvents === false) {
    const now = new Date();
    displayedEvents = displayedEvents.filter((event) => {
      const eventEnd = new Date(event.event_end);
      return eventEnd >= now;
    });
  }

  // Ensure only the first 5 upcoming events are displayed
  displayedEvents = displayedEvents.slice(0, 5);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "nowrap", // Prevent wrapping
        overflowX: "auto", // Enable horizontal scrolling
        zIndex: 1,
        maxWidth: "80%",
        gap: "1rem",
      }}
    >
      {displayedEvents.length > 0 ? (
        <>
          {displayedEvents.map((event: Event, index: number) => {
            // Convert image to base64 string
            const base64Image = event.image
              ? `data:image/jpeg;base64,${convertToBase64(event.image)}`
              : "https://picsum.photos/200/300";

            return (
              <div
                key={index}
                style={{
                  flex: "0 0 auto",
                  width: "12rem",
                }}
              >
                <EventCard
                  event_id={event.id}
                  title={event.title}
                  image={base64Image}
                  event_start={event.event_start}
                  event_end={event.event_end}
                />
              </div>
            );
          })}
          {/* Add the create event button */}
          <div
            onClick={() => router.push("/third-party/my-events/new")}
            style={{
              backgroundColor: accentBackground, // Use accentBackground for default gray
              height: "10rem",
              width: "12rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              borderRadius: "8px",
            }}
          >
            <AiOutlinePlus size={48} color="white"/> {/* Changed icon color to black for contrast */}
          </div>
        </>
      ) : (
        // If no upcoming events, still show the create event button
        <div
        onClick={() => router.push("/third-party/my-events/new")}
        style={{
          backgroundColor: accentBackground, // Use accentBackground for default gray
          height: "10rem",
          width: "300px",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          borderRadius: "8px",
        }}
      >
        <AiOutlinePlus size={48} color="white"/> {/* Changed icon color to black for contrast */}
      </div>
      )}
    </div>
  );
}

export default CardGrid;