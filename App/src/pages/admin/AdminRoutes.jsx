import { Routes, Route } from "react-router-dom";
import RutaAdminProtegida from "../../components/auth/RutaAdminProtegida.jsx";
import AdminLayout from "./AdminLayout.jsx";
import LoginAdmin from "./LoginAdmin.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import AdminUsuarios from "./AdminUsuarios.jsx";
import AdminProductos from "./AdminProductos.jsx";

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
        <Route path="productos" element={<AdminProductos />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
