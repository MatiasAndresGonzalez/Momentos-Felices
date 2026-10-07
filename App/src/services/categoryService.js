import api from './api.js';

export const listarCategoriasPublicas = async () => {
  const respuesta = await api.get('/categories');
  return respuesta.data?.data || respuesta.data || [];
};
