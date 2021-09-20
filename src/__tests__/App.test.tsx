import { render } from '@testing-library/react';

import App from 'App';

test('renders the entire App without crashing', () => {
  render(<App />);
});
