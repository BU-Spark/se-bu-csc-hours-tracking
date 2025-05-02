'use client';
import { Card } from 'antd';
import './FeedbackCard.css';

type PendingHourCardProps = {
  classYear: number;
  college: string;
  name: string;
  category: string;
  dateRequested: string;
  profilePic: string;
};

export default function PendingCori({
  name,
  classYear,
  college,
  category,
  dateRequested,
  profilePic,
}: PendingHourCardProps) {
  const year = classYear.toString().slice(-2) + "'";
  const userYear = college.toUpperCase() + " " + year;

  return (
    <Card
      className="pending-cori-card"
      title={
        <div className="pending-cori-header">
          <img
            src={profilePic || "https://i.pravatar.cc/40"}
            alt="Profile"
            className="pending-cori-img"
          />
          <div className="pending-cori-info">
            <span className="pending-cori-name">{name}</span>
            <span className="pending-cori-year">{userYear}</span>
          </div>
        </div>
      }
      styles={{
        body: {
          backgroundColor: '#CC0000',
          color: 'white',
          borderBottomLeftRadius: '1.5625rem',
          borderBottomRightRadius: '1.5625rem',
        },
        header: {
          borderTopLeftRadius: '1.5625rem',
          borderTopRightRadius: '1.5625rem',
          height: '4.6875rem',
          marginLeft: '-0.9375rem',
        },
      }}
    >
      <div className="pending-cori-body-wrapper">
        <ul className="pending-cori-list">
          <li>
            <strong>Category: </strong>
            {category}
          </li>
          <li>
            <strong>Date Requested: </strong>
            {dateRequested}
          </li>
          <a href="#" className="pending-cori-link">
            Full Profile
          </a>
        </ul>
      </div>
    </Card>
  );
}