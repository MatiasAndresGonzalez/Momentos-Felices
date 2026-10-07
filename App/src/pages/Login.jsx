// Login.jsx
// Página para iniciar sesión.
//
// Utiliza login() del AuthContext,
// que se conecta al backend real y recibe un JWT.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Login() {
  // Permite navegar desde JavaScript.
  const navigate = useNavigate();

  // Traemos la función login desde AuthContext.
  const { login } = useAuth();

  // Estados de los campos del formulario.
  const [email, setEmail] = useState('');
  const [contrasenia, setContrasenia] = useState('');

  // Estados auxiliares.
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Se ejecuta cuando enviamos el formulario.
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpiamos errores anteriores.
    setError('');

    try {
      // Activamos el estado de carga.
      setEnviando(true);

      // Llamamos a login() del AuthContext.
      //
      // AuthContext → authService →
      // POST /auth/usuario/login
      //
      // Se envía:
      //
      // {
      //   email,
      //   contrasenia
      // }
      await login(email, contrasenia);

      // Si salió bien, AuthContext ya guardó:
      // - token
      // - usuario
      //
      // Entonces vamos al inicio.
      navigate('/');

    } catch (err) {
      // Mostramos el mensaje que venga del backend.
      setError(
        err.response?.data?.mensaje ||
        err.message ||
        'No se pudo iniciar sesión.'
      );

    } finally {
      // Finalizamos el estado de carga.
      setEnviando(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#FFFDF7] px-5 pb-16 pt-28">

      <div className="mx-auto max-w-md">

        {/* ENCABEZADO */}
        <div className="mb-7 text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-#8B6F47">
            Bienvenido
          </p>

          <h1 className="mt-2 text-3xl font-black text-[#3F352A]">
            Iniciar sesión
          </h1>

          <p className="mt-2 text-sm text-[#8B7A68]">
            Ingresá a tu cuenta para continuar.
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
          className="rounded-2xl bg-[#FFF8E7] p-6 shadow-lg sm:p-8"
        >

          {/* EMAIL */}
          <label className="mb-2 block text-sm font-semibold text-[#5B4A3A]">
            Email
          </label>

          <input
            type="email"
            placeholder="tuemail@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-[#D9C2A6] px-4 py-3 outline-none transition focus:border-#8B6F47"
          />

          {/* CONTRASEÑA */}
          <label className="mb-2 mt-5 block text-sm font-semibold text-neutral-700">
            Contraseña
          </label>

          <input
            type="password"
            placeholder="Ingresá tu contraseña"
            value={contrasenia}
            onChange={(e) => setContrasenia(e.target.value)}
            required
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-#8B6F47"
          />

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={enviando}
            className="mt-6 w-full rounded-xl bg-#8B6F47 py-3 font-semibold text-white transition hover:bg-#765C39 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {enviando
              ? 'Ingresando...'
              : 'Ingresar'}
          </button>

        </form>

        {/* LINK A REGISTRO */}
        <p className="mt-5 text-center text-sm text-[#6E5C49]">

          ¿Todavía no tenés una cuenta?{' '}

          <Link
            to="/registro"
            className="font-semibold text-#765C39 hover:text-orange-700"
          >
            Registrate
          </Link>

        </p>

      </div>

    </section>
  );
}

export default Login;