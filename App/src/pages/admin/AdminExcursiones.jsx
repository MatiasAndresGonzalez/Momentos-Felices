import { useEffect, useState } from "react";

import {
  listarExcursiones,
  listarCategorias,
  crearExcursion,
  actualizarExcursion,
  eliminarExcursion,
} from "../../services/adminService";

const AdminExcursiones = () => {
  const [excursiones, setExcursiones] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    fecha: "",
    ubicacion: "",
    duracion: "",
    cupos: "",
    imagen: "",
    idCategoria: "",
  });

  const cargarExcursiones = async () => {
    try {
      setCargando(true);

      const respuesta = await listarExcursiones();

      setExcursiones(Array.isArray(respuesta) ? respuesta : []);
    } catch (error) {
      console.error("Error al cargar excursiones:", error);
      setMensaje(error.message || "Error al cargar las excursiones");
      setMensaje("");
    } finally {
      setCargando(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      const respuesta = await listarCategorias();
      setCategorias(Array.isArray(respuesta) ? respuesta : []);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      setMensaje(error.message || "Error al cargar las categorías");
    }
  };

  useEffect(() => {
    cargarExcursiones();
    cargarCategorias();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((formAnterior) => ({
      ...formAnterior,
      [name]: value,
    }));
  };

  const limpiarFormulario = () => {
    setForm({
      nombre: "",
      descripcion: "",
      precio: "",
      fecha: "",
      ubicacion: "",
      duracion: "",
      cupos: "",
      imagen: "",
      idCategoria: "",
    });

    setEditandoId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const datos = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: Number(form.precio),
      fecha: form.fecha,
      ubicacion: form.ubicacion,
      duracion: form.duracion || null,
      cupos: form.cupos ? Number(form.cupos) : null,
      imagen: {
        url: form.imagen,
      },
      idCategoria: form.idCategoria
        ? Number(form.idCategoria)
        : null,
    };

    try {
      if (editandoId) {
        await actualizarExcursion(editandoId, datos);
        setMensaje("Excursión actualizada correctamente.");
      } else {
        await crearExcursion(datos);
        setMensaje("Excursión creada correctamente.");
      }

      limpiarFormulario();
      await cargarExcursiones();
    } catch (error) {
      console.error("Error al guardar excursión:", error);
      setMensaje(error.message || "Error al guardar la excursión");
    }
  };

  const handleEditar = (excursion) => {
    setEditandoId(excursion.id);

    setForm({
      nombre: excursion.nombre || "",
      descripcion: excursion.descripcion || "",
      precio: excursion.precio || "",
      fecha: excursion.fecha
        ? excursion.fecha.substring(0, 10)
        : "",
      ubicacion: excursion.ubicacion || "",
      duracion: excursion.duracion || "",
      cupos: excursion.cupos || "",
      imagen: excursion.imagen?.url || "",
      idCategoria: excursion.idCategoria || "",
    });

    setMensaje("");
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar esta excursión?"
    );

    if (!confirmar) return;

    try {
      await eliminarExcursion(id);

      setMensaje("Excursión eliminada correctamente.");

      await cargarExcursiones();
    } catch (error) {
      console.error("Error al eliminar excursión:", error);
      setMensaje(error.message || "Error al eliminar la excursión");
    }
  };

  if (cargando) {
    return (
      <div className="p-8 text-slate-300">
        Cargando excursiones...
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 text-slate-100">

      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
          Gestión de contenido
        </p>

        <h1 className="mt-2 text-3xl font-bold text-white">
          Excursiones
        </h1>

        <p className="mt-2 text-slate-400">
          Creá, editá y administrá las excursiones de Descubre Córdoba.
        </p>
      </div>

      {mensaje && (
        <div className="mb-6 rounded-xl border border-cyan-800 bg-cyan-950/40 px-4 py-3 text-sm text-cyan-100">
          {mensaje}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mb-10 rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl"
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              {editandoId ? "Editar excursión" : "Nueva excursión"}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Completá los datos de la excursión.
            </p>
          </div>

          {editandoId && (
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
              Editando ID {editandoId}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-300">
              Nombre
            </label>

            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Camino de los Gigantes"
              required
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-300">
              Precio
            </label>

            <input
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="Ej: 25000"
              required
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-300">
              Descripción
            </label>

            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Contá brevemente de qué se trata la excursión."
              required
              className="min-h-28 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-300">
              Fecha
            </label>

            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              required
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-300">
              Ubicación
            </label>

            <input
              type="text"
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
              placeholder="Ej: La Cumbrecita"
              required
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-300">
              Duración
            </label>

            <input
              type="text"
              name="duracion"
              value={form.duracion}
              onChange={handleChange}
              placeholder="Ej: 4 horas"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-300">
              Cupos
            </label>

            <input
              type="number"
              name="cupos"
              value={form.cupos}
              onChange={handleChange}
              min="0"
              placeholder="Ej: 20"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-300">
              URL de imagen
            </label>

            <input
              type="text"
              name="imagen"
              value={form.imagen}
              onChange={handleChange}
              placeholder="https://..."
              required
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-300">
              Categoría
            </label>

            <select
              name="idCategoria"
              value={form.idCategoria}
              onChange={handleChange}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
            >
              <option value="">Sin categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-xl bg-cyan-600 px-5 py-3 font-semibold text-white transition hover:bg-cyan-500"
          >
            {editandoId
              ? "Guardar cambios"
              : "Crear excursión"}
          </button>

          {editandoId && (
            <button
              type="button"
              onClick={limpiarFormulario}
              className="rounded-xl border border-slate-600 bg-slate-800 px-5 py-3 font-semibold text-white transition hover:bg-slate-700"
            >
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Excursiones cargadas
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Total: {excursiones.length}
            </p>
          </div>
        </div>

        {excursiones.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/70 p-10 text-center">
            <p className="text-lg font-semibold text-white">
              No hay excursiones cargadas
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Usá el formulario de arriba para crear la primera.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {excursiones.map((excursion) => (
              <article
                key={excursion.id}
                className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg"
              >
                <div className="flex flex-col justify-between gap-5 md:flex-row">

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-white">
                        {excursion.nombre}
                      </h3>

                      <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                        ID {excursion.id}
                      </span>
                    </div>

                    <p className="mt-3 max-w-3xl text-slate-300">
                      {excursion.descripcion}
                    </p>

                    <div className="mt-5 grid gap-3 text-sm text-slate-300 sm:grid-cols-2 lg:grid-cols-3">
                      <p>
                        <span className="font-semibold text-white">
                          Precio:
                        </span>{" "}
                        ${excursion.precio}
                      </p>

                      <p>
                        <span className="font-semibold text-white">
                          Ubicación:
                        </span>{" "}
                        {excursion.ubicacion}
                      </p>

                      <p>
                        <span className="font-semibold text-white">
                          Fecha:
                        </span>{" "}
                        {excursion.fecha
                          ? excursion.fecha.substring(0, 10)
                          : "Sin fecha"}
                      </p>

                      <p>
                        <span className="font-semibold text-white">
                          Duración:
                        </span>{" "}
                        {excursion.duracion || "Sin especificar"}
                      </p>

                      <p>
                        <span className="font-semibold text-white">
                          Cupos:
                        </span>{" "}
                        {excursion.cupos ?? "Sin especificar"}
                      </p>

                      <p>
                        <span className="font-semibold text-white">
                          Categoría:
                        </span>{" "}
                        {categorias.find(
                          (categoria) => categoria.id === excursion.idCategoria
                        )?.nombre || "Sin categoría"}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-3 md:flex-col">
                    <button
                      onClick={() => handleEditar(excursion)}
                      className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-500"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleEliminar(excursion.id)}
                      className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-500"
                    >
                      Eliminar
                    </button>
                  </div>

                </div>
              </article>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default AdminExcursiones;