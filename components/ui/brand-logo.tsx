import * as React from 'react';

export function StrataLogo({ className = "w-9 h-9", withText = true }: { className?: string; withText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 group select-none">
      {/* Precision Geometric Monogram */}
      <div className={`relative rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 ${className}`}>
        <svg 
          viewBox="0 0 36 36" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5"
        >
          {/* Top Layer */}
          <path 
            d="M8 12L18 7L28 12L18 17L8 12Z" 
            fill="white" 
            fillOpacity="0.95" 
          />
          {/* Middle Layer */}
          <path 
            d="M8 18L18 13L28 18L18 23L8 18Z" 
            fill="white" 
            fillOpacity="0.65" 
          />
          {/* Bottom Foundation Layer */}
          <path 
            d="M8 24L18 19L28 24L18 29L8 24Z" 
            fill="white" 
            fillOpacity="0.35" 
          />
        </svg>
      </div>

      {withText && (
        <div className="flex flex-col">
          <span className="font-bold text-lg leading-tight tracking-tight text-foreground font-sans">
            Strata
          </span>
          <span className="text-[11px] font-medium text-muted-foreground tracking-wide uppercase">
            Operations
          </span>
        </div>
      )}
    </div>
  );
}
