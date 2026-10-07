import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarProductosPublicos } from "../services/productService.js";
import { agregarAlCarrito } from "../services/carritoService.js";

const imagenesProductos = {
  "Mamadera Anticólicos 250 ml": "/images/products/mamadera.svg",
  "Set de Cubiertos Infantil": "/images/products/cubiertos.svg",
  "Babero Impermeable": "/images/products/babero.svg",
  "Kit Higiene Recién Nacido": "/images/products/kit-higiene.svg",
  "Toalla con Capucha": "/images/products/toalla.svg",
  "Body Manga Corta Algodón": "/images/products/body.svg",
  "Pijama Enterito Suave": "/images/products/pijama.svg",
  "Manta de Apego": "/images/products/manta.svg",
  "Sonajero de Madera": "/images/products/sonajero.svg",
  "Set de Regalo Bienvenido Bebé": "/images/products/regalo.svg",
};
const categorias = [
  { nombre: "Alimentación", icono: "🍼", texto: "Todo para las primeras comidas y momentos." },
  { nombre: "Higiene", icono: "🛁", texto: "Cuidado diario para tu bebé." },
  { nombre: "Ropa", icono: "👕", texto: "Prendas cómodas para cada etapa." },
  { nombre: "Regalos", icono: "🎁", texto: "Detalles especiales para regalar." },
];

function Inicio() {
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    listarProductosPublicos({ page: 1, limit: 4, sortBy: "name", order: "ASC" })
      .then((data) => setProductos(data.productos || []))
      .catch(() => setProductos([]));
  }, []);

  const agregar = (producto) => {
    agregarAlCarrito(producto, 1);
    setMensaje(`“${producto.name}” se agregó al carrito.`);
    setTimeout(() => setMensaje(""), 2500);
  };

  return (
    <div className="space-y-16 pb-10">
      <section className="relative overflow-hidden rounded-3xl bg-[#F3E7D3] px-6 py-16 text-[#3F352A] sm:px-10 sm:py-20 lg:px-16">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#8B6F47]/20 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#9A7B52]">Momentos Felices</p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">Todo lo que necesitás para acompañar<span className="block text-[#8B6F47]">cada momento.</span></h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#6E5C49] sm:text-lg">Productos seleccionados para bebés, niños y familias. Encontrá lo que buscás de forma simple, rápida y segura.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/productos" className="rounded-xl bg-[#8B6F47] px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-[#765C39]">Ver catálogo</Link>
            <Link to="/registro" className="rounded-xl border border-white/30 px-6 py-3 text-center text-sm font-bold transition hover:bg-white hover:text-slate-950">Crear una cuenta</Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-7"><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8B6F47]">Encontrá lo que necesitás</p><h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-[#3F352A]">Categorías</h2></div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categorias.map((categoria) => (
            <Link key={categoria.nombre} to={"/productos?category=" + encodeURIComponent(categoria.nombre)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#D9C2A6] hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
              <span className="text-4xl">{categoria.icono}</span><h3 className="mt-4 font-bold text-slate-900 dark:text-[#3F352A]">{categoria.nombre}</h3><p className="mt-2 text-sm leading-5 text-slate-500 dark:text-slate-400">{categoria.texto}</p>
            </Link>
          ))}
        </div>
      </section>

      {mensaje && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{mensaje}</div>}

      <section>
        <div className="mb-7 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8B6F47]">Selección especial</p><h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-[#3F352A]">Productos destacados</h2></div><Link to="/productos" className="hidden text-sm font-bold text-[#8B6F47] hover:text-[#765C39] sm:block">Ver todo →</Link></div>
        {productos.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {productos.map((producto) => (
              <article key={producto.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <img src={imagenesProductos[producto.name] || producto.image || "/images/products/regalo.svg"} alt={producto.name} className="h-48 w-full object-cover" />
                <div className="p-4"><p className="text-xs font-semibold uppercase tracking-wide text-[#8B6F47]">{producto.category}</p><h3 className="mt-2 font-bold text-slate-900 dark:text-[#3F352A]">{producto.name}</h3><p className="mt-3 text-lg font-black text-slate-900 dark:text-[#3F352A]">$ {producto.price}</p><button type="button" disabled={Number(producto.stock) <= 0} onClick={() => agregar(producto)} className="mt-4 w-full rounded-xl bg-[#8B6F47] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#765C39] disabled:bg-slate-300">Agregar al carrito</button></div>
              </article>
            ))}
          </div>
        ) : <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700">Próximamente vas a encontrar nuestros productos destacados.</div>}
      </section>

      <section className="rounded-3xl border border-[#E8D8C3] bg-[#FFF8E7] p-7 dark:border-[#D9C2A6] dark:bg-[#F3E7D3] sm:p-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center"><div><h2 className="text-2xl font-black text-slate-900 dark:text-[#3F352A]">¿Buscás algo en particular?</h2><p className="mt-2 text-sm text-slate-600 dark:text-[#6E5C49]">Explorá todo nuestro catálogo y encontrá el producto ideal.</p></div><Link to="/productos" className="rounded-xl bg-[#8B6F47] px-6 py-3 text-sm font-bold text-white hover:bg-[#765C39]">Explorar catálogo</Link></div>
      </section>
    </div>
  );
}

export default Inicio;
