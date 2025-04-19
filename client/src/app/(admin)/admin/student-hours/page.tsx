"use client";
import React, { useEffect, useState } from "react";
import {
  HeaderOffset,
  SummaryContainer,
  SummaryBox,
} from "@/_common/styledDivs";
import { getHourSubmissionTableData } from "./action";
import { HoursTableData } from "@/interfaces/interfaces";

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
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  return (
    <HeaderOffset>
      <h1 style={{ fontSize: 'clamp(1.2rem, 2vw, 2rem)', marginBottom: '2rem' }}>
        Student Hours
      </h1>

      <div style={{
        display: "flex",
        gap: "2rem",
        marginBottom: "2rem"
      }}>
        {/* Pending card */}
        <div style={{
          border: "2px solid #CC0000",
          borderRadius: "12px",
          padding: "1.5rem",
          width: "15%",
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "1rem"
          }}>
            <span style={{
              color: "#CC0000",
              fontSize: "4rem",
              fontWeight: "bold",
              lineHeight: "1",
            }}>
              8
            </span>
            <div style={{ 
              fontSize: "1.5rem", 
              fontWeight: "bold", 
              textAlign: "right",
              paddingTop: "0.5rem"
            }}>
              Pending
            </div>
          </div>
          <div style={{ 
            textAlign: "center", 
            borderTop: "1px solid #eaeaea",
            paddingTop: "0.5rem"
          }}>
            <a href="#" style={{
              color: "#000",
              textDecoration: "underline",
              fontSize: "0.9rem"
            }}>
              View more
            </a>
          </div>
        </div>

        {/* In Progress*/}
        <div style={{
          border: "2px solid #CC0000",
          borderRadius: "12px",
          padding: "1.5rem",
          width: "15%",
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "1rem"
          }}>
            <span style={{
              color: "#CC0000",
              fontSize: "4rem",
              fontWeight: "bold",
              lineHeight: "1",
            }}>
              2
            </span>
            <div style={{ 
              fontSize: "1.5rem", 
              fontWeight: "bold", 
              textAlign: "right",
              paddingTop: "0.5rem"
            }}>
              In Progress
            </div>
          </div>
          <div style={{ 
            textAlign: "center", 
            borderTop: "1px solid #eaeaea",
            paddingTop: "0.5rem"
          }}>
            <a href="#" style={{
              color: "#000",
              textDecoration: "underline",
              fontSize: "0.9rem"
            }}>
              View more
            </a>
          </div>
        </div>

        {/* Approved card */}
        <div style={{
          border: "2px solid #CC0000",
          borderRadius: "12px",
          padding: "1.5rem",
          width: "15%",
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "1rem"
          }}>
            <span style={{
              color: "#CC0000",
              fontSize: "4rem",
              fontWeight: "bold",
              lineHeight: "1",
            }}>
              6
            </span>
            <div style={{ 
              fontSize: "1.5rem", 
              fontWeight: "bold", 
              textAlign: "right",
              paddingTop: "0.5rem"
            }}>
              Approved
            </div>
          </div>
          <div style={{ 
            textAlign: "center", 
            borderTop: "1px solid #eaeaea",
            paddingTop: "0.5rem"
          }}>
            <a href="#" style={{
              color: "#000",
              textDecoration: "underline",
              fontSize: "0.9rem"
            }}>
              View more
            </a>
          </div>
        </div>

        {/* Hours Approved card */}
        <div style={{
          border: "2px solid #CC0000",
          borderRadius: "12px",
          padding: "1.5rem",
          width: "15%",
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "1rem"
          }}>
            <span style={{
              color: "#CC0000",
              fontSize: "4rem",
              fontWeight: "bold",
              lineHeight: "1",
            }}>
              99
            </span>
            <div style={{ 
              fontSize: "1.5rem", 
              fontWeight: "bold", 
              textAlign: "right",
              paddingTop: "0.5rem"
            }}>
              Hours<br/>Approved
            </div>
          </div>
          <div style={{ 
            textAlign: "center", 
            borderTop: "1px solid #eaeaea",
            paddingTop: "0.5rem"
          }}>
            <a href="#" style={{
              color: "#000",
              textDecoration: "underline",
              fontSize: "0.9rem"
            }}>
              View more
            </a>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
        }}>
          <thead>
            <tr>
              <th style={{ 
                backgroundColor: '#CC0000', 
                color: 'white', 
                padding: '0.75rem 1rem',
                textAlign: 'left',
              }}>
                Student Name
              </th>
              <th style={{ 
                backgroundColor: '#CC0000', 
                color: 'white', 
                padding: '0.75rem 1rem',
                textAlign: 'left',
                width: '100px'
              }}>
                College
              </th>
              <th style={{ 
                backgroundColor: '#CC0000', 
                color: 'white', 
                padding: '0.75rem 1rem',
                textAlign: 'left',
                width: '120px'
              }}>
                Category
              </th>
              <th style={{ 
                backgroundColor: '#CC0000', 
                color: 'white', 
                padding: '0.75rem 1rem',
                textAlign: 'left',
                width: '150px'
              }}>
                Date Requested
              </th>
              <th style={{ 
                backgroundColor: '#CC0000', 
                color: 'white', 
                padding: '0.75rem 1rem',
                textAlign: 'left',
                width: '100px'
              }}>
                Hours
              </th>
              <th style={{ 
                backgroundColor: '#CC0000', 
                color: 'white', 
                padding: '0.75rem 1rem',
                textAlign: 'center',
                width: '250px'
              }}>
                Approval
              </th>
            </tr>
          </thead>
          <tbody>
            {mockPendingData.map((submission, index) => (
              <tr key={submission.id} style={{ 
                backgroundColor: index % 2 === 0 ? '#f2f2f2' : '#e9e9e9',
              }}>
                <td style={{ 
                  padding: '0.75rem 1rem', 
                  position: 'relative' 
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {submission.name}
                    <button 
                      onClick={() => toggleExpandRow(submission.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0',
                        transform: expandedRow === submission.id ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.3s'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9L12 15L18 9" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>{submission.college}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{submission.category}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{submission.dateRequested}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{submission.hours}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  {submission.approvalStatus === 1 ? (
                    <div style={{ textAlign: 'center' }}>
                      Approved by <strong>{submission.approvedBy}</strong>
                    </div>
                  ) : (
                    <div style={{
                      display: 'flex', 
                      justifyContent: 'space-around',
                      gap: '0.5rem'
                    }}>
                      <button style={{
                        backgroundColor: 'white',
                        border: '1px solid #d8d8d8',
                        borderRadius: '20px',
                        padding: '0.5rem 1.5rem',
                        cursor: 'pointer',
                        fontWeight: 'normal'
                      }}>
                        Approve
                      </button>
                      <button style={{
                        backgroundColor: 'white',
                        border: '1px solid #d8d8d8',
                        borderRadius: '20px',
                        padding: '0.5rem 1.5rem',
                        cursor: 'pointer',
                        fontWeight: 'normal'
                      }}>
                        Deny
                      </button>
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