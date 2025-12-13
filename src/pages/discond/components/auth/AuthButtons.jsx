import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth as useDiscondAuth } from "../../contexts/AuthContext";

export default function AuthButtons({ onAuthRequest }) {
  const { user, signOut } = useDiscondAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            const slug = user.slug || user.username || user.id;
            navigate(`/discord/profile/${slug}`);
          }}
          className="text-sm text-gray-100 hover:text-cyan-300"
          aria-label="Buka profil"
          type="button"
        >
          {user.display_name || user.username || user.email}
        </button>
        <button
          onClick={async () => {
            try {
              await signOut();
            } catch (err) {
              console.error("Sign out failed", err);
            }
          }}
          className="px-2 py-1 rounded bg-red-600 text-white text-sm"
          type="button"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      <button
        onClick={() => {
          if (onAuthRequest) return onAuthRequest("login");
          navigate('/discord/login', { state: { from: location.pathname } });
        }}
        className="text-sm text-gray-100 hover:text-cyan-300"
        type="button"
      >
        Login
      </button>
      <button
        onClick={() => {
          if (onAuthRequest) return onAuthRequest("register");
          navigate('/discord/register', { state: { from: location.pathname } });
        }}
        className="text-sm text-gray-100 hover:text-cyan-300"
        type="button"
      >
        Register
      </button>
    </div>
  );
}
