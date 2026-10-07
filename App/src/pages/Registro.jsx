// Registro.jsx
// Página para registrar un nuevo usuario.
//
// Utiliza registro() del AuthContext,
// que se conecta al backend real y recibe un JWT.
//
// Como el backend devuelve token + usuario,
// después del registro el usuario queda logueado
// automáticamente lo redirecciona a inicio.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Registro() {
  // Permite navegar desde JavaScript.
  const navigate = useNavigate();

  // Traemos la función registro desde AuthContext.
  const { registro } = useAuth();

  // ========================================================
  // ESTADOS DEL FORMULARIO
  // ========================================================

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contrasenia, setContrasenia] = useState('');

  // Estados auxiliares.
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  // ========================================================
  // ENVIAR FORMULARIO
  // ========================================================

  const handleSubmit = async (e) => {
    // Evitamos que la página se recargue.
    e.preventDefault();

    // Limpiamos errores anteriores.
    setError('');

    try {
      // Activamos el estado de carga.
      setEnviando(true);

      // Enviamos al AuthContext los datos
      // exactamente con los nombres que espera el backend.
      //
      // AuthContext → authService →
      // POST /auth/usuario/registro
      await registro({
        nombre,
        apellido,
        email,
        telefono,
        contrasenia,
      });

      // Si el registro salió bien:
      //
      // - el backend creó el usuario
      // - generó el JWT
      // - AuthContext guardó token + usuario
      //
      // Entonces vamos al inicio.
      navigate('/');

    } catch (err) {
      // Mostramos el mensaje que venga del backend.
      setError(
        err.response?.data?.mensaje ||
        err.message ||
        'No se pudo crear la cuenta.'
      );

    } finally {
      // Terminamos el estado de carga.
      setEnviando(false);
    }
  };

  return (
    <section className="min-h-screen bg-neutral-100 px-5 pb-16 pt-28">

      <div className="mx-auto max-w-2xl">

        {/* ENCABEZADO */}
        <div className="mb-7 text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
            Crear cuenta
          </p>

          <h1 className="mt-2 text-3xl font-black text-neutral-900">
            Sumate a Descubre Córdoba
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Registrate para comenzar a explorar.
          </p>

        </div>

        {/* MENSAJE DE ERROR */}
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
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
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
                placeholder="Tu apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
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
                placeholder="tuemail@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="Tu teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-orange-500"
              />
            </div>

          </div>

          {/* CONTRASEÑA */}
          <div className="mt-4">

            <label className="mb-2 block text-sm font-semibold text-neutral-700">
              Contraseña
            </label>

            <input
              type="password"
              placeholder="Creá una contraseña"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
              required
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-orange-500"
            />

          </div>

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={enviando}
            className="mt-6 w-full rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {enviando
              ? 'Creando cuenta...'
              : 'Crear cuenta'}
          </button>

        </form>

        {/* LINK A LOGIN */}
        <p className="mt-5 text-center text-sm text-neutral-600">

          ¿Ya tenés una cuenta?{' '}

          <Link
            to="/login"
            className="font-semibold text-orange-600 hover:text-orange-700"
          >
            Ingresá
          </Link>

        </p>

      </div>

    </section>
  );
}

export default Registro;