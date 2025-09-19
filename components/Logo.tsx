import React from 'react';

const Logo: React.FC = () => (
  <div className="w-24 h-24 mx-auto mb-2" aria-label="ChromaMix Logo">
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="animate-logo-appear">
      <style>{`
        @keyframes logo-appear {
          0% { transform: scale(0.8) rotate(-45deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .animate-logo-appear {
          animation: logo-appear 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          transform-origin: center;
        }
      `}</style>
      <defs>
        {/* This filter creates a "gooey" or "liquid" effect where elements appear to merge */}
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
      {/* The group applies the filter to the circles within */}
      <g filter="url(#goo)">
        {/* Primary Color Circles */}
        <circle cx="45" cy="42" r="18" fill="#ff0000" /> {/* Red */}
        <circle cx="62" cy="48" r="18" fill="#ffff00" /> {/* Yellow */}
        <circle cx="48" cy="62" r="18" fill="#0000ff" /> {/* Blue */}
      </g>
    </svg>
  </div>
);

export default Logo;
