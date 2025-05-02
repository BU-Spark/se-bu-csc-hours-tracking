"use client";

import React, { useEffect, useState } from "react";
import { HeaderOffset } from "@/_common/styledDivs";
import { getHourSubmissionTableData } from "./action";
import { HoursTableData } from "@/interfaces/interfaces";
import "./studenthours.css";

const StudentHours: React.FC = () => {
  const [pendingSubmissions, setPendingSubmissions] = useState<HoursTableData[]>([]);
  const [reviewedSubmissions, setReviewedSubmissions] = useState<HoursTableData[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllSubmissions = async () => {
      const response = await getHourSubmissionTableData();
      if (!response) {
        console.error("invalid response");
        return;
      }
      setPendingSubmissions(response.pendingHourRows);
      setReviewedSubmissions(response.reviewHourRows);
    };
    fetchAllSubmissions();
  }, []);

  const mockPendingData = [
    { id: '1', name: 'Sam Crissman', college: 'CAS', category: 'ASB', dateRequested: '03/24/2024', hours: 10, approvalStatus: 0 },
    { id: '2', name: 'Sarah Smith', college: 'SAR', category: 'SFR', dateRequested: '03/20/2024', hours: 4, approvalStatus: 1, approvedBy: 'Danielle Cavendish' },
    { id: '3', name: 'Alyssa Johnson', college: 'COM', category: 'SFR', dateRequested: '03/20/2024', hours: 5, approvalStatus: 0 },
    { id: '4', name: 'Vivian Zhang', college: 'CAS', category: 'SFR', dateRequested: '03/20/2024', hours: 5.5, approvalStatus: 0 },
    { id: '5', name: 'Joshua Wu', college: 'CAS', category: 'SFR', dateRequested: '03/20/2024', hours: 3, approvalStatus: 0 },
    { id: '6', name: 'Nick Jones', college: 'COM', category: 'SFR', dateRequested: '03/20/2024', hours: 5, approvalStatus: 0 },
  ];

  const toggleExpandRow = (id: string) => {
    setExpandedRow(prev => prev === id ? null : id);
  };

  return (
    <HeaderOffset>
      <h1 className="student-hours-heading">Student Hours</h1>

      <div className="summary-row">
        {[
          { count: 8, label: "Pending" },
          { count: 2, label: "In Progress" },
          { count: 6, label: "Approved" },
          { count: 99, label: "Hours\nApproved" },
        ].map((item, index) => (
          <div className="summary-card" key={index}>
            <div className="summary-card-top">
              <span className="summary-card-number">{item.count}</span>
              <div className="summary-card-label">{item.label}</div>
            </div>
            <div className="summary-card-footer">
              <a href="#">View more</a>
            </div>
          </div>
        ))}
      </div>

      <div className="student-hours-table-wrapper">
        <table className="student-hours-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>College</th>
              <th>Category</th>
              <th>Date Requested</th>
              <th>Hours</th>
              <th className="centered">Approval</th>
            </tr>
          </thead>
          <tbody>
            {mockPendingData.map((submission, index) => (
              <tr
                key={submission.id}
                className={index % 2 === 0 ? "student-hours-row-even" : "student-hours-row-odd"}
              >
                <td>
                  <div className="student-name-cell">
                    {submission.name}
                    <button onClick={() => toggleExpandRow(submission.id)} className="expand-button">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9L12 15L18 9" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </td>
                <td>{submission.college}</td>
                <td>{submission.category}</td>
                <td>{submission.dateRequested}</td>
                <td>{submission.hours}</td>
                <td>
                  {submission.approvalStatus === 1 ? (
                    <div style={{ textAlign: 'center' }}>
                      Approved by <strong>{submission.approvedBy}</strong>
                    </div>
                  ) : (
                    <div className="approval-actions">
                      <button className="approval-button">Approve</button>
                      <button className="approval-button">Deny</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </HeaderOffset>
  );
};

export default StudentHours;
