
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  forSidebar?: boolean;
}

const Logo = ({ forSidebar = false }: LogoProps) => {
  // Sidebar: big&centered, Navbar: small inline
  return (
    <Link to="/" className={forSidebar 
      ? "flex flex-col items-center gap-1 py-3" 
      : "flex items-center gap-2"
    }>
      <span className={forSidebar 
        ? "text-findom-green text-4xl drop-shadow font-black"
        : "text-findom-green text-2xl"
      }>💸</span>
      <span className={forSidebar
        ? "text-white font-extrabold text-2xl tracking-wide"
        : "text-white font-bold text-xl"
      }>
        Findom.ad
      </span>
    </Link>
  );
};

export default Logo;
