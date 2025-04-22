
import React from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface LogoProps {
  forSidebar?: boolean;
  className?: string;
  hideInHeader?: boolean;
}

const Logo = ({
  forSidebar = false,
  hideInHeader = false,
  className = ""
}: LogoProps) => {
  const isMobile = useIsMobile();
  
  // Don't render in header if requested
  if (!forSidebar && hideInHeader) {
    return null;
  }
  
  // Always keep emoji and text inline and truncate text first
  return (
    <Link 
      to="/" 
      className={forSidebar 
        ? `flex items-center gap-2 px-4 py-3 truncate w-full ${className}` 
        : `flex items-center gap-2 truncate ${className}`
      } 
      style={{ minWidth: 0 }}
    >
      <span className={forSidebar 
        ? "text-findom-green text-3xl font-black shrink-0" 
        : "text-findom-green text-2xl font-black shrink-0"
      }>
        💸
      </span>
      <span className={`font-bold text-xl sm:text-2xl text-left truncate ${isMobile && !forSidebar ? 'max-w-[120px]' : ''}`}>
        Findom.ad
      </span>
    </Link>
  );
};

export default Logo;
