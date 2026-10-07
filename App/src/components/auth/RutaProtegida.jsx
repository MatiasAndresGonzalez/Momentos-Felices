import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

function RutaProtegida({ children }) {
  const { isAuthenticated, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm font-medium text-neutral-500">Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RutaProtegida;
