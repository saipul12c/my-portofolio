import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ErrorContext } from "./ErrorContextObject";

export function ErrorProvider({ children }) {
  const [authorizedError, setAuthorizedError] = useState(false);
  const location = useLocation();

  // Reset izin error setiap kali user berpindah halaman
  useEffect(() => {
    setAuthorizedError(false);
  }, [location.pathname]);

  return (
    <ErrorContext.Provider value={{ authorizedError, setAuthorizedError }}>
      {children}
    </ErrorContext.Provider>
  );
}
