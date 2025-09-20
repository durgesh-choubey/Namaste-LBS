
import React from 'react';

const CalendarOffIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4.75 4.75l14.5 14.5" />
    <path d="M21 13V6a2 2 0 00-2-2H8" />
    <path d="M3 10v11a2 2 0 002 2h11" />
    <path d="M16 2v4" />
    <path d="M8 2v2" />
  </svg>
);

export default CalendarOffIcon;
