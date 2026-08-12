import React from 'react';

export default function BrandLogo({ onClick, className = '' }) {
  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`inline-flex items-center gap-3 bg-transparent border-none p-0 cursor-pointer text-left select-none outline-none ${className}`}
      aria-label="Aja Abayahastham Home"
    >
      <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 flex items-center justify-center overflow-hidden">
        <img
          src="/assets/images/aja_logo.png"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/assets/images/GiveAway_Aja_Abayahastham_Logo.png';
          }}
          alt="Aja Abayahastham Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex flex-col justify-center">
        <span className="text-[#0B245B] font-black text-lg sm:text-xl tracking-tight leading-tight">
          Aja Abayahastham
        </span>
        <span className="text-[#475569] font-semibold text-[11px] sm:text-xs tracking-tight leading-tight">
          Trust &amp; Transparency in Every Gift
        </span>
      </div>
    </Tag>
  );
}
