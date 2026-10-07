// Perfil.jsx
// Página protegida del usuario autenticado.
//
// Al entrar:
// GET /auth/usuario/perfil
//
// Para guardar cambios:
// PUT /auth/usuario/perfil
//
// El token JWT se agrega automáticamente desde api.js.

import {
  useEffect,
  useState,
} from 'react';

import { useAuth } from '../context/AuthContext.jsx';

import {
  obtenerPerfilUsuario,
  actualizarPerfilUsuario,
} from '../services/authService.js';


function Perfil() {

  // Del AuthContext usamos actualizarUsuario
  // para mantener sincronizado el usuario global.
  const {
    actualizarUsuario,
  } = useAuth();


  // ========================================================
  // ESTADO DEL FORMULARIO
  // ========================================================

  const [formulario, setFormulario] =
    useState({
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      contrasenia: '',
    });


  // Estados auxiliares.
  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [error, setError] =
    useState('');

  const [mensaje, setMensaje] =
    useState('');


  // ========================================================
  // CARGAR PERFIL
  // ========================================================

  useEffect(() => {

    const cargarPerfil = async () => {

      try {

        setError('');

        // Llamamos:
        //
        // GET /auth/usuario/perfil
        //
        // El backend devuelve:
        //
        // {
        //   estado: true,
        //   data: {...}
        // }
        const respuesta =
          await obtenerPerfilUsuario();


        // IMPORTANTE:
        // perfil devuelve "data"
        // y no "usuario".
        const datos =
          respuesta.data;


        setFormulario({
          nombre: datos.nombre || '',
          apellido: datos.apellido || '',
          email: datos.email || '',
          telefono: datos.telefono || '',
          contrasenia: '',
        });


        // También actualizamos AuthContext.
        actualizarUsuario(datos);

      } catch (err) {

        setError(
          err.response?.data?.mensaje ||
          err.message ||
          'No se pudo cargar el perfil.'
        );

      } finally {

        setCargando(false);
      }
    };


    cargarPerfil();

  }, []);


  // ========================================================
  // CAMBIOS EN LOS INPUTS
  // ========================================================

  const handleChange = (e) => {

    setFormulario({
      ...formulario,
      [e.target.name]:
        e.target.value,
    });
  };


  // ========================================================
  // GUARDAR CAMBIOS
  // ========================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');
    setMensaje('');

    try {

      setGuardando(true);


      // Armamos los datos que vamos a enviar.
      const datosEnviar = {

        nombre:
          formulario.nombre,

        apellido:
          formulario.apellido,

        email:
          formulario.email,

        telefono:
          formulario.telefono,
      };


      // La contraseña es opcional.
      //
      // Si está vacía NO la enviamos.
      // Así el backend no modifica
      // la contraseña actual.
      if (
        formulario.contrasenia.trim() !== ''
      ) {

        datosEnviar.contrasenia =
          formulario.contrasenia;
      }


      // Llamamos:
      //
      // PUT /auth/usuario/perfil
      const respuesta =
        await actualizarPerfilUsuario(
          datosEnviar
        );


      // El backend devuelve:
      //
      // {
      //   estado: true,
      //   mensaje: "...",
      //   usuario: {...}
      // }

      const usuarioActualizado =
        respuesta.usuario;


      // Actualizamos AuthContext.
      actualizarUsuario(
        usuarioActualizado
      );


      // Dejamos vacío el campo contraseña.
      setFormulario((anterior) => ({
        ...anterior,
        contrasenia: '',
      }));


      setMensaje(
        respuesta.mensaje ||
        'Perfil actualizado correctamente.'
      );

    } catch (err) {

      setError(
        err.response?.data?.mensaje ||
        err.message ||
        'No se pudo actualizar el perfil.'
      );

    } finally {

      setGuardando(false);
    }
  };


  // ========================================================
  // CARGANDO
  // ========================================================

  if (cargando) {

    return (
      <section className="flex min-h-screen items-center justify-center bg-neutral-100">

        <p className="text-sm text-neutral-500">
          Cargando perfil...
        </p>

      </section>
    );
  }


  // ========================================================
  // VISTA
  // ========================================================

  return (
    <section className="min-h-screen bg-neutral-100 px-5 pb-16 pt-28">

      <div className="mx-auto max-w-2xl">

        {/* ENCABEZADO */}
        <div className="mb-7">

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
            Mi cuenta
          </p>

          <h1 className="mt-2 text-3xl font-black text-neutral-900">
            Mi perfil
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Consultá y actualizá tus datos personales.
          </p>

        </div>


        {/* MENSAJE CORRECTO */}
        {mensaje && (

          <div className="mb-4 rounded-xl bg-green-50 p-4 text-sm text-green-700">
            {mensaje}
          </div>

        )}


        {/* ERROR */}
        {error && (

          <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>

        )}


        {/* FORMULARIO */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-lg sm:p-8"
        >

          <div className="grid gap-4 sm:grid-cols-2">

            {/* NOMBRE */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-neutral-700">
                Nombre
              </label>

              <input
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={handleChange}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-orange-500"
              />

            </div>


            {/* APELLIDO */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-neutral-700">
                Apellido
              </label>

              <input
                type="text"
                name="apellido"
                value={formulario.apellido}
                onChange={handleChange}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-orange-500"
              />

            </div>


            {/* EMAIL */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-neutral-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formulario.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-orange-500"
              />

            </div>


            {/* TELÉFONO */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-neutral-700">
                Teléfono
              </label>

              <input
                type="text"
                name="telefono"
                value={formulario.telefono}
                onChange={handleChange}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-orange-500"
              />

            </div>

          </div>


          {/* NUEVA CONTRASEÑA */}
          <div className="mt-4">

            <label className="mb-2 block text-sm font-semibold text-neutral-700">
              Nueva contraseña
            </label>

            <input
              type="password"
              name="contrasenia"
              value={formulario.contrasenia}
              onChange={handleChange}
              placeholder="Dejá vacío si no querés cambiarla"
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-orange-500"
            />

          </div>


          {/* BOTÓN */}
          <button
            type="submit"
            disabled={guardando}
            className="mt-6 w-full rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {guardando
              ? 'Guardando...'
              : 'Guardar cambios'}

          </button>

        </form>

      </div>

    </section>
  );
}

export default Perfil;