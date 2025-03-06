import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DateFilter from '../DateFilter';
import '@testing-library/jest-dom'; // Import custom matchers

test('renders DateFilter with current month and year', () => {
  render(<DateFilter setDateFilter={() => {}} />);
  const dateDisplay = screen.getByText(/, \d{4}/); // Matches ', YYYY'
  expect(dateDisplay).toBeInTheDocument();
});

test('increments and decrements month correctly', () => {
  const mockSetDateFilter = jest.fn();
  render(<DateFilter setDateFilter={mockSetDateFilter} />);
  const incrementButton = screen.getByTestId('increment-button');
  const decrementButton = screen.getByTestId('decrement-button');
  fireEvent.click(incrementButton);
  fireEvent.click(decrementButton);
  expect(mockSetDateFilter).toHaveBeenCalledTimes(3);
});