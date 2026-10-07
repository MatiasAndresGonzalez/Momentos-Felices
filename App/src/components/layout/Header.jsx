import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const navigate = useNavigate();

  const cerrarSesion = () => {
    setMenuAbierto(false);
    logout();

    navigate("/");
  };

  return (
    <header className="absolute left-0 top-0 z-50 w-full bg-black/90 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-3">
          <div className="text-2xl font-black tracking-tight">
            <span className="text-white">MOMENTOS </span>

            <span className="text-orange-500">FELICES</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link to="/" className="transition hover:text-orange-400">
            Inicio
          </Link>

          <Link to="/productos" className="transition hover:text-orange-400">
            Catálogo
          </Link>

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="transition hover:text-orange-400">
                Ingresar
              </Link>

              <Link
                to="/registro"
                className="rounded-xl bg-orange-500 px-6 py-3 font-semibold transition hover:bg-orange-600"
              >
                Registrarse
              </Link>
            </>
          ) : (
            <>
              <Link to="/perfil" className="transition hover:text-orange-400">
                Mi perfil
              </Link>

              <Link to="/carrito" className="transition hover:text-orange-400">
                Carrito
              </Link>

              {/* CERRAR SESIÓN */}
              <button
                type="button"
                onClick={cerrarSesion}
                className="rounded-xl bg-orange-500 px-6 py-3 font-semibold transition hover:bg-orange-600"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </nav>
      <div className="flex items-center gap-2 md:hidden">
          <button type="button" onClick={toggleTheme} className="rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700" aria-label="Cambiar tema">
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <button type="button" onClick={() => setMenuAbierto(!menuAbierto)} className="rounded-lg border border-slate-300 px-3 py-2 text-xl dark:border-slate-700" aria-label="Abrir menú">
            {menuAbierto ? "✕" : "☰"}
          </button>
        </div>
      </div>
      {menuAbierto && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <nav className="flex flex-col gap-3 text-sm font-medium">
            <Link to="/" onClick={() => setMenuAbierto(false)}>Inicio</Link>
            <Link to="/productos" onClick={() => setMenuAbierto(false)}>Catálogo</Link>
            {!isAuthenticated ? (
              <>
                <Link to="/login" onClick={() => setMenuAbierto(false)}>Ingresar</Link>
                <Link to="/registro" onClick={() => setMenuAbierto(false)} className="font-semibold text-orange-500">Registrarse</Link>
              </>
            ) : (
              <>
                <Link to="/perfil" onClick={() => setMenuAbierto(false)}>Mi perfil</Link>
                <Link to="/carrito" onClick={() => setMenuAbierto(false)}>Carrito</Link>
                <button type="button" onClick={cerrarSesion} className="text-left font-semibold text-orange-500">Cerrar sesión</button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
