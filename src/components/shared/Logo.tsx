
import React from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface LogoProps {
  forSidebar?: boolean;
  className?: string;
}

const Logo = ({
  forSidebar = false,
  className = ""
}: LogoProps) => {
  const isMobile = useIsMobile();
  
  // On mobile sidebar, use a more compact logo
  if (forSidebar && isMobile) {
    return (
      <Link 
        to="/" 
        className={`flex items-center gap-1 truncate ${className}`}
        style={{ minWidth: 0 }}
      >
        <span className="text-findom-green text-2xl font-black">💸</span>
        <span className="font-bold text-lg truncate">Findom.ad</span>
      </Link>
    );
  }
  
  // Desktop sidebar or regular logo
  return (
    <Link 
      to="/" 
      className={forSidebar 
        ? `flex items-center gap-2 truncate w-full ${className}` 
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
      <span className="font-bold text-2xl text-left">Findom.ad</span>
    </Link>
  );
};

export default Logo;
