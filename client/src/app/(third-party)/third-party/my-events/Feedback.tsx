import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { Feedback } from "@/interfaces/interfaces";
import { getFeedback } from "./action";
import { buRed } from "@/_common/styles";
import Link from "next/link";
import { useSession } from '@clerk/clerk-react';
import { getOrganizationByUserId } from "./action";

function ThirdPartyFeedback() {
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const { session } = useSession();
  const [sessionLoaded, setSessionLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!sessionLoaded && session?.user.id) {
      setSessionLoaded(true);
    }
  }, [session]);

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      try {
        const userId = session?.user?.id as string;
        const org = await getOrganizationByUserId(userId);
        const orgId = org?.affiliation?.id || 0;
        const response = await getFeedback(orgId);
        if (!response) {
          console.error("bad response from getFeedback");
          return;
        }
        setFeedback(response);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
        return;
      }
    };
    fetchFeedback();
  }, [sessionLoaded]);

  const FeedbackBubble = ({ feedback }: { feedback: Feedback }) => {
    return (
      <div
        style={{
          backgroundColor: 'white',
          padding: "1rem",
          borderRadius: "15px",
          width: "90%",
          minHeight: "4rem",
          maxHeight: "10rem",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
          marginBottom: "1rem", // Space between bubbles
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
            href={`/third-party/my-events/${feedback.event.id}`}
            style={{ color: buRed }}
          >
            {feedback.event.title}
          </Link>
        </p>
        <p
          style={{
            margin: "0.5rem 0 0 0",
            fontSize: "0.9rem",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 7,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {'"'}
          {feedback.content}
          {'"'}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "start",
            justifyContent: "start",
          }}
        >
          <p
            style={{
              fontSize: "0.7rem",
              marginTop: "0.4rem",
              marginBottom: "1rem",
              marginLeft: "1rem",
            }}
          >
            {feedback.dateWritten.toDateString()} by {feedback.author.name}
          </p>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <Content style={{ padding: '2rem', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
        <h2>Student Feedback</h2>
        <div
          style={{
            maxHeight: '400px', // Set the desired maximum height
            overflowY: 'auto', // Enable vertical scrolling
            width: '100%', // Optional: set the width as needed
            padding: '1rem',
          }}
        >
          {loading ? (
            <p>Loading feedback...</p>
          ) : (
            feedback.map((f: Feedback, index: number) => (
              <FeedbackBubble key={index} feedback={f} />
            ))
          )}
        </div>
      </Content>
    </Layout>
  );
}

export default ThirdPartyFeedback;
