import type { CSSProperties } from 'react';

export const input: CSSProperties = {
  width: '100%',
  padding: '0.6rem 0.75rem',
  border: '1px solid #ccc',
  borderRadius: 6,
  fontSize: '1rem',
  boxSizing: 'border-box',
};

export const button: CSSProperties = {
  padding: '0.65rem 1.1rem',
  border: 'none',
  borderRadius: 6,
  background: '#111',
  color: '#fff',
  fontSize: '1rem',
  cursor: 'pointer',
};

export const form: CSSProperties = {
  display: 'grid',
  gap: '0.9rem',
  maxWidth: 420,
};

export const errorBox: CSSProperties = {
  color: '#b00020',
  background: '#fdecea',
  padding: '0.6rem 0.75rem',
  borderRadius: 6,
};
