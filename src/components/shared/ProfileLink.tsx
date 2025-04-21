
import React from 'react';
import { Link } from 'react-router-dom';

const ProfileLink = () => (
  <Link
    to="/profile"
    className="inline-block px-3 py-1 rounded bg-findom-purple text-white text-sm font-semibold hover:bg-findom-purple/80 transition"
  >
    Edit Profile
  </Link>
);

export default ProfileLink;
