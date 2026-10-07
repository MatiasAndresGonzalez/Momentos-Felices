import { adminApi } from './adminApi.js';

export const listarCategoriasAdmin = async () => adminApi.get('/categories');
export const crearCategoria = async (datos) => adminApi.post('/categories', datos);
export const actualizarCategoria = async (id, datos) => adminApi.put(`/categories/${id}`, datos);
export const eliminarCategoria = async (id) => adminApi.delete(`/categories/${id}`);
