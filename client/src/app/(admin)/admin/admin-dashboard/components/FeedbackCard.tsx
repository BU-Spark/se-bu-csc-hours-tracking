import React from 'react';
import { Card } from 'antd';
import './FeedbackCard.css';

type FeedbackProps = {
  title: string;
  date: string;
  description: string;
  imageLink: string;
  authorImg: string;
};

export default function FeedbackCard({ title, date, description, imageLink, authorImg }: FeedbackProps) {
  return (
    <div className="feedback-wrapper">
      <Card
        className="feedback-card"
        styles={{
          body: {
            padding: '0.75rem 1rem',
          },
        }}
      >
        <div className="feedback-header">
          <p className="feedback-title">{title}</p>
          <a href="#" className="feedback-link">
            Follow Up →
          </a>
        </div>

        <div className="feedback-body">
          <p className="feedback-description">{description}</p>
          <img src={imageLink} alt="Event" className="feedback-image" />
        </div>
      </Card>

      <div className="feedback-footer">
        <span className="feedback-date">{date} by</span>
        <img src={authorImg} alt="Author" className="feedback-author-img" />
      </div>
    </div>
  );
}