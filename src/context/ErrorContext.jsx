import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ErrorContext = createContext();

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

export function useErrorAuth() {
  return useContext(ErrorContext);
}
