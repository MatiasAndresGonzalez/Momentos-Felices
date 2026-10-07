import { Op } from "sequelize";
import Product from "../models/product.model.js";

const normalizarProducto = ({ name, price, stock, category, image }) => {
  const nombre = String(name ?? "").trim();
  const categoria = String(category ?? "").trim();
  const precio = Number(price);
  const existencia = Number(stock);

  if (!nombre || !categoria) {
    return { error: "name y category son obligatorios" };
  }

  if (!Number.isFinite(precio) || precio < 0) {
    return { error: "price debe ser un número mayor o igual a 0" };
  }

  if (!Number.isInteger(existencia) || existencia < 0) {
    return { error: "stock debe ser un número entero mayor o igual a 0" };
  }

  return {
    data: {
      name: nombre,
      price: precio,
      stock: existencia,
      category: categoria,
      image: image ? String(image).trim() : null,
    },
  };
};

export const listarProductos = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 8, 1), 100);
    const search = String(req.query.search || "").trim();
    const category = String(req.query.category || "").trim();
    const sortBy = ["price", "name"].includes(req.query.sortBy) ? req.query.sortBy : "name";
    const order = String(req.query.order || "ASC").toUpperCase() === "DESC" ? "DESC" : "ASC";

    const where = {};
    if (search) where.name = { [Op.like]: `%${search}%` };
    if (category) where.category = category;

    const result = await Product.findAndCountAll({
      where,
      order: [[sortBy, order]],
      limit,
      offset: (page - 1) * limit,
    });

    const totalPages = Math.ceil(result.count / limit);

    const pagination = {
      page,
      limit,
      total: result.count,
      totalPages,
    };

    res.json({
      estado: true,
      data: { rows: result.rows, pagination },
      rows: result.rows,
      pagination,
    });
  } catch (error) {
    res.status(500).json({
      estado: false,
      mensaje: "Error al listar productos",
      error: error.message,
    });
  }
};

export const obtenerProducto = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        estado: false,
        mensaje: "Producto no encontrado",
      });
    }

    res.json({ estado: true, data: product });
  } catch (error) {
    res.status(500).json({
      estado: false,
      mensaje: "Error al obtener producto",
      error: error.message,
    });
  }
};

export const crearProducto = async (req, res) => {
  try {
    const validacion = normalizarProducto(req.body);

    if (validacion.error) {
      return res.status(400).json({
        estado: false,
        mensaje: validacion.error,
      });
    }

    const product = await Product.create(validacion.data);

    res.status(201).json({
      estado: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      estado: false,
      mensaje: "Error al crear producto",
      error: error.message,
    });
  }
};

export const actualizarProducto = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        estado: false,
        mensaje: "Producto no encontrado",
      });
    }

    const validacion = normalizarProducto(req.body);

    if (validacion.error) {
      return res.status(400).json({
        estado: false,
        mensaje: validacion.error,
      });
    }

    await product.update(validacion.data);

    res.json({
      estado: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      estado: false,
      mensaje: "Error al actualizar producto",
      error: error.message,
    });
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        estado: false,
        mensaje: "Producto no encontrado",
      });
    }

    await product.destroy();

    res.json({
      estado: true,
      mensaje: "Producto eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      estado: false,
      mensaje: "Error al eliminar producto",
      error: error.message,
    });
  }
};
