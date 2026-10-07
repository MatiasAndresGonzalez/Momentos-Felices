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
} from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  const [token, setToken] = useState(null);

  const [cargando, setCargando] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    setToken(null);
    setUsuario(null);
  }, []);

  const validarToken = useCallback(async () => {
    const tokenGuardado = localStorage.getItem("token");

    if (!tokenGuardado) {
      setCargando(false);
      return false;
    }

    try {
      const respuesta = await refreshTokenUsuario();

      const nuevoToken = respuesta.token;

      const usuarioActualizado = respuesta.usuario;

      localStorage.setItem("token", nuevoToken);

      localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));

      setToken(nuevoToken);
      setUsuario(usuarioActualizado);

      return true;
    } catch (error) {
      console.warn("El token guardado no es válido o expiró:", error.message);

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
    const respuesta = await loginUsuario(email, password);

    const nuevoToken = respuesta.token;

    const nuevoUsuario = respuesta.usuario;

    localStorage.setItem("token", nuevoToken);

    localStorage.setItem("usuario", JSON.stringify(nuevoUsuario));

    setToken(nuevoToken);
    setUsuario(nuevoUsuario);

    return nuevoUsuario;
  };

  const registro = async (datos) => {
    const respuesta = await registrarUsuario(datos);

    const nuevoToken = respuesta.token;

    const nuevoUsuario = respuesta.usuario;

    localStorage.setItem("token", nuevoToken);

    localStorage.setItem("usuario", JSON.stringify(nuevoUsuario));

    setToken(nuevoToken);
    setUsuario(nuevoUsuario);

    return nuevoUsuario;
  };

  const actualizarUsuario = (datosActualizados) => {
    const usuarioNuevo = {
      ...usuario,
      ...datosActualizados,
    };

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

  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de AuthProvider");
  }

  return context;
}
