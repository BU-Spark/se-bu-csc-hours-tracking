"use client";

import React from "react";
import { HourSubmission, Event, Person } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { accentBackground, buRed } from "@/_common/styles";

interface PendingSubmissionsProps {
  submissions: HourSubmissionWithRelations[];
}

interface HourSubmissionWithRelations extends HourSubmission {
  volunteer: Person;
  event: Event;
}

const PendingSubmissions: React.FC<PendingSubmissionsProps> = ({
  submissions,
}) => {
  return (
    <section style={{width: "fit-content" }}>
      <h2
        style={{
          marginTop: 0,
      }}
      >Pending Submissions</h2>
      <div>
        {submissions.map((submission) => (
          <div
            key={submission.id}
            style={{
              display: "flex",
              alignItems: "center",
              background: accentBackground,
              borderRadius: "15px",
              padding: "1rem",
            }}
          >
            <Image
              src={submission.volunteer.image || "/default-profile.png"}
              alt={submission.volunteer.name}
              width={50}
              height={50}
              style={{ borderRadius: "50%", marginRight: "1rem" }}
            />
            <div>
              <h3 style={{ margin: 0 }}>{submission.volunteer.name}</h3>
              <p style={{ margin: 0 }}>{submission.event.title}</p>
              <Link
                style= {{color: buRed}}
                href={`/hour-submissions/${submission.id}`}>
                See details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PendingSubmissions;