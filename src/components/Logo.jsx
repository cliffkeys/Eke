import React from 'react';

// OASIS Logo Component - Distinctive Professional SVG Logo
const OasisLogo = ({ size = 'md', variant = 'full' }) => {
  const sizes = {
    sm: { height: 32, fontSize: 18, tagSize: 8 },
    md: { height: 40, fontSize: 24, tagSize: 9 },
    lg: { height: 56, fontSize: 34, tagSize: 11 },
    xl: { height: 72, fontSize: 44, tagSize: 13 },
  };
  const s = sizes[size] || sizes.md;

  if (variant === 'icon') {
    return (
      <svg width={s.height} height={s.height} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#FF6B2B"/>
        <circle cx="24" cy="24" r="12" stroke="white" strokeWidth="4" fill="none"/>
        <circle cx="24" cy="24" r="4.5" fill="white"/>
      </svg>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* Icon Mark */}
      <svg width={s.height} height={s.height} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#FF6B2B"/>
        <circle cx="24" cy="24" r="12" stroke="white" strokeWidth="4" fill="none"/>
        <circle cx="24" cy="24" r="4.5" fill="white"/>
      </svg>
      {/* Wordmark */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{
          fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontWeight: '900',
          fontSize: `${s.fontSize}px`,
          letterSpacing: '0.12em',
          background: 'linear-gradient(135deg, #FF6B2B 0%, #FF8C42 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>OASIS</span>
        {size !== 'sm' && (
          <span style={{
            fontFamily: "'Segoe UI', Arial, sans-serif",
            fontWeight: '400',
            fontSize: `${s.tagSize}px`,
            letterSpacing: '0.15em',
            color: '#888',
            textTransform: 'uppercase',
          }}>Discover More. Shop Smarter.</span>
        )}
      </div>
    </div>
  );
};

export default OasisLogo;
