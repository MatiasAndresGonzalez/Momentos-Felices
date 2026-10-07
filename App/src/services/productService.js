import api from "./api.js";

export const listarProductosPublicos = async (params = {}) => {
  const respuesta = await api.get("/products", { params });
  const body = respuesta.data || {};
  return {
    productos: body.data?.rows || body.rows || [],
    pagination: body.data?.pagination || body.pagination || {},
    total: body.data?.pagination?.total || body.pagination?.total || 0,
    totalPages: body.data?.pagination?.totalPages || body.pagination?.totalPages || 1,
  };
};

export const obtenerProductoPublico = async (id) => {
  const respuesta = await api.get("/products/" + id);
  return respuesta.data?.data || respuesta.data;
};
