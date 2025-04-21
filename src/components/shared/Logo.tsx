
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  forSidebar?: boolean;
  className?: string;
}

const Logo = ({
  forSidebar = false,
  className = "",
}: LogoProps) => {
  // Logo emoji plus app name, always inline, truncate text if needed
  return (
    <Link
      to="/"
      className={`flex items-center gap-2 truncate ${forSidebar ? "px-4 py-3 w-full" : ""} ${className}`}
      style={{ minWidth: 0 }}
    >
      <span className={forSidebar ? "text-findom-green text-3xl font-black shrink-0" : "text-findom-green text-2xl font-black shrink-0"}>
        💸
      </span>
      <span
        className={`font-extrabold tracking-tight whitespace-nowrap truncate ${forSidebar ? "text-white text-xl" : "text-white text-lg"} `}
        style={{ letterSpacing: "-0.025em" }}
      >
        Findom Platform
      </span>
    </Link>
  );
};
export default Logo;
