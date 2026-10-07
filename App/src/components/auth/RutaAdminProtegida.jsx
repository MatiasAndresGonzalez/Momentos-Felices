import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";

function RutaAdminProtegida({ children }) {
  const { isAuthenticated, cargando } = useAdminAuth();

  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-400">
        <p className="text-sm font-medium">Cargando panel...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default RutaAdminProtegida;
