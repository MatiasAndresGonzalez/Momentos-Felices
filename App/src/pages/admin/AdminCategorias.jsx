import { useEffect, useState } from "react";
import { listarCategoriasAdmin, crearCategoria, actualizarCategoria, eliminarCategoria } from "../../services/adminCategoryService.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";

const inicial = { name: "", description: "" };

function AdminCategorias() {
  const { accesoGestor } = useAdminAuth();
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState(inicial);
  const [editando, setEditando] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const cargar = async () => {
    setCargando(true);
    try {
      const data = await listarCategoriasAdmin();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "No se pudieron cargar las categorías.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const guardar = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    try {
      if (editando) {
        await actualizarCategoria(editando, form);
        setMensaje("Categoría actualizada correctamente.");
      } else {
        await crearCategoria(form);
        setMensaje("Categoría creada correctamente.");
      }
      setForm(inicial);
      setEditando(null);
      await cargar();
    } catch (err) {
      setError(err.message || "No se pudo guardar la categoría.");
    }
  };

  const editar = (categoria) => {
    setEditando(categoria.id);
    setForm({ name: categoria.name || "", description: categoria.description || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Seguro que querés eliminar esta categoría?")) return;
    setMensaje("");
    setError("");
    try {
      await eliminarCategoria(id);
      setMensaje("Categoría eliminada correctamente.");
      await cargar();
    } catch (err) {
      setError(err.message || "No se pudo eliminar la categoría.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#3B82F6]">Catálogo</p>
        <h2 className="mt-2 text-3xl font-black text-white">Categorías</h2>
        <p className="mt-1 text-sm text-slate-400">Administrá las categorías utilizadas por el catálogo.</p>
      </div>

      {mensaje && <div className="rounded-xl border border-emerald-800 bg-emerald-950/40 p-4 text-sm text-emerald-300">{mensaje}</div>}
      {error && <div className="rounded-xl border border-red-800 bg-red-950/40 p-4 text-sm text-red-300">{error}</div>}

      {accesoGestor && (
        <form onSubmit={guardar} className="rounded-2xl border border-slate-700 bg-slate-900 p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">{editando ? "Editar categoría" : "Nueva categoría"}</h3>
            {editando && <button type="button" onClick={() => { setEditando(null); setForm(inicial); }} className="text-sm text-slate-400 hover:text-white">Cancelar</button>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-300">Nombre</span>
              <input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-[#2563EB]" placeholder="Ej. Alimentación" />
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-300">Descripción</span>
              <input name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-[#2563EB]" placeholder="Descripción de la categoría" />
            </label>
          </div>
          <button type="submit" className="mt-5 rounded-xl bg-[#1D4ED8] px-5 py-3 font-bold text-white hover:bg-[#2563EB]">{editando ? "Guardar cambios" : "Crear categoría"}</button>
        </form>
      )}

      {cargando ? <p className="py-10 text-center text-slate-400">Cargando categorías...</p> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categorias.map((categoria) => (
            <article key={categoria.id} className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#93C5FD]">Categoría</p>
              <h3 className="mt-2 text-xl font-bold text-white">{categoria.name}</h3>
              <p className="mt-2 min-h-10 text-sm text-slate-400">{categoria.description || "Sin descripción."}</p>
              {accesoGestor && <div className="mt-5 flex gap-2">
                <button onClick={() => editar(categoria)} className="flex-1 rounded-lg bg-[#2563EB] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8]">Editar</button>
                <button onClick={() => eliminar(categoria.id)} className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700">Eliminar</button>
              </div>}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminCategorias;
