'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useState } from 'react';
import './FeedbackCard.css';

const data = [
  { name: 'JAN', people: 0 },
  { name: 'FEB', people: 50 },
  { name: 'MAR', people: 50 },
  { name: 'APR', people: 78 },
];

export default function StudentVolunteersChart() {
  const [selectedRange, setSelectedRange] = useState('Semester');
  const toggleOptions = ['Month', 'Semester', 'Year'];

  return (
    <div className="student-chart-container">
      <div className="student-chart-buttons">
        {toggleOptions.map((label) => (
          <button
            key={label}
            onClick={() => setSelectedRange(label)}
            className={`student-chart-button ${
              selectedRange === label ? 'active' : ''
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div>
        <div className="student-chart-total">178</div>
        <div className="student-chart-label">total ppl</div>
      </div>

      <div className="student-chart-graph">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ bottom: 24 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: 'white', fontSize: '0.75rem' }}
              axisLine={{ stroke: 'transparent' }}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="people"
              stroke="#CC0000"
              strokeWidth={3}
              dot={{
                stroke: '#CC0000',
                strokeWidth: 3,
                fill: 'white',
                r: 6,
              }}
              activeDot={{
                r: 8,
                fill: '#CC0000',
                stroke: '#CC0000',
              }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="student-chart-bg" />
      </div>
    </div>
  );
}