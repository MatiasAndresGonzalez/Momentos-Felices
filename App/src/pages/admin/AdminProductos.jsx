import { useEffect, useState } from "react";
import {
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../../services/adminService.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { listarCategoriasAdmin } from "../../services/adminCategoryService.js";

const inicial = { name: "", price: "", stock: "", category: "", image: "" };

function AdminProductos() {
  const { accesoGestor } = useAdminAuth();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState(inicial);
  const [editando, setEditando] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("ASC");
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const cargarCategorias = async () => {
    try {
      const data = await listarCategoriasAdmin();
      setCategorias(Array.isArray(data) ? data : []);
    } catch {
      setCategorias([]);
    }
  };

  const cargar = async () => {
    setCargando(true);
    try {
      const data = await listarProductos({ page: pagina, limit: 8, search, category, sortBy, order });
      const rows = data?.rows || data?.productos || data || [];
      setProductos(Array.isArray(rows) ? rows : []);
      setTotalPaginas(data?.pagination?.totalPages || data?.totalPages || 1);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los productos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarCategorias(); }, []);
  useEffect(() => { cargar(); }, [pagina, search, category, sortBy, order]);

  const cambiar = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const guardar = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    try {
      const datos = {
        name: form.name.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category.trim(),
        image: form.image.trim() || null,
      };
      if (editando) {
        await actualizarProducto(editando, datos);
        setMensaje("Producto actualizado correctamente.");
      } else {
        await crearProducto(datos);
        setMensaje("Producto creado correctamente.");
      }
      setForm(inicial);
      setEditando(null);
      await cargar();
    } catch (err) {
      setError(err.message || "No se pudo guardar el producto.");
    }
  };

  const editar = (p) => {
    setEditando(p.id);
    setForm({
      name: p.name || "",
      price: p.price ?? "",
      stock: p.stock ?? "",
      category: p.category || "",
      image: p.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Seguro que querés eliminar este producto?")) return;
    try {
      await eliminarProducto(id);
      setMensaje("Producto eliminado correctamente.");
      await cargar();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el producto.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">Catálogo</p>
        <h2 className="mt-2 text-3xl font-black text-white">Productos</h2>
        <p className="mt-1 text-sm text-slate-400">Administrá el catálogo de Momentos Felices.</p>
      </div>

      {mensaje && <div className="rounded-xl border border-emerald-800 bg-emerald-950/40 p-4 text-sm text-emerald-300">{mensaje}</div>}
      {error && <div className="rounded-xl border border-red-800 bg-red-950/40 p-4 text-sm text-red-300">{error}</div>}

      {accesoGestor && (
        <form onSubmit={guardar} className="rounded-2xl border border-slate-700 bg-slate-900 p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">{editando ? "Editar producto" : "Nuevo producto"}</h3>
            {editando && <button type="button" onClick={() => { setEditando(null); setForm(inicial); }} className="text-sm text-slate-400 hover:text-white">Cancelar</button>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["name", "Nombre", "text"],
              ["price", "Precio", "number"],
              ["stock", "Stock", "number"],
              ["image", "URL de imagen", "url"],
              ].map(([name, label, type]) => (
              <label key={name} className={name === "image" ? "sm:col-span-2" : "block"}>
                <span className="mb-2 block text-sm font-semibold text-slate-300">{label}</span>
                <input
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={cambiar}
                  required={name !== "image"}
                  min={name === "price" || name === "stock" ? "0" : undefined}
                  step={name === "price" ? "0.01" : undefined}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </label>
            ))}
          </div>
          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-semibold text-slate-300">Categoría</span>
            <select name="category" value={form.category} onChange={cambiar} required className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500">
              <option value="">Seleccioná una categoría</option>
              {categorias.map((categoria) => <option key={categoria.id} value={categoria.name}>{categoria.name}</option>)}
            </select>
          </label>
          <button type="submit" className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700">
            {editando ? "Guardar cambios" : "Crear producto"}
          </button>
        </form>
      )}

      <div className="grid gap-3 rounded-2xl border border-slate-700 bg-slate-900 p-4 sm:grid-cols-4">
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPagina(1); }} placeholder="Buscar..." className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500" />
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPagina(1); }} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"><option value="">Todas las categorías</option>{categorias.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}</select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
          <option value="name">Nombre</option>
          <option value="price">Precio</option>
        </select>
        <select value={order} onChange={(e) => setOrder(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
          <option value="ASC">Ascendente</option>
          <option value="DESC">Descendente</option>
        </select>
      </div>

      {cargando ? <p className="py-10 text-center text-slate-400">Cargando productos...</p> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productos.map((p) => (
            <article key={p.id} className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
              {p.image ? <img src={p.image} alt={p.name} className="h-40 w-full object-cover" /> : <div className="flex h-40 items-center justify-center bg-slate-800 text-4xl">🍼</div>}
              <div className="p-4">
                <p className="text-xs font-semibold uppercase text-blue-400">{p.category}</p>
                <h3 className="mt-1 font-bold text-white">{p.name}</h3>
                <p className="mt-2 text-lg font-black text-white">$ {p.price}</p>
                <p className="text-xs text-slate-400">Stock: {p.stock}</p>
                {accesoGestor && <div className="mt-4 flex gap-2"><button onClick={() => editar(p)} className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white">Editar</button><button onClick={() => eliminar(p.id)} className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white">Eliminar</button></div>}
              </div>
            </article>
          ))}
        </div>
      )}

      {totalPaginas > 1 && (
        <div className="flex justify-center gap-3 pb-6">
          <button disabled={pagina === 1} onClick={() => setPagina((p) => p - 1)} className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-white disabled:opacity-40">Anterior</button>
          <span className="px-2 py-2 text-sm text-slate-300">Página {pagina} de {totalPaginas}</span>
          <button disabled={pagina === totalPaginas} onClick={() => setPagina((p) => p + 1)} className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-white disabled:opacity-40">Siguiente</button>
        </div>
      )}
    </div>
  );
}

export default AdminProductos;
