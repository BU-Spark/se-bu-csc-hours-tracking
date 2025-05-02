'use client';
import { Card } from 'antd';
import './FeedbackCard.css';

type PendingHourCardProps = {
  classYear: number;
  name: string;
  category: string;
  college: string;
  hours: number;
  date: string;
  profilePic: string;
};

export default function PendingCard({
  classYear,
  name,
  college,
  category,
  hours,
  date,
  profilePic,
}: PendingHourCardProps) {
  const year = classYear.toString().slice(-2) + "'";
  const userYear = college.toUpperCase() + " " + year;

  return (
    <Card
      className="pending-card"
      title={
        <div className="pending-card-header">
          <img
            src={profilePic || "https://i.pravatar.cc/40"}
            alt="Profile"
            className="pending-card-img"
          />
          <div className="pending-card-info-wrapper">
            <span className="pending-card-name">{name}</span>
            <span className="pending-card-year">{userYear}</span>
          </div>
        </div>
      }
      styles={{
        body: {
          backgroundColor: "white",
          color: "black",
          borderBottomLeftRadius: "1.5625rem",
          borderBottomRightRadius: "1.5625rem",
        },
        header: {
          borderTopLeftRadius: "1.5625rem",
          borderTopRightRadius: "1.5625rem",
          height: "4.6875rem",
          marginLeft: "-0.9375rem",
        },
      }}
    >
      <div className="pending-card-list-wrapper">
        <ul className="pending-card-list">
          <li>
            <strong>Category: </strong>
            {category}
          </li>
          <li>
            <strong>Hours: </strong>
            {hours}
          </li>
          <li>
            <strong>Date: </strong>
            {date}
          </li>
          <a href="#" className="pending-card-link">
            Full Profile
          </a>
        </ul>
      </div>
    </Card>
  );
}