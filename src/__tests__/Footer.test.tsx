import React from 'react';
import {render, screen} from '@testing-library/react';
import Footer from 'components/layout/Footer';

test('Footer text contains title', () => {
  render(<Footer />);
  const linkElement = screen.getByText(/nuclear data\s?streams/i);
  expect(linkElement).toBeInTheDocument();
});
