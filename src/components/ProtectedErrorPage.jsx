import { Navigate } from "react-router-dom";
import { useErrorAuth } from "../context/ErrorContext";

// Komponen pelindung agar halaman error tidak bisa dibuka langsung
export default function ProtectedErrorPage({ component: Component }) {
  const { authorizedError } = useErrorAuth();
  return authorizedError ? <Component /> : <Navigate to="/404" replace />;
}
