import api from "./api.js";

export const loginUsuario = async (email, password) => {
  const respuesta = await api.post("/auth/client/login", { email, password });
  return respuesta.data;
};

export const registrarUsuario = async (datos) => {
  const respuesta = await api.post("/auth/client/registro", datos);
  return respuesta.data;
};

export const refreshTokenUsuario = async (refreshToken) => {
  const respuesta = await api.post("/auth/refresh", { refreshToken });
  return respuesta.data;
};

export const logoutUsuario = async (refreshToken) => {
  const respuesta = await api.post("/auth/logout", { refreshToken });
  return respuesta.data;
};

export const obtenerPerfilUsuario = async () => {
  const respuesta = await api.get("/auth/client/perfil");
  return respuesta.data;
};

export const actualizarPerfilUsuario = async (datos) => {
  const respuesta = await api.put("/auth/client/perfil", datos);
  return respuesta.data;
};
