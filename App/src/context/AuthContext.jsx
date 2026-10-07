import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  loginUsuario,
  registrarUsuario,
  refreshTokenUsuario,
  logoutUsuario,
} from "../services/authServices.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);

  const limpiarSesion = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("usuario");
    setToken(null);
    setUsuario(null);
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      if (refreshToken) await logoutUsuario(refreshToken);
    } catch (error) {
      console.warn("No se pudo invalidar la sesión en el servidor:", error.message);
    } finally {
      limpiarSesion();
    }
  }, [limpiarSesion]);

  const renovarSesion = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return false;

    try {
      const respuesta = await refreshTokenUsuario(refreshToken);
      localStorage.setItem("token", respuesta.token);
      localStorage.setItem("refreshToken", respuesta.refreshToken || refreshToken);
      localStorage.setItem("usuario", JSON.stringify(respuesta.usuario));
      setToken(respuesta.token);
      setUsuario(respuesta.usuario);
      return true;
    } catch {
      return false;
    }
  }, []);

  const validarToken = useCallback(async () => {
    const tokenGuardado = localStorage.getItem("token");
    const refreshGuardado = localStorage.getItem("refreshToken");

    if (!tokenGuardado && !refreshGuardado) {
      setCargando(false);
      return false;
    }

    try {
      const respuesta = await import("../services/authServices.js").then((m) =>
        m.obtenerPerfilUsuario()
      );
      const perfil = respuesta?.data || respuesta;
      localStorage.setItem("usuario", JSON.stringify(perfil));
      setToken(tokenGuardado);
      setUsuario(perfil);
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
    validarToken();
  }, [validarToken]);

  const guardarSesion = useCallback((respuesta) => {
    localStorage.setItem("token", respuesta.token);
    localStorage.setItem("refreshToken", respuesta.refreshToken);
    localStorage.setItem("usuario", JSON.stringify(respuesta.usuario));
    setToken(respuesta.token);
    setUsuario(respuesta.usuario);
  }, []);

  const login = async (email, password) => {
    const respuesta = await loginUsuario(email, password);
    guardarSesion(respuesta);
    return respuesta.usuario;
  };

  const registro = async (datos) => {
    const respuesta = await registrarUsuario(datos);
    guardarSesion(respuesta);
    return respuesta.usuario;
  };

  const actualizarUsuario = (datosActualizados) => {
    const usuarioNuevo = { ...usuario, ...datosActualizados };
    localStorage.setItem("usuario", JSON.stringify(usuarioNuevo));
    setUsuario(usuarioNuevo);
  };

  const value = {
    usuario,
    token,
    isAuthenticated: !!usuario,
    cargando,
    login,
    registro,
    logout,
    validarToken,
    actualizarUsuario,
  };

  return (
    <AuthContext.Provider value={value}>
      {cargando ? (
        <div className="flex min-h-screen items-center justify-center bg-black text-white">
          <p className="text-sm">Verificando sesión...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe utilizarse dentro de AuthProvider");
  return context;
}
