'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useState } from 'react';
import './FeedbackCard.css';

const data = [
  { name: 'JAN', hours: 120 },
  { name: 'FEB', hours: 150 },
  { name: 'MAR', hours: 200 },
  { name: 'APR', hours: 160 },
];

export default function VolunteerChart() {
  const [selected, setSelected] = useState('Semester');
  const options = ['Month', 'Semester', 'School Year'];

  return (
    <div className="volunteer-chart-container">
      <div>
        <div className="volunteer-chart-buttons">
          {options.map((label) => (
            <button
              key={label}
              onClick={() => setSelected(label)}
              className={`volunteer-chart-button ${
                selected === label ? 'active' : ''
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <div className="volunteer-chart-stats">
          <div className="volunteer-chart-total">302</div>
          <div className="volunteer-chart-label">total hrs</div>
        </div>
        <div className="volunteer-chart-graph">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ bottom: 24 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: 'black', fontSize: '0.75rem' }}
                axisLine={{ stroke: 'transparent' }}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip />
              <Bar
                dataKey="hours"
                fill="#CC0000"
                barSize={30}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>

          <div className="volunteer-chart-bg" />
        </div>
      </div>
    </div>
  );
}