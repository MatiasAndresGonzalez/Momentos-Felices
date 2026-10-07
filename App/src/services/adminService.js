import { adminApi } from "./adminApi.js";

export const loginAdmin = async (email, password) => {
  return adminApi.post("/auth/admin/login", {
    email,
    password,
  });
};

export const refreshTokenAdmin = async () => {
  return adminApi.get("/auth/admin/refresh");
};

export const obtenerPerfilAdmin = async () => {
  return adminApi.get("/auth/admin/perfil");
};

export const listarAdministradores = async () => adminApi.get("/admin");
export const obtenerAdministradorPorId = async (id) =>
  adminApi.get(`/admin/${id}`);
export const crearAdministrador = async (datos) =>
  adminApi.post("/admin", datos);
export const actualizarAdministrador = async (id, datos) =>
  adminApi.put(`/admin/${id}`, datos);
export const eliminarAdministrador = async (id) =>
  adminApi.delete(`/admin/${id}`);
export const listarRolesAdmin = async () => adminApi.get("/admin/roles");

export const listarProductos = async () => adminApi.get("/productos");

export const obtenerProductosPorId = async (id) =>
  adminApi.get(`/productos/${id}`);

export const crearProducto = async (datos) =>
  adminApi.post("/productos", datos);

export const actualizarProducto = async (id, datos) =>
  adminApi.put(`/productos/${id}`, datos);

export const eliminarProducto = async (id) =>
  adminApi.delete(`/productos/${id}`);

export const listarCategorias = async () => adminApi.get("/categorias");

export const crearCategoria = async (datos) =>
  adminApi.post("/categorias", datos);

export const actualizarCategoria = async (id, datos) =>
  adminApi.put(`/categorias/${id}`, datos);

export const eliminarCategoria = async (id) =>
  adminApi.delete(`/categorias/${id}`);

export const listarComprasAdmin = async () => adminApi.get("/compras/admin");

export const actualizarEstadoCompraAdmin = async (id, estado) =>
  adminApi.put(`/compras/${id}`, { estado });
