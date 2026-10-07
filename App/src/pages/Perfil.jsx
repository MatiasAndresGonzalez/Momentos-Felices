import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  obtenerPerfilUsuario,
  actualizarPerfilUsuario,
} from "../services/authServices.js";

function Perfil() {
  const { actualizarUsuario } = useAuth();

  const [formulario, setFormulario] = useState({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
  });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        setError("");
        const respuesta = await obtenerPerfilUsuario();
        const datos = respuesta?.data || respuesta;

        setFormulario({
          nombre: datos?.nombre || "",
          email: datos?.email || "",
          telefono: datos?.telefono || "",
          password: "",
        });

        if (datos) actualizarUsuario(datos);
      } catch (err) {
        setError(
          err.response?.data?.mensaje ||
            err.message ||
            "No se pudo cargar el perfil."
        );
      } finally {
        setCargando(false);
      }
    };

    cargarPerfil();
  }, [actualizarUsuario]);

  const handleChange = (e) => {
    setFormulario((anterior) => ({
      ...anterior,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    try {
      setGuardando(true);

      const datosEnviar = {
        nombre: formulario.nombre.trim(),
        email: formulario.email.trim(),
        telefono: formulario.telefono.trim(),
      };

      if (formulario.password.trim()) {
        datosEnviar.password = formulario.password.trim();
      }

      const respuesta = await actualizarPerfilUsuario(datosEnviar);
      const usuarioActualizado =
        respuesta?.cliente || respuesta?.usuario || respuesta?.data || respuesta;

      actualizarUsuario(usuarioActualizado);

      setFormulario((anterior) => ({
        ...anterior,
        password: "",
      }));

      setMensaje(
        respuesta?.mensaje || "Perfil actualizado correctamente."
      );
    } catch (err) {
      setError(
        err.response?.data?.mensaje ||
          err.message ||
          "No se pudo actualizar el perfil."
      );
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-slate-500">Cargando perfil...</p>
      </section>
    );
  }

  return (
    <section className="pt-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8B6F47]">
            Mi cuenta
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
            Mi perfil
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Consultá y actualizá tus datos personales.
          </p>
        </div>

        {mensaje && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {mensaje}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-lg dark:border dark:border-slate-800 dark:bg-slate-900 sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-[#8B6F47] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formulario.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-[#8B6F47] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Teléfono
              </label>
              <input
                type="text"
                name="telefono"
                value={formulario.telefono}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-[#8B6F47] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Nueva contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formulario.password}
              onChange={handleChange}
              placeholder="Dejá vacío si no querés cambiarla"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-[#8B6F47] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={guardando}
            className="mt-6 w-full rounded-xl bg-[#8B6F47] py-3 font-semibold text-white transition hover:bg-[#765C39] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Perfil;
