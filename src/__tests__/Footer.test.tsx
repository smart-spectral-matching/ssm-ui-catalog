import {render, screen} from '@testing-library/react';
import Footer from 'components/layout/Footer';

test('Footer text contains title', () => {
  render(<Footer />);
  const linkElement = screen.getByText(/smart spectral matching/i);
  expect(linkElement).toBeInTheDocument();
});
