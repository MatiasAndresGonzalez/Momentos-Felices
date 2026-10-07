import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const { isAuthenticated: adminAuthenticated, admin, logout: logoutAdmin } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();

  const cerrarSesion = async () => {
    setMenuAbierto(false);
    await logout();
    navigate("/");
  };

  const cerrarSesionAdmin = async () => {
    setMenuAbierto(false);
    await logoutAdmin();
    navigate("/");
  };

  const nav = (ruta) => {
    setMenuAbierto(false);
    navigate(ruta);
  };

  return (
    <header className="absolute left-0 top-0 z-50 w-full bg-[#FFF8E7]/95 text-[#3F352A] shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="text-2xl font-black tracking-tight"><span>MOMENTOS </span><span className="text-[#8B6F47]">FELICES</span></Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link to="/" className="hover:text-[#9A7B52]">Inicio</Link>
          <Link to="/productos" className="hover:text-[#9A7B52]">Catálogo</Link>
          {isAuthenticated && <Link to="/carrito" className="hover:text-[#9A7B52]">Carrito</Link>}

          {adminAuthenticated ? (
            <>
              <Link to="/admin" className="rounded-xl bg-[#8B6F47] px-4 py-2 font-bold hover:bg-[#765C39]">Panel {admin?.rol ? `(${admin.rol})` : ""}</Link>
              <button type="button" onClick={cerrarSesionAdmin} className="hover:text-[#9A7B52]">Salir admin</button>
            </>
          ) : !isAuthenticated ? (
            <>
              <Link to="/login" className="hover:text-[#9A7B52]">Ingresar</Link>
              <Link to="/registro" className="rounded-xl bg-[#8B6F47] px-5 py-2.5 font-semibold hover:bg-[#765C39]">Registrarse</Link>
            </>
          ) : (
            <>
              <Link to="/perfil" className="hover:text-[#9A7B52]">Mi perfil</Link>
              <button type="button" onClick={cerrarSesion} className="rounded-xl bg-[#8B6F47] px-5 py-2.5 font-semibold hover:bg-[#765C39]">Cerrar sesión</button>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button type="button" onClick={toggleTheme} className="rounded-lg border border-[#D9C2A6] px-3 py-2" aria-label="Cambiar tema">{theme === "light" ? "🌙" : "☀️"}</button>
          <button type="button" onClick={() => setMenuAbierto((v) => !v)} className="rounded-lg border border-slate-300 px-3 py-2 text-xl md:hidden" aria-label="Abrir menú">{menuAbierto ? "✕" : "☰"}</button>
        </div>
      </div>

      {menuAbierto && (
        <div className="border-t border-slate-200 bg-[#FFFDF7] px-4 py-4 text-[#4A4035] dark:border-slate-800 dark:bg-slate-950 dark:text-white md:hidden">
          <nav className="flex flex-col gap-3 text-sm font-medium">
            <button onClick={() => nav("/")} className="text-left">Inicio</button>
            <button onClick={() => nav("/productos")} className="text-left">Catálogo</button>
            {isAuthenticated && <button onClick={() => nav("/carrito")} className="text-left">Carrito</button>}
            {adminAuthenticated ? (
              <>
                <button onClick={() => nav("/admin")} className="text-left font-bold text-[#8B6F47]">Panel {admin?.rol ? `(${admin.rol})` : ""}</button>
                <button onClick={cerrarSesionAdmin} className="text-left font-semibold text-[#8B6F47]">Salir admin</button>
              </>
            ) : !isAuthenticated ? (
              <>
                <button onClick={() => nav("/login")} className="text-left">Ingresar</button>
                <button onClick={() => nav("/registro")} className="text-left font-semibold text-[#8B6F47]">Registrarse</button>
              </>
            ) : (
              <>
                <button onClick={() => nav("/perfil")} className="text-left">Mi perfil</button>
                <button onClick={cerrarSesion} className="text-left font-semibold text-[#8B6F47]">Cerrar sesión</button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
