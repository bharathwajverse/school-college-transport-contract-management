import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatusBadge from './StatusBadge';

describe('StatusBadge Component', () => {
  it('renders status text correctly', () => {
    render(<StatusBadge status="ACTIVE" />);
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  });

  it('replaces underscores with spaces', () => {
    render(<StatusBadge status="PENDING_RENEWAL" />);
    expect(screen.getByText('PENDING RENEWAL')).toBeInTheDocument();
  });

  it('applies fallback classes for unknown status', () => {
    render(<StatusBadge status="UNKNOWN_XYZ" />);
    const badge = screen.getByText('UNKNOWN XYZ');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gray-100');
  });
});
