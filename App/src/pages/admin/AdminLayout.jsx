import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";

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

  const menuItems = [
    { to: "/admin", label: "Inicio", icon: "🏠" },
    ...(esAdmin
      ? [{ to: "/admin/usuarios", label: "Administradores", icon: "👥" }]
      : []),
    { to: "/admin/productos", label: "Productos", icon: "🧸" },
    { to: "/admin/categorias", label: "Categorías", icon: "🏷️" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1F2937] text-[#9CA3AF]">
        <p>Cargando panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-theme flex min-h-screen flex-col bg-slate-950 md:flex-row">
      <aside className="flex w-full flex-col border-b border-#2563EB/70 bg-[#263244] md:min-h-screen md:w-64 md:border-b-0 md:border-r md:border-r-#2563EB/70">
        <div className="border-b border-[#374151] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-#3B82F6/10 ring-1 ring-#3B82F6/20">
              <span className="text-sm font-black text-#93C5FD">MF</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Panel de Gestión</h2>
              <p className="text-xs text-[#9CA3AF]">Momentos Felices</p>
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
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-#1D4ED8 text-white" : "text-[#D1D5DB] hover:bg-[#374151] hover:text-white"}`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-slate-800 p-4">
          <div className="mb-4 rounded-xl bg-slate-950/60 p-3">
            <p className="truncate text-sm font-semibold text-white">{admin?.nombre}</p>
            <p className="mt-1 text-xs text-slate-500">Rol</p>
            <span className="text-xs font-semibold uppercase text-#3B82F6">
              {admin?.rol}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full rounded-xl border border-[#4B5563] px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-[#374151] hover:text-white"
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
                  ? "Acceso total: usuarios y catálogo."
                  : esGestor
                    ? "Gestión del catálogo de productos."
                    : esAuditor
                      ? "Consulta del catálogo."
                      : "Sesión de administración."}
              </p>
            </div>

            <div className="hidden rounded-full border border-#3B82F6/20 bg-#3B82F6/10 px-3 py-1.5 text-xs font-semibold uppercase text-#93C5FD md:block">
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
