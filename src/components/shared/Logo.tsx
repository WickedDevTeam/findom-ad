
import React from 'react';
import { Link } from 'react-router-dom';
interface LogoProps {
  forSidebar?: boolean;
  className?: string;
}
const Logo = ({
  forSidebar = false,
  className = ""
}: LogoProps) => {
  // Always keep emoji and text inline and truncate text first
  return <Link to="/" className={forSidebar ? `flex items-center gap-2 px-4 py-3 truncate w-full ${className}` : `flex items-center gap-2 truncate ${className}`} style={{
    minWidth: 0
  }}>
      <span className={forSidebar ? "text-findom-green text-3xl font-black shrink-0" : "text-findom-green text-2xl font-black shrink-0"}>
        💸
      </span>
      <span className={forSidebar ? "font-bold text-lg truncate" : "font-bold text-base truncate"}>
        FinDom Directory
      </span>
    </Link>;
};
export default Logo;
