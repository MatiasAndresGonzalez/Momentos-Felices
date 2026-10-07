import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";

const menuItems = [
  { to: "/admin", label: "Inicio", icon: "🏠" },
  { to: "/admin/usuarios", label: "Administradores", icon: "👥" },
  { to: "/admin/productos", label: "Productos", icon: "🧸" },
  { to: "/admin/categorias", label: "Categorías", icon: "🗂️" },
  { to: "/admin/compras", label: "Compras", icon: "🧾" },
];

function AdminLayout() {
  const {
    admin,
    logout,
    esAdmin,
    esGestor,
    esAuditor,
    accesoTotal,
    accesoGestor,
    accesoAuditor,
    cargando,
  } = useAdminAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  if (cargando) {
    return (
      <div className="admin-theme flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        <p className="text-sm font-medium">Cargando panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-theme flex min-h-screen flex-col bg-slate-950 md:flex-row">

      <aside className="flex w-full flex-col border-b border-orange-500/70 bg-slate-900 md:min-h-screen md:w-64 md:border-b-0 md:border-r md:border-r-orange-500/70">

        <div className="border-b border-slate-800 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-400/10 text-lg ring-1 ring-orange-400/20">
              <span className="text-sm font-black text-orange-300">MF</span>
            </div>

            <div>
              <h2 className="text-base font-bold text-white">
                Panel de Gestión
              </h2>

              <p className="text-xs text-slate-500">Momentos Felices</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-950/30"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <span className="text-base">{item.icon}</span>

              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-slate-800 p-4">
          <div className="mb-4 rounded-xl bg-slate-950/60 p-3">
            <p className="truncate text-sm font-semibold text-white">
              {admin?.nombre}
            </p>

            <p className="mt-1 text-xs text-slate-500">Rol</p>

            <span className="text-xs font-semibold uppercase text-orange-400">
              {admin?.rol}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full rounded-xl border border-slate-700 px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-400/40"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>


      <div className="flex min-w-0 flex-1 flex-col">

        <header className="border-b border-slate-700/80 bg-slate-900 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white">Panel de Gestión</h1>

              <p className="mt-1 text-sm text-slate-400">
                {esAdmin
                  ? "Acceso total: podés gestionar usuarios y roles."
                  : esGestor
                  ? "Acceso al catálogo: podés gestionar productos y categorías."
                  : esAuditor
                  ? "Acceso a las métricas: podés consultar las métricas"
                  : "Sesión de administración."}
              </p>
            </div>

            <div className="hidden shrink-0 rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1.5 text-xs font-semibold uppercase text-orange-300 md:block">
              {admin?.rol}
            </div>
          </div>
        </header>


        <main className="flex-1 p-4 sm:p-6">
          <Outlet
            context={{
              esAdmin,
              esGestor,
              esAuditor,
              accesoTotal,
              accesoGestor,
              accesoAuditor,
              puedeEscribir: accesoTotal || accesoGestor,
            }}
          />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
