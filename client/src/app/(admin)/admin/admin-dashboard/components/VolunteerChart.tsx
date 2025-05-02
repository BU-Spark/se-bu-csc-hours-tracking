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

//Currently using mock data
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
    <div
      style={{
        backgroundColor: '#eee',
        borderRadius: '1rem',
        padding: '1rem',
        maxWidth: '25rem',
        height: '25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
          {options.map((label) => (
            <button
              key={label}
              onClick={() => setSelected(label)}
              style={{
                padding: '0.4rem 1.25rem',
                border: '2px solid #CC0000',
                borderRadius: '999px',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                backgroundColor: selected === label ? '#CC0000' : 'white',
                color: selected === label ? 'white' : '#CC0000',
                cursor: 'pointer',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginTop: '1rem' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#CC0000' }}>302</div>
          <div style={{ textDecoration: 'underline', color: 'black', fontSize: '0.95rem' }}>total hrs</div>
        </div>
        <div style={{ height: '16.5rem', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin = {{ bottom : 24}} >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: 'black', fontSize: '0.75rem' }}
                axisLine={{ stroke: 'transparent', color : 'black' }}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="hours" fill="#CC0000" barSize={30} radius={[6, 6, 0, 0]} />
            </BarChart>
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
    </div>
  );
}