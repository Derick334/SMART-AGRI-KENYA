import React from 'react';

interface SmartAgriLogoProps {
  variant?: 'full' | 'emblem' | 'wordmark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isDark?: boolean;
}

export const SmartAgriLogo: React.FC<SmartAgriLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  isDark = false,
}) => {
  // Dimension scales
  const emblemSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const fullSizes = {
    sm: 'h-8',
    md: 'h-11',
    lg: 'h-14',
    xl: 'h-20',
  };

  // Pure SVG Emblem Mark
  const EmblemSvg = ({ className: svgClass = '' }: { className?: string }) => (
    <svg 
      viewBox="0 0 500 500" 
      className={`shrink-0 ${svgClass}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="sunGlowComp" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFF066"/>
          <stop offset="45%" stop-color="#FBBF24"/>
          <stop offset="85%" stop-color="#F59E0B"/>
          <stop offset="100%" stop-color="#D97706"/>
        </radialGradient>
        <linearGradient id="leafLeftComp" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#22C55E"/>
          <stop offset="60%" stop-color="#15803D"/>
          <stop offset="100%" stop-color="#0F5132"/>
        </linearGradient>
        <linearGradient id="leafRightComp" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#22C55E"/>
          <stop offset="60%" stop-color="#15803D"/>
          <stop offset="100%" stop-color="#0F5132"/>
        </linearGradient>
        <linearGradient id="centerSproutComp" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#86EFAC"/>
          <stop offset="50%" stop-color="#22C55E"/>
          <stop offset="100%" stop-color="#15803D"/>
        </linearGradient>
        <linearGradient id="field1Comp" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#0A3622"/>
          <stop offset="50%" stop-color="#14532D"/>
          <stop offset="100%" stop-color="#0A3622"/>
        </linearGradient>
        <linearGradient id="field2Comp" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#166534"/>
          <stop offset="50%" stop-color="#22C55E"/>
          <stop offset="100%" stop-color="#166534"/>
        </linearGradient>
        <linearGradient id="field3Comp" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#15803D"/>
          <stop offset="50%" stop-color="#4ADE80"/>
          <stop offset="100%" stop-color="#15803D"/>
        </linearGradient>
      </defs>

      {/* Sun & Rays */}
      <polygon points="250,45 237,125 263,125" fill="#F59E0B"/>
      <polygon points="208,58 206,134 231,130" fill="#F59E0B"/>
      <polygon points="292,58 269,130 294,134" fill="#F59E0B"/>
      <polygon points="168,82 178,154 201,144" fill="#F59E0B"/>
      <polygon points="332,82 299,144 322,154" fill="#F59E0B"/>
      <polygon points="135,119 157,181 176,166" fill="#F59E0B"/>
      <polygon points="365,119 324,166 343,181" fill="#F59E0B"/>
      <polygon points="113,165 147,211 161,192" fill="#F59E0B"/>
      <polygon points="387,165 339,192 353,211" fill="#F59E0B"/>

      <circle cx="250" cy="180" r="82" fill="url(#sunGlowComp)"/>

      {/* Plowed Agricultural Fields */}
      <path d="M 95,290 C 130,410 370,410 405,290 C 350,335 150,335 95,290 Z" fill="url(#field1Comp)"/>
      <path d="M 115,312 C 160,405 340,405 385,312 C 340,345 160,345 115,312 Z" fill="url(#field2Comp)"/>
      <path d="M 145,335 C 185,400 315,400 355,335 C 315,360 185,360 145,335 Z" fill="url(#field3Comp)"/>

      <path d="M 90,285 Q 250,345 410,285" fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round"/>
      <path d="M 110,310 Q 250,365 390,310" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
      <path d="M 138,335 Q 250,385 362,335" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
      <path d="M 175,365 Q 250,405 325,365" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>

      {/* Agritech Wing Leaves */}
      <path d="M 245,310 C 170,305 75,255 70,165 C 105,190 190,225 245,310 Z" fill="url(#leafLeftComp)" stroke="#FFFFFF" stroke-width="5" stroke-linejoin="round"/>
      <path d="M 255,310 C 330,305 425,255 430,165 C 395,190 310,225 255,310 Z" fill="url(#leafRightComp)" stroke="#FFFFFF" stroke-width="5" stroke-linejoin="round"/>

      {/* Circuit Traces */}
      <g stroke="#FFFFFF" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M 225,290 L 175,260 L 140,260 L 115,225"/>
        <circle cx="115" cy="225" r="5.5" fill="#FFFFFF" stroke="none"/>
        <path d="M 215,275 L 180,240 L 148,240 L 132,215"/>
        <circle cx="132" cy="215" r="5" fill="#FFFFFF" stroke="none"/>
        <path d="M 235,300 L 195,280 L 165,280 L 140,250"/>
        <circle cx="140" cy="250" r="4.5" fill="#FFFFFF" stroke="none"/>

        <path d="M 275,290 L 325,260 L 360,260 L 385,225"/>
        <circle cx="385" cy="225" r="5.5" fill="#FFFFFF" stroke="none"/>
        <path d="M 285,275 L 320,240 L 352,240 L 368,215"/>
        <circle cx="368" cy="215" r="5" fill="#FFFFFF" stroke="none"/>
        <path d="M 265,300 L 305,280 L 335,280 L 360,250"/>
        <circle cx="360" cy="250" r="4.5" fill="#FFFFFF" stroke="none"/>
      </g>

      {/* Sprout Core */}
      <path d="M 250,140 C 230,175 230,225 250,265 C 270,225 270,175 250,140 Z" fill="url(#centerSproutComp)" stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round"/>
      <path d="M 250,230 C 215,210 195,180 195,180 C 215,200 240,225 250,250 Z" fill="#16A34A" stroke="#FFFFFF" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M 250,230 C 285,210 305,180 305,180 C 285,200 260,225 250,250 Z" fill="#16A34A" stroke="#FFFFFF" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M 250,260 C 215,245 180,225 180,225 C 205,245 235,265 250,285 Z" fill="#22C55E" stroke="#FFFFFF" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M 250,260 C 285,245 320,225 320,225 C 295,245 265,265 250,285 Z" fill="#22C55E" stroke="#FFFFFF" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M 245,260 L 255,260 L 253,315 L 247,315 Z" fill="#15803D"/>
    </svg>
  );

  if (variant === 'emblem') {
    return (
      <div className={`inline-flex items-center justify-center ${emblemSizes[size]} ${className}`}>
        <EmblemSvg className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${fullSizes[size]} ${className}`}>
      {/* Emblem */}
      <EmblemSvg className={emblemSizes[size]} />

      {/* Typography: SMART-AGRI / — KENYA — */}
      <div className="flex flex-col justify-center leading-none">
        <span 
          className={`font-black tracking-tight font-sans ${
            size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg sm:text-xl' : size === 'lg' ? 'text-2xl' : 'text-3xl'
          } ${isDark ? 'text-white' : 'text-emerald-950'}`}
        >
          SMART-AGRI
        </span>
        
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`h-0.5 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-600'} ${size === 'sm' ? 'w-3' : 'w-4'}`}></span>
          <span 
            className={`font-black tracking-[0.25em] text-[10px] sm:text-[11px] font-sans ${
              isDark ? 'text-emerald-400' : 'text-emerald-700'
            }`}
          >
            KENYA
          </span>
          <span className={`h-0.5 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-600'} ${size === 'sm' ? 'w-3' : 'w-4'}`}></span>
        </div>
      </div>
    </div>
  );
};
