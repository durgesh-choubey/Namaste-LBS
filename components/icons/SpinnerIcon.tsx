import React from 'react';

const SpinnerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <style>{`
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      .animate-spin-fast {
        animation: spin 0.7s linear infinite;
      }
    `}</style>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v3m0 12v3m9-9h-3m-12 0H3m16.5-6.5l-2.12 2.12M6.62 17.38l-2.12 2.12m12.72 0l-2.12-2.12M6.62 6.62l-2.12-2.12"
      className="opacity-25"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3a9 9 0 019 9h-3a6 6 0 00-6-6V3z"
      className="animate-spin-fast"
    />
  </svg>
);

export default SpinnerIcon;
