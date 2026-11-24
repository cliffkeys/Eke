import React from 'react';

// EKE Logo Component - Distinctive Professional SVG Logo
const EkeLogo = ({ size = 'md', variant = 'full' }) => {
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
        <rect width="48" height="48" rx="10" fill="#FF6B2B"/>
        <text x="24" y="34" textAnchor="middle" fontFamily="'Segoe UI', Arial, sans-serif" fontWeight="900" fontSize="28" fill="white" letterSpacing="-1">E</text>
      </svg>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* Icon Mark */}
      <svg width={s.height} height={s.height} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="10" fill="#FF6B2B"/>
        {/* E letter stylized */}
        <rect x="12" y="12" width="22" height="4" rx="2" fill="white"/>
        <rect x="12" y="22" width="17" height="4" rx="2" fill="white"/>
        <rect x="12" y="32" width="22" height="4" rx="2" fill="white"/>
        <rect x="12" y="12" width="4" height="24" rx="2" fill="white"/>
        {/* K element */}
        <circle cx="38" cy="24" r="5" fill="white" opacity="0.3"/>
      </svg>
      {/* Wordmark */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{
          fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontWeight: '900',
          fontSize: `${s.fontSize}px`,
          letterSpacing: '0.08em',
          background: 'linear-gradient(135deg, #FF6B2B 0%, #FF8C42 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>EKE</span>
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

export default EkeLogo;
