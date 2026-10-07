import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";

function LoginAdmin() {
  const navigate = useNavigate();
  const { login, cerrarSesionClienteYContinuar } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [clienteBloqueando, setClienteBloqueando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Completá email y contraseña.");
      return;
    }

    try {
      setEnviando(true);

      const admin = await login(email, password);

      console.log("Login exitoso:", admin);
      navigate("/admin");
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError(err.message || "Credenciales inválidas.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="admin-theme flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-700/80 border-t-2 border-t-orange-500 bg-slate-900 p-8 shadow-2xl">
        {/* Encabezado */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 ring-1 ring-orange-400/20">
            <span className="text-sm font-black text-orange-300">DC</span>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
            Área de gestión
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Ingreso al panel
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Acceso para el equipo encargado de gestionar
            <span className="text-slate-300">Momentos Felices</span>.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-300"
          >
            <p>{error}</p>
            {error.includes("Ya posee una sesión de Cliente activa") && (
              <button
                type="button"
                disabled={clienteBloqueando}
                onClick={async () => {
                  setClienteBloqueando(true);
                  setError("");
                  try {
                    await cerrarSesionClienteYContinuar();
                    const admin = await login(email, password);
                    navigate("/admin");
                  } catch (err) {
                    setError(err.message || "No se pudo iniciar la sesión de administrador.");
                  } finally {
                    setClienteBloqueando(false);
                  }
                }}
                className="mt-4 w-full rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:opacity-50"
              >
                {clienteBloqueando ? "Cerrando sesión de cliente..." : "Cerrar sesión de cliente y continuar"}
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              placeholder="admin@ejemplo.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              placeholder="*********"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-950/30 transition hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {enviando ? "Ingresando..." : "Ingresar al panel"}
          </button>
        </form>

        {/* Volver al sitio público */}
        <div className="mt-7 border-t border-slate-800 pt-6 text-center">
          <Link
            to="/"
            className="text-sm font-medium text-slate-400 transition hover:text-orange-400"
          >
            ← Volver al sitio público
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginAdmin;
