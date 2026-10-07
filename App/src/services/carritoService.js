const STORAGE_KEY = "momentosFelicesCarrito";

const leer = () => {
  try {
    const datos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
};

const guardar = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  return items;
};

export const obtenerCarrito = () => leer();

export const agregarAlCarrito = (producto, cantidad = 1) => {
  const items = leer();
  const existente = items.find((item) => item.id === producto.id);
  if (existente) {
    existente.cantidad = Math.min(existente.cantidad + cantidad, Number(producto.stock || 999999));
  } else {
    items.push({ producto, cantidad });
  }
  return guardar(items);
};

export const actualizarCantidadItem = (id, cantidad) => {
  const items = leer().map((item) => item.id === id ? { ...item, cantidad } : item);
  return guardar(items);
};

export const eliminarItemCarrito = (id) => guardar(leer().filter((item) => item.id !== id));

export const vaciarCarrito = () => guardar([]);

export const obtenerResumenCarrito = () => {
  const items = leer();
  return {
    items,
    total: items.reduce((total, item) => total + Number(item.producto?.price || 0) * Number(item.cantidad || 0), 0),
  };
};

export const confirmarCompra = () => {
  const items = leer();
  if (!items.length) throw new Error("El carrito está vacío.");
  const compra = { id: Date.now(), items, total: items.reduce((t, item) => t + Number(item.producto?.price || 0) * Number(item.cantidad || 0), 0), fecha: new Date().toISOString() };
  localStorage.setItem("ultimaCompraMomentosFelices", JSON.stringify(compra));
  guardar([]);
  return compra;
};
