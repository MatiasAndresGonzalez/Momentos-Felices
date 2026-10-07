import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listarProductosPublicos } from "../services/productService.js";
import { agregarAlCarrito } from "../services/carritoService.js";

const categoriasIniciales = ["Alimentación", "Higiene", "Ropa", "Regalos"];

function Productos() {
  const [searchParams] = useSearchParams();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState(categoriasIniciales);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState(searchParams.get("category") || "");
  const [orden, setOrden] = useState("name-ASC");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const categoriaUrl = searchParams.get("category") || "";
    setCategoria(categoriaUrl);
    setPagina(1);
  }, [searchParams]);

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      setError("");
      try {
        const [campo, direccion] = orden.split("-");
        const data = await listarProductosPublicos({
          page: pagina,
          limit: 12,
          search: busqueda,
          category: categoria,
          sortBy: campo,
          order: direccion,
        });
        setProductos(data.productos || []);
        setTotalPaginas(data.totalPages || 1);
        const nuevas = data.productos.map((p) => p.category).filter(Boolean);
        setCategorias((actuales) => [...new Set([...actuales, ...nuevas])].sort());
      } catch (err) {
        setError(err.message || "No se pudieron cargar los productos.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [pagina, busqueda, categoria, orden]);

  const cambiarBusqueda = (event) => {
    setBusqueda(event.target.value);
    setPagina(1);
  };

  const cambiarCategoria = (event) => {
    setCategoria(event.target.value);
    setPagina(1);
  };

  const agregar = (producto) => {
    agregarAlCarrito(producto, 1);
    setMensaje(`“${producto.name}” se agregó al carrito.`);
    setTimeout(() => setMensaje(""), 2500);
  };

  return (
    <section className="space-y-8">
      <header className="rounded-3xl bg-orange-50 px-5 py-8 dark:bg-orange-950/20 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500">Momentos Felices</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">Todo para acompañar cada momento</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">Descubrí productos pensados para bebés, niños y para regalar.</p>
      </header>

      {mensaje && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{mensaje}</div>}

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-3">
        <input type="search" value={busqueda} onChange={cambiarBusqueda} placeholder="Buscar productos..." className="rounded-xl border border-slate-300 bg-transparent px-4 py-3 text-sm outline-none focus:border-orange-500 dark:border-slate-700" />
        <select value={categoria} onChange={cambiarCategoria} className="rounded-xl border border-slate-300 bg-transparent px-4 py-3 text-sm outline-none focus:border-orange-500 dark:border-slate-700">
          <option value="">Todas las categorías</option>
          {categorias.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={orden} onChange={(event) => { setOrden(event.target.value); setPagina(1); }} className="rounded-xl border border-slate-300 bg-transparent px-4 py-3 text-sm outline-none focus:border-orange-500 dark:border-slate-700">
          <option value="name-ASC">Nombre A-Z</option>
          <option value="name-DESC">Nombre Z-A</option>
          <option value="price-ASC">Precio menor a mayor</option>
          <option value="price-DESC">Precio mayor a menor</option>
        </select>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {cargando ? <div className="py-16 text-center text-slate-500">Cargando productos...</div> : productos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
          <p className="font-semibold">No encontramos productos.</p>
          <p className="mt-1 text-sm text-slate-500">Probá cambiando los filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productos.map((producto) => (
            <article key={producto.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              {producto.image ? <img src={producto.image} alt={producto.name} className="h-52 w-full object-cover" /> : <div className="flex h-52 items-center justify-center bg-orange-50 text-4xl dark:bg-orange-950/20">🍼</div>}
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">{producto.category}</p>
                <h2 className="mt-2 min-h-12 font-bold text-slate-900 dark:text-white">{producto.name}</h2>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xl font-black text-slate-900 dark:text-white">$ {producto.price}</p>
                    <span className="text-xs text-slate-500">{producto.stock > 0 ? `Stock: ${producto.stock}` : "Sin stock"}</span>
                  </div>
                  <button type="button" disabled={Number(producto.stock) <= 0} onClick={() => agregar(producto)} className="rounded-xl bg-orange-500 px-3 py-2 text-sm font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300">
                    Agregar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {!cargando && totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-3 pb-8">
          <button type="button" disabled={pagina === 1} onClick={() => setPagina((p) => p - 1)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm disabled:opacity-40 dark:border-slate-700">Anterior</button>
          <span className="text-sm font-semibold">Página {pagina} de {totalPaginas}</span>
          <button type="button" disabled={pagina === totalPaginas} onClick={() => setPagina((p) => p + 1)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm disabled:opacity-40 dark:border-slate-700">Siguiente</button>
        </div>
      )}
    </section>
  );
}

export default Productos;
