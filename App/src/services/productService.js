import api from "./api.js";

export const listarProductosPublicos = async (params = {}) => {
  const respuesta = await api.get("/products", { params });
  return respuesta.data;
};

export const obtenerProductoPublico = async (id) => {
  const respuesta = await api.get("/products/" + id);
  return respuesta.data;
};
