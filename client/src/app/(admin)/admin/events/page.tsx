"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Calendar from "./components/Calendar";
import PendingCard from "./components/PendingEventCard";
import EventCard from "./components/EventCard";
import FeedbackCard from './components/FeedbackCard'; 

export default function EventManagementPage() {
  const router = useRouter();
  const today = new Date();

  const mockFeedback = [
    {
      title: "Lack of support",
      date: "03/25/2024",
      description: "I felt like I was unable to get support from the CSC. My emails were not responded when I had concerns that came up during the volunteer activities.",
      authorImg: "https://i.pravatar.cc/40?img=10",
    },
    {
      title: "Great experience!",
      date: "03/20/2024",
      description: "I have been doing Student Food Rescue throughout this semester, and I love working with our community partner and other volunteers. They have been very kind and they definitely brighten up my day!",
      authorImg: "https://i.pravatar.cc/40?img=20",
    },
    {
      title: "Would like more volunteer engagement",
      date: "03/25/2024",
      description: "Haven’t been seeing many students lately. When they do, they are not very engaged. Could you communicate with the volunteers and see how we could help? Thank you.",
      authorImg: "https://i.pravatar.cc/40?img=25",
    },
  ];

  const mockEvents = [
    { id: "1", event_start: "2024-04-22T15:00:00", title: "3:00 pm SFR" },
    { id: "2", event_start: "2024-04-22T20:00:00", title: "8:00 pm ASB" },
    { id: "3", event_start: "2024-04-25T15:00:00", title: "3:00 pm SFR" },
  ];

  const mockProposals = [
    { title: "Oak Square YMCA", dateSubmitted: "03/24/2024", imageLink: "/logos/oak-square.png" },
    { title: "The Trustees…Boston Office", dateSubmitted: "03/24/2024", imageLink: "/logos/trustees.png" },
    { title: "Boston Veterinary Care", dateSubmitted: "03/24/2024", imageLink: "/logos/veterinary.png" },
  ];

  const ongoingEvents = mockEvents.filter(
    (e) => new Date(e.event_start).toDateString() === today.toDateString()
  );
  const upcomingEvents = mockEvents.filter(
    (e) => new Date(e.event_start) > today
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerPage = 2;
  const step = 1;
  const currentCards = mockProposals.slice(currentIndex, currentIndex + cardsPerPage);

  const handleNext = () => {
    if (currentIndex + cardsPerPage < mockProposals.length) {
      setCurrentIndex(currentIndex + step);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - step);
    }
  };

  return (
    <>
      <h1 style={{ marginBottom: "5rem" }}>Event Management</h1>
      <div style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
        {today.toLocaleString("default", { month: "long" })},{" "}
        {today.toLocaleString("default", { year: "numeric" })}
      </div>

      <div style={{ display: "flex", gap: "2rem", alignItems: "start", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "row", gap: "1rem", flex: 1 }}>
          <EventCard count={ongoingEvents.length} label="Ongoing Events" />
          <EventCard count={upcomingEvents.length} label="Upcoming Events" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flexShrink: 0 }}>
          <div style={{ display: "flex", flexDirection: "row", gap: "1rem", marginTop: "-1.25rem" }}>
            {currentCards.map((proposal, idx) => (
              <PendingCard
                key={idx}
                title={proposal.title}
                dateSubmitted={proposal.dateSubmitted}
                imageLink={proposal.imageLink}
              />
            ))}
          </div>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
            <button onClick={handlePrev} disabled={currentIndex === 0}>
              ← Prev
            </button>
            <button onClick={handleNext} disabled={currentIndex + cardsPerPage >= mockProposals.length}>
              Next →
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <strong style={{ marginLeft: "1rem", marginBottom: "1.5rem" }}>
            Event Calendar
          </strong>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Calendar />
            <div style={{ flex: 1.2, marginLeft :'3rem' }}>
              <strong style={{ marginBottom: '1rem', fontSize: '1.2rem', display: 'block' }}>
                General Student Feedback
              </strong>
              {mockFeedback.map((fb, idx) => (
                <FeedbackCard
                  key={idx}
                  title={fb.title}
                  date={fb.date}
                  description={fb.description}
                  authorImg={fb.authorImg}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}