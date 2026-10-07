import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

function Header() {
  const { isAuthenticated, logout } = useAuth();

  const navigate = useNavigate();

  const cerrarSesion = () => {
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

        <nav className="flex items-center gap-8 text-sm font-medium">
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
      </div>
    </header>
  );
}

export default Header;
