import { Link } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";

function AdminDashboard() {
  const {
    admin,
    esAdmin,
    esGestor,
    accesoTotal
  } = useAdminAuth();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-6 shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-orange-400">
              Panel de gestión
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
              ¡Hola, {admin?.nombre}!
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
              Desde acá podés gestionar y consultar la información de{" "}
              <span className="text-slate-300">Momentos Felicies</span>.
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
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-6 shadow-xl">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-400/10 text-xl ring-1 ring-orange-400/20">
            👥
          </div>

          <h3 className="text-lg font-bold text-white">Administradores</h3>

          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {esAdmin
              ? "Gestioná los usuarios del panel, asigná roles y controlá sus permisos de acceso."
              : esGestor 
              ? "Consultá el listado de usuarios que tienen acceso al panel de gestión, gestioná categorías y productos."
              : "Consultá las métricas."}
          </p>

          <Link
            to="/admin/usuarios"
            className="mt-5 inline-flex items-center rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-950/30 transition hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
          >
            {esAdmin ? "Gestionar administradores" : "Ver administradores"}
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-700/80 bg-slate-900 p-6 shadow-xl">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-400/10 text-xl ring-1 ring-orange-400/20">
            🔐
          </div>

          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-white">Permisos actuales</h3>

            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {esAdmin ? "Administrador" : esGestor ? "Gestor" : "Auditor"}
            </span>
          </div>

          <ul className="mt-5 space-y-4 text-sm">

            <li className="flex items-center gap-3">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                  esAdmin || esGestor
                    ? "bg-emerald-400/10 text-emerald-400"
                    : "bg-slate-700 text-slate-500"
                }`}
              >
                {esAdmin || esGestor ? "✓" : "—"}
              </span>

              <span className="text-slate-300">
                Ver listado de administradores
              </span>
            </li>

            <li className="flex items-center gap-3">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                  accesoTotal
                    ? "bg-emerald-400/10 text-emerald-400"
                    : "bg-slate-700 text-slate-500"
                }`}
              >
                {accesoTotal ? "✓" : "—"}
              </span>

              <span
                className={accesoTotal ? "text-slate-300" : "text-slate-500"}
              >
                Crear, editar y eliminar usuarios
              </span>
            </li>

            <li className="flex items-center gap-3">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                  accesoTotal
                    ? "bg-emerald-400/10 text-emerald-400"
                    : "bg-slate-700 text-slate-500"
                }`}
              >
                {accesoTotal ? "✓" : "—"}
              </span>

              <span
                className={accesoTotal ? "text-slate-300" : "text-slate-500"}
              >
                Asignar roles
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
