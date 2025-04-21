
import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 w-fit">
      <span className="text-findom-green text-2xl">💸</span>
      <span className="text-white font-bold text-xl whitespace-nowrap">Findom.ad</span>
    </Link>
  );
};

export default Logo;
