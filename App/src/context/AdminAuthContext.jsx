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
  logoutAdmin,
} from "../services/adminService.js";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [clienteActivo, setClienteActivo] = useState(false);

  const limpiarSesion = useCallback(() => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("adminUsuario");
    setToken(null);
    setAdmin(null);
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem("adminRefreshToken");
    try {
      if (refreshToken) await logoutAdmin(refreshToken);
    } catch (error) {
      console.warn("No se pudo invalidar la sesión admin en el servidor:", error.message);
    } finally {
      limpiarSesion();
    }
  }, [limpiarSesion]);

  const renovarSesion = useCallback(async () => {
    const refreshToken = localStorage.getItem("adminRefreshToken");
    if (!refreshToken) return false;

    try {
      const respuesta = await refreshTokenAdmin(refreshToken);
      localStorage.setItem("adminToken", respuesta.token);
      localStorage.setItem("adminRefreshToken", respuesta.refreshToken || refreshToken);
      localStorage.setItem("adminUsuario", JSON.stringify(respuesta.usuario));
      setToken(respuesta.token);
      setAdmin(respuesta.usuario);
      return true;
    } catch {
      return false;
    }
  }, []);

  const validarToken = useCallback(async () => {
    const tokenGuardado = localStorage.getItem("adminToken");
    const refreshGuardado = localStorage.getItem("adminRefreshToken");

    if (!tokenGuardado && !refreshGuardado) {
      setCargando(false);
      return false;
    }

    try {
      const respuesta = await import("../services/adminService.js").then((m) =>
        m.obtenerPerfilAdmin()
      );
      const perfil = respuesta?.data || respuesta;
      localStorage.setItem("adminUsuario", JSON.stringify(perfil));
      setToken(tokenGuardado);
      setAdmin(perfil);
      return true;
    } catch {
      const renovada = await renovarSesion();
      if (renovada) return true;
      limpiarSesion();
      return false;
    } finally {
      setCargando(false);
    }
  }, [limpiarSesion, renovarSesion]);

  useEffect(() => {
    setClienteActivo(!!localStorage.getItem("token"));
    validarToken();
  }, [validarToken]);

  const login = async (email, password) => {
    if (localStorage.getItem("token")) {
      setClienteActivo(true);
      const error = new Error(
        "Ya posee una sesión de Cliente activa. Para ingresar al panel de Administración, debe cerrar su sesión actual"
      );
      error.code = "CLIENT_SESSION_ACTIVE";
      throw error;
    }

    const respuesta = await loginAdminService(email, password);
    localStorage.setItem("adminToken", respuesta.token);
    localStorage.setItem("adminRefreshToken", respuesta.refreshToken);
    localStorage.setItem("adminUsuario", JSON.stringify(respuesta.usuario));
    setToken(respuesta.token);
    setAdmin(respuesta.usuario);
    setClienteActivo(false);
    return respuesta.usuario;
  };

  const cerrarSesionClienteYContinuar = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      if (refreshToken) await (await import("../services/authServices.js")).logoutUsuario(refreshToken);
    } catch (error) {
      console.warn("No se pudo invalidar la sesión de cliente:", error.message);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("usuario");
      setClienteActivo(false);
    }
  }, []);

  const actualizarAdmin = (datos) => {
    const adminActualizado = { ...admin, ...datos };
    localStorage.setItem("adminUsuario", JSON.stringify(adminActualizado));
    setAdmin(adminActualizado);
  };

  const esAdmin = admin?.rol?.toUpperCase() === "SUPERADMIN";
  const esGestor = admin?.rol?.toUpperCase() === "GESTOR";
  const esAuditor = admin?.rol?.toUpperCase() === "AUDITOR";

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
    accesoTotal: esAdmin,
    accesoGestor: esAdmin || esGestor,
    accesoAuditor: esAuditor,
    rol: admin?.rol || null,
    clienteActivo,
    cerrarSesionClienteYContinuar,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {cargando ? (
        <div className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-400">
          <p className="text-sm font-medium">Verificando sesión de administrador...</p>
        </div>
      ) : children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAdminAuth debe ser usado dentro de un AdminAuthProvider");
  return context;
}
