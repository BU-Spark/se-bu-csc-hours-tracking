import React from 'react';
import { Card } from 'antd';

export type FeedbackCardProps = {
  title: string;
  date: string;
  description: string;
  authorImg: string;
};

export default function FeedbackCard({ title, date, description, authorImg }: FeedbackCardProps) {
  return (
    <div style={{ marginTop: '1em', maxWidth: '30em' }}>
      <Card
        style={{
          backgroundColor: '#EBEBEB',
          borderRadius: '1rem',
        }}
        styles={{
          body: {
            padding: '0.75rem 1rem 0.75rem 1rem',
          },
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <p style={{ color: '#CC0000', fontSize: '1.1rem', margin: 0, fontWeight: 600 }}>{title}</p>
          <a
            href="#"
            style={{ color: '#CC0000', fontWeight: 'bold', fontSize: '0.85rem', textDecoration: 'underline' }}
          >
            Follow Up →
          </a>
        </div>

        <div>
          <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: '1.3' }}>{description}</p>
        </div>
      </Card>

      <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.4rem', marginLeft: '0.5rem' }}>
        <span style={{ fontSize: '0.82rem', color: '#333' }}>{date} by</span>
        <img
          src={authorImg}
          alt="Author"
          style={{
            width: '1.8rem',
            height: '1.8rem',
            borderRadius: '50%',
            marginLeft: '0.4rem',
          }}
        />
      </div>
    </div>
  );
}
