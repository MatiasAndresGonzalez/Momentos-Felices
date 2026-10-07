import { Routes, Route } from "react-router-dom";
import RutaAdminProtegida from "../../components/auth/RutaAdminProtegida.jsx";
import AdminLayout from "./AdminLayout.jsx";
import LoginAdmin from "./LoginAdmin.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import AdminUsuarios from "./AdminUsuarios.jsx";
import AdminExcursiones from "./AdminExcursiones";
import AdminCategorias from "./AdminCategorias.jsx";
import AdminCompras from "./AdminCompras.jsx";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<LoginAdmin />} />

      <Route
        path="*"
        element={
          <RutaAdminProtegida>
            <AdminLayout />
          </RutaAdminProtegida>
        }
      >
        <Route index element={<AdminDashboard />} />

        <Route path="usuarios" element={<AdminUsuarios />} />
        <Route path="excursiones" element={<AdminExcursiones />} />
        <Route path="categorias" element={<AdminCategorias />} />
        <Route path="compras" element={<AdminCompras />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
