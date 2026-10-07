import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  loginAdmin as loginAdminService,
  refreshTokenAdmin,
} from "../services/adminService.js";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUsuario");
    setToken(null);
    setAdmin(null);
  }, []);

  const validarToken = useCallback(async () => {
    const tokenGuardado = localStorage.getItem("adminToken");

    if (!tokenGuardado) {
      setCargando(false);
      return false;
    }

    try {
      const respuesta = await refreshTokenAdmin();
      const nuevoToken = respuesta.token;
      const usuarioActualizado = respuesta.usuario;

      localStorage.setItem("adminToken", nuevoToken);
      localStorage.setItem("adminUsuario", JSON.stringify(usuarioActualizado));

      setToken(nuevoToken);
      setAdmin(usuarioActualizado);
      return true;
    } catch (error) {
      console.warn(
        "El token de admin no es válido o ha expirado:",
        error.message,
      );
      logout();
      return false;
    } finally {
      setCargando(false);
    }
  }, [logout]);

  useEffect(() => {
    validarToken();
  }, [validarToken]);

  const login = async (email, password) => {
    const respuesta = await loginAdminService(email, password);

    const nuevoToken = respuesta.token;
    const nuevoAdmin = respuesta.usuario;

    localStorage.setItem("adminToken", nuevoToken);
    localStorage.setItem("adminUsuario", JSON.stringify(nuevoAdmin));

    setToken(nuevoToken);
    setAdmin(nuevoAdmin);

    return nuevoAdmin;
  };

  const actualizarAdmin = (datos) => {
    const adminActualizado = { ...admin, ...datos };
    localStorage.setItem("adminUsuario", JSON.stringify(adminActualizado));
    setAdmin(adminActualizado);
  };

  const esAdmin = admin?.rol?.toUpperCase() === "SUPERADMIN";
  const esGestor = admin?.rol?.toUpperCase() === "GESTOR";
  const esAuditor = admin?.rol?.toUpperCase() === "AUDITOR";
  const accesoTotal = esAdmin;
  const accesoGestor = esGestor;
  const accesoAuditor = esAuditor;

  const value = {
    admin,
    token,
    isAuthenticated: !!admin,
    cargando,
    login,
    logout,
    actualizarAdmin,
    validarToken,
    esAdmin,
    esGestor,
    esAuditor,
    accesoTotal,
    accesoGestor,
    accesoAuditor,
    rol: admin?.rol || null,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {cargando ? (
        <div className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-400">
          <p className="text-sm font-medium">
            Verificando sesión de administrador...
          </p>
        </div>
      ) : (
        children
      )}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error(
      "useAdminAuth debe ser usado dentro de un AdminAuthProvider",
    );
  }
  return context;
}
