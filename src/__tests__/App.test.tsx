import { render } from '@testing-library/react';
import React from 'react';
import App from '../App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<App />);
    expect(getByText(/trust bridge ai/i)).toBeInTheDocument();
  });
});
