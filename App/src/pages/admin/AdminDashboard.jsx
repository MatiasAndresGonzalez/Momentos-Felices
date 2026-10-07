import { Link } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";

function AdminDashboard() {
  const { admin, esAdmin, esGestor, esAuditor, accesoTotal, accesoGestor } = useAdminAuth();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-6 shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-orange-400">Panel de gestión</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
              ¡Hola, {admin?.nombre}!
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
              Desde acá podés gestionar y consultar la información de{" "}
              <span className="text-slate-300">Momentos Felices</span>.
            </p>
          </div>

          <div className="shrink-0">
            <span className="inline-flex items-center rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-orange-300">
              {admin?.rol}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {esAdmin && (
          <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-400/10 text-xl ring-1 ring-orange-400/20">
              👥
            </div>

            <h3 className="text-lg font-bold text-white">Administradores</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Gestioná los usuarios del panel, asigná roles y controlá sus permisos de acceso.
            </p>

            <Link
              to="/admin/usuarios"
              className="mt-5 inline-flex items-center rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-950/30 transition hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
            >
              Gestionar administradores
            </Link>
          </div>
        )}

        <div className={`rounded-2xl border border-slate-700/80 bg-slate-900 p-6 shadow-xl ${esAdmin ? "" : "md:col-span-2"}`}>
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-400/10 text-xl ring-1 ring-orange-400/20">
            🧸
          </div>

          <h3 className="text-lg font-bold text-white">Catálogo de productos</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {accesoGestor
              ? "Podés crear, editar y eliminar productos, además de buscar, ordenar y paginar el catálogo."
              : "Podés consultar el catálogo, aplicar filtros, ordenar resultados y navegar por páginas."}
          </p>

          <Link
            to="/admin/productos"
            className="mt-5 inline-flex items-center rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-950/30 transition hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
          >
            {accesoGestor ? "Gestionar productos" : "Consultar productos"}
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-6 shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-white">Permisos actuales</h3>
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {esAdmin ? "Superadmin" : esGestor ? "Gestor" : "Auditor"}
          </span>
        </div>

        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <li className="flex items-center gap-3">
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${esAdmin ? "bg-emerald-400/10 text-emerald-400" : "bg-slate-700 text-slate-500"}`}>
              {esAdmin ? "✓" : "—"}
            </span>
            <span className={esAdmin ? "text-slate-300" : "text-slate-500"}>Gestionar administradores</span>
          </li>

          <li className="flex items-center gap-3">
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${accesoGestor ? "bg-emerald-400/10 text-emerald-400" : "bg-slate-700 text-slate-500"}`}>
              {accesoGestor ? "✓" : "—"}
            </span>
            <span className={accesoGestor ? "text-slate-300" : "text-slate-500"}>Escritura en productos</span>
          </li>

          <li className="flex items-center gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400 text-xs">✓</span>
            <span className="text-slate-300">Consulta de productos</span>
          </li>

          <li className="flex items-center gap-3">
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${esAuditor ? "bg-emerald-400/10 text-emerald-400" : "bg-slate-700 text-slate-500"}`}>
              {esAuditor ? "✓" : "—"}
            </span>
            <span className={esAuditor ? "text-slate-300" : "text-slate-500"}>Modo auditoría</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;
