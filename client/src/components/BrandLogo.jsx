import React from 'react';
import { Link } from 'react-router-dom';

/**
 * BrandLogo component for Miracle IT Career Academy
 * Renders the authentic official academy logo with responsive sizing and crisp contrast.
 */
export default function BrandLogo({
  to = '/',
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  variant = 'pill', // 'pill' | 'dark' | 'simple' | 'raw'
  showSubtitle = true,
  className = '',
}) {
  // Height configurations
  const heightClasses = {
    xs: 'h-6',
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-11',
    lg: 'h-12 sm:h-14',
    xl: 'h-16 sm:h-20',
  };

  const currentHeight = heightClasses[size] || heightClasses.md;

  const logoImg = (
    <img
      src="/logo.png"
      alt="Miracle IT Career Academy - Central India's No.1 IT Training Academy"
      className={`${currentHeight} w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]`}
      loading="eager"
    />
  );

  // If raw image only
  if (variant === 'raw') {
    return logoImg;
  }

  // Pill variant: Ultra-crisp frosted white container designed specifically to make
  // the official full-color logo pop out with 100% clarity on dark canvases
  const content = variant === 'pill' ? (
    <div
      className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white backdrop-blur-md border border-white/40 shadow-lg shadow-black/20 hover:shadow-orange-500/20 transition-all duration-200 ${className}`}
    >
      {logoImg}
      {showSubtitle && (
        <span className="hidden xl:inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200/80">
          Central India's #1
        </span>
      )}
    </div>
  ) : (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className="bg-white/90 p-1.5 rounded-xl shadow-md border border-white/30">
        {logoImg}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="inline-flex items-center focus:outline-none focus:ring-2 focus:ring-orange-500/50 rounded-xl group"
        title="Miracle IT Career Academy"
      >
        {content}
      </Link>
    );
  }

  return <div className="group">{content}</div>;
}
