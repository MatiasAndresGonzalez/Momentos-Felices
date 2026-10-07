import { Op } from "sequelize";
import Product from "../models/product.model.js";

export const listarProductos = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 5, 1), 100);
    const search = String(req.query.search || "").trim();
    const category = String(req.query.category || "").trim();
    const sortBy = ["price", "name"].includes(req.query.sortBy) ? req.query.sortBy : "name";
    const order = String(req.query.order || "ASC").toUpperCase() === "DESC" ? "DESC" : "ASC";
    const where = {};
    if (search) where.name = { [Op.like]: "%" + search + "%" };
    if (category) where.category = category;

    const result = await Product.findAndCountAll({
      where,
      order: [[sortBy, order]],
      limit,
      offset: (page - 1) * limit,
    });

    const pagination = {
      page,
      limit,
      total: result.count,
      totalPages: Math.max(Math.ceil(result.count / limit), 1),
    };

    res.json({
      estado: true,
      data: { rows: result.rows, pagination },
      rows: result.rows,
      pagination,
    });
  } catch (error) {
    res.status(500).json({ estado: false, mensaje: "Error al listar productos", error: error.message });
  }
};

export const obtenerProducto = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ estado: false, mensaje: "Producto no encontrado" });
    res.json({ estado: true, data: product });
  } catch (error) {
    res.status(500).json({ estado: false, mensaje: "Error al obtener producto", error: error.message });
  }
};

export const crearProducto = async (req, res) => {
  try {
    const { name, price, stock, category, image } = req.body;
    if (!name || price === undefined || stock === undefined || !category) {
      return res.status(400).json({ estado: false, mensaje: "name, price, stock y category son obligatorios" });
    }
    const product = await Product.create({ name, price, stock, category, image });
    res.status(201).json({ estado: true, data: product });
  } catch (error) {
    res.status(400).json({ estado: false, mensaje: "Error al crear producto", error: error.message });
  }
};

export const actualizarProducto = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ estado: false, mensaje: "Producto no encontrado" });
    const { name, price, stock, category, image } = req.body;
    await product.update({ name, price, stock, category, image });
    res.json({ estado: true, data: product });
  } catch (error) {
    res.status(400).json({ estado: false, mensaje: "Error al actualizar producto", error: error.message });
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ estado: false, mensaje: "Producto no encontrado" });
    await product.destroy();
    res.json({ estado: true, mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ estado: false, mensaje: "Error al eliminar producto", error: error.message });
  }
};
