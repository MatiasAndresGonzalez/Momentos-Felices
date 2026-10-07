// AdminUsuarios.jsx - CRUD de usuarios administrativos con control de roles.
//
// Los OPERADORES pueden consultar la tabla.
// Los ADMIN pueden crear, editar y eliminar usuarios administrativos.

import { useEffect, useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import {
  listarAdministradores,
  listarRolesAdmin,
  crearAdministrador,
  actualizarAdministrador,
  eliminarAdministrador,
} from "../../services/adminService.js";

const formularioInicial = {
  nombre: "",
  email: "",
  password: "",
  idRol: "",
};

function AdminUsuarios() {
  const { accesoTotal, admin } = useAdminAuth();

  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [modoFormulario, setModoFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(formularioInicial);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError("");

      const dataUsuarios = await listarAdministradores();
      setUsuarios(dataUsuarios || []);

      if (accesoTotal) {
        const dataRoles = await listarRolesAdmin();
        setRoles(dataRoles || []);
      }
    } catch (err) {
      console.error("Error al cargar administradores:", err);
      setError(err.message || "Error al cargar los datos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [accesoTotal]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const iniciarCreacion = () => {
    setEditandoId(null);
    setForm(formularioInicial);
    setModoFormulario(true);
    setError("");
    setMensaje("");
  };

  const iniciarEdicion = (usuario) => {
    setEditandoId(usuario.id);

    setForm({
      nombre: usuario.nombre || "",
      email: usuario.email || "",
      password: "",
      idRol: usuario.idRol || "",
    });

    setModoFormulario(true);
    setError("");
    setMensaje("");
  };

  const cancelarFormulario = () => {
    setModoFormulario(false);
    setEditandoId(null);
    setForm(formularioInicial);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMensaje("");

    if (!form.nombre.trim() || !form.email.trim() || !form.idRol) {
      setError("Nombre, email y rol son obligatorios.");
      return;
    }

    if (!editandoId && !form.password.trim()) {
      setError("La contraseña es obligatoria al crear un usuario.");
      return;
    }

    try {
      const datos = {
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        idRol: form.idRol,
      };

      if (form.password.trim()) {
        datos.password = form.password.trim();
      }

      if (editandoId) {
        await actualizarAdministrador(editandoId, datos);
        setMensaje("Usuario actualizado correctamente.");
      } else {
        await crearAdministrador({
          ...datos,
          password: form.password.trim(),
        });
        setMensaje("Usuario creado correctamente.");
      }

      setModoFormulario(false);
      setEditandoId(null);
      setForm(formularioInicial);

      try {
        await cargarDatos();
      } catch {
      }
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      setError(err.message || "Error al guardar el usuario.");
    }
  };

  const handleEliminar = async (id) => {
    if (id === admin?.id) {
      setError("No podés eliminar tu propio usuario.");
      setMensaje("");
      return;
    }

    if (!confirm("¿Estás seguro de que querés eliminar este usuario?")) {
      return;
    }

    setError("");
    setMensaje("");

    try {
      await eliminarAdministrador(id);
      setMensaje("Usuario eliminado correctamente.");

      try {
        await cargarDatos();
      } catch {
      }
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      setError(err.message || "Error al eliminar el usuario.");
    }
  };

  if (cargando) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm font-medium text-slate-400">
          Cargando administradores...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Administradores</h2>

          <p className="text-sm text-slate-400">
            {accesoTotal
              ? "Gestioná los usuarios del panel y asigná roles."
              : "Vista de solo lectura del listado de usuarios."}
          </p>
        </div>

        {accesoTotal && !modoFormulario && (
          <button
            onClick={iniciarCreacion}
            className="rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            + Nuevo administrador
          </button>
        )}
      </div>

      {mensaje && (
        <div
          role="status"
          className="rounded-xl border border-emerald-800 bg-emerald-950/40 p-4 text-sm font-medium text-emerald-300"
        >
          {mensaje}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-800 bg-red-950/40 p-4 text-sm font-medium text-red-300"
        >
          {error}
        </div>
      )}

      {modoFormulario && accesoTotal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              cancelarFormulario();
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-slate-100">
                  {editandoId ? "Editar usuario" : "Nuevo usuario"}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  {editandoId
                    ? "Modificá los datos del usuario administrativo."
                    : "Completá los datos para crear un nuevo usuario."}
                </p>
              </div>

              <button
                type="button"
                onClick={cancelarFormulario}
                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
                aria-label="Cerrar"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                
                <div>
                  <label
                    htmlFor="nombre"
                    className="mb-1 block text-sm font-medium text-slate-300"
                  >
                    Nombre *
                  </label>

                  <input
                    id="nombre"
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-sm font-medium text-slate-300"
                  >
                    Email *
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1 block text-sm font-medium text-slate-300"
                  >
                    Contraseña{" "}
                    {editandoId ? "(dejar vacía para no cambiar)" : "*"}
                  </label>

                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    required={!editandoId}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="idRol"
                    className="mb-1 block text-sm font-medium text-slate-300"
                  >
                    Rol *
                  </label>

                  <select
                    id="idRol"
                    name="idRol"
                    value={form.idRol}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    required
                  >
                    <option value="">Seleccionar rol</option>

                    {roles.map((rol) => (
                      <option key={rol.id} value={rol.id}>
                        {rol.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={cancelarFormulario}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-slate-100"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                  {editandoId ? "Guardar cambios" : "Crear usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
        <table className="w-full min-w-190 text-sm">
          <thead className="bg-slate-800/70">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">
                ID
              </th>

              <th className="px-4 py-3 text-left font-semibold text-slate-300">
                Nombre
              </th>

              <th className="px-4 py-3 text-left font-semibold text-slate-300">
                Email
              </th>

              <th className="px-4 py-3 text-left font-semibold text-slate-300">
                Rol
              </th>

              {accesoTotal && (
                <th className="px-4 py-3 text-right font-semibold text-slate-300">
                  Acciones
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {usuarios.length === 0 ? (
              <tr>
                <td
                  colSpan={accesoTotal ? 6 : 5}
                  className="px-4 py-10 text-center text-slate-500"
                >
                  No hay usuarios registrados.
                </td>
              </tr>
            ) : (
              usuarios.map((u) => (
                <tr key={u.id} className="transition hover:bg-slate-800/50">
                  <td className="px-4 py-3 text-slate-500">{u.id}</td>

                  <td className="px-4 py-3 font-medium text-slate-100">
                    {u.nombre}
                  </td>

                  <td className="px-4 py-3 text-slate-400">{u.email}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${
                        u.rol?.nombre === "SUPERADMIN"
                          ? "bg-cyan-950 text-cyan-300"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {u.rol?.nombre || "-"}
                    </span>
                  </td>

                  {accesoTotal && (
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => iniciarEdicion(u)}
                        className="mr-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-cyan-400 transition hover:bg-cyan-950/50 hover:text-cyan-300"
                      >
                        Editar
                      </button>

                      {u.id !== admin?.id && (
                        <button
                          onClick={() => handleEliminar(u.id)}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-950/50 hover:text-red-300"
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsuarios;
