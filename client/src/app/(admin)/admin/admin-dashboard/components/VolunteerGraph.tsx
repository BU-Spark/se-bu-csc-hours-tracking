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

//Currently using mock data
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
    <div
      style={{
        maxWidth: '25rem',
        height: '25rem',
        backgroundColor: '#eee',
        padding: '1rem',
        borderRadius: '1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', gap: '1rem' }}>
        {toggleOptions.map((label) => (
          <button
            key={label}
            onClick={() => setSelectedRange(label)}
            style={{
              padding: '0.4rem 1.25rem',
              borderRadius: '999px',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              border: '2px solid #CC0000',
              backgroundColor: selectedRange === label ? '#CC0000' : 'white',
              color: selectedRange === label ? 'white' : '#CC0000',
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#CC0000' }}>178</div>
        <div style={{ fontSize: '1rem', color: '#000' }}>total ppl</div>
      </div>

      <div style={{ height: '9rem', position: 'relative' }}>
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

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '2rem',
            backgroundColor: '#666',
            borderBottomLeftRadius: '1rem',
            borderBottomRightRadius: '1rem',
            zIndex: 0,
          }}
        />
      </div>
    </div>
  );
}
