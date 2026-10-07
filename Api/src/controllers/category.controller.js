import { Op } from 'sequelize';
import Category from '../models/category.model.js';
import Product from '../models/product.model.js';

export const listarCategorias = async (req, res) => {
  try {
    const search = String(req.query.search || '').trim();
    const where = search ? { name: { [Op.like]: `%${search}%` } } : {};
    const data = await Category.findAll({ where, order: [['name', 'ASC']] });
    res.json({ estado: true, data });
  } catch (error) {
    res.status(500).json({ estado: false, mensaje: 'Error al listar categorías', error: error.message });
  }
};

export const obtenerCategoria = async (req, res) => {
  try {
    const categoria = await Category.findByPk(req.params.id);
    if (!categoria) return res.status(404).json({ estado: false, mensaje: 'Categoría no encontrada' });
    res.json({ estado: true, data: categoria });
  } catch (error) {
    res.status(500).json({ estado: false, mensaje: 'Error al obtener categoría', error: error.message });
  }
};

export const crearCategoria = async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const description = String(req.body.description || '').trim() || null;
    if (!name) return res.status(400).json({ estado: false, mensaje: 'El nombre de la categoría es obligatorio' });
    const existe = await Category.findOne({ where: { name } });
    if (existe) return res.status(400).json({ estado: false, mensaje: 'La categoría ya existe' });
    const data = await Category.create({ name, description });
    res.status(201).json({ estado: true, mensaje: 'Categoría creada correctamente', data });
  } catch (error) {
    res.status(400).json({ estado: false, mensaje: 'Error al crear categoría', error: error.message });
  }
};

export const actualizarCategoria = async (req, res) => {
  try {
    const categoria = await Category.findByPk(req.params.id);
    if (!categoria) return res.status(404).json({ estado: false, mensaje: 'Categoría no encontrada' });
    const name = String(req.body.name || '').trim();
    const description = String(req.body.description || '').trim() || null;
    if (!name) return res.status(400).json({ estado: false, mensaje: 'El nombre de la categoría es obligatorio' });
    const existe = await Category.findOne({ where: { name } });
    if (existe && existe.id !== categoria.id) return res.status(400).json({ estado: false, mensaje: 'La categoría ya existe' });
    const nombreAnterior = categoria.name;
    await categoria.update({ name, description });
    if (nombreAnterior !== name) {
      await Product.update({ category: name }, { where: { category: nombreAnterior } });
    }
    res.json({ estado: true, mensaje: 'Categoría actualizada correctamente', data: categoria });
  } catch (error) {
    res.status(400).json({ estado: false, mensaje: 'Error al actualizar categoría', error: error.message });
  }
};

export const eliminarCategoria = async (req, res) => {
  try {
    const categoria = await Category.findByPk(req.params.id);
    if (!categoria) return res.status(404).json({ estado: false, mensaje: 'Categoría no encontrada' });
    const productos = await Product.count({ where: { category: categoria.name } });
    if (productos > 0) {
      return res.status(409).json({ estado: false, mensaje: `No se puede eliminar la categoría porque tiene ${productos} producto(s) asociado(s)` });
    }
    await categoria.destroy();
    res.json({ estado: true, mensaje: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ estado: false, mensaje: 'Error al eliminar categoría', error: error.message });
  }
};
