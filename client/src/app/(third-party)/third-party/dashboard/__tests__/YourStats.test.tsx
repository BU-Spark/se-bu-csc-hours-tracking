import React from 'react';
import { render, screen } from '@testing-library/react';
import YourStats from '../YourStats';
import '@testing-library/jest-dom';

test('renders YourStats with correct percentages', () => {
  const mockStats = {
    totalSubmissions: 10,
    approvedSubmissions: 8,
    pendingSubmissions: 2,
    totalHoursLogged: 40,
    pendingHours: 10,
  };
  render(<YourStats stats={mockStats} />);
  expect(screen.getByText('Submissions Approved')).toBeInTheDocument();
  expect(screen.getAllByText('80%')[0]).toBeInTheDocument();
});