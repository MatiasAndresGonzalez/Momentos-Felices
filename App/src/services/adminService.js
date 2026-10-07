import { adminApi } from "./adminApi.js";

export const loginAdmin = async (email, password) => {
  return adminApi.post("/auth/admin/login", { email, password });
};

export const refreshTokenAdmin = async (refreshToken) => {
  return adminApi.post("/auth/refresh", { refreshToken });
};

export const logoutAdmin = async (refreshToken) => {
  return adminApi.post("/auth/logout", { refreshToken });
};

export const obtenerPerfilAdmin = async () => adminApi.get("/auth/admin/perfil");

export const listarAdministradores = async () => adminApi.get("/admin");
export const obtenerAdministradorPorId = async (id) => adminApi.get(`/admin/${id}`);
export const crearAdministrador = async (datos) => adminApi.post("/admin", datos);
export const actualizarAdministrador = async (id, datos) => adminApi.put(`/admin/${id}`, datos);
export const eliminarAdministrador = async (id) => adminApi.delete(`/admin/${id}`);
export const listarRolesAdmin = async () => adminApi.get("/admin/roles");

export const listarProductos = async (params) => adminApi.get("/products", { params });
export const obtenerProductosPorId = async (id) => adminApi.get(`/products/${id}`);
export const crearProducto = async (datos) => adminApi.post("/products", datos);
export const actualizarProducto = async (id, datos) => adminApi.put(`/products/${id}`, datos);
export const eliminarProducto = async (id) => adminApi.delete(`/products/${id}`);
