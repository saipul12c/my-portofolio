import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function AuthButtons() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link to="/profile" className="text-sm text-gray-200 hover:text-cyan-300">
          {user.display_name || user.username || user.email}
        </Link>
        <button onClick={() => logout()} className="px-3 py-1 rounded bg-red-600 text-white text-sm">Logout</button>
      </div>
    );
  }

  // Always redirect to `/streming` after login/register when triggered from streming UI
  return (
    <div className="flex items-center gap-3">
      <Link to={{ pathname: '/login', state: { from: '/streming' } }} className="text-sm text-gray-200 hover:text-cyan-300">Login</Link>
      <Link to={{ pathname: '/register', state: { from: '/streming' } }} className="text-sm text-gray-200 hover:text-cyan-300">Register</Link>
    </div>
  );
}
