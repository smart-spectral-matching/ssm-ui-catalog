import React from 'react';
import {render, screen} from '@testing-library/react';
import Home from 'components/Home';

test('renders Home component', () => {
  render(<Home />);
  const linkElement = screen.getByText(/nuclear data\s?streams/i);
  expect(linkElement).toBeInTheDocument();
});
