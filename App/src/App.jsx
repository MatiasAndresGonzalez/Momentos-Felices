import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx";
import { AdminAuthProvider } from "./context/AdminAuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

import RutaProtegida from "./components/auth/RutaProtegida.jsx";
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";

import Inicio from "./pages/Inicio.jsx";
import Productos from "./pages/Productos.jsx";
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
import Perfil from "./pages/Perfil.jsx";
import Excursiones from "./pages/Excursiones.jsx";
import Favoritos from "./pages/Favoritos.jsx";
import Carrito from "./pages/Carrito.jsx";
import AdminRoutes from "./pages/admin/AdminRoutes.jsx";

import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/admin/*" element={<AdminRoutes />} />
              <Route
                path="/*"
                element={
                  <div className="flex min-h-screen flex-col bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-100">
                    <Header />
                    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
                      <Routes>
                        <Route path="/" element={<Inicio />} />
                        <Route path="/productos" element={<Productos />} />
                        <Route path="/excursiones" element={<Excursiones />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/registro" element={<Registro />} />
                        <Route path="/perfil" element={<RutaProtegida><Perfil /></RutaProtegida>} />
                        <Route path="/carrito" element={<RutaProtegida><Carrito /></RutaProtegida>} />
                        <Route path="/favoritos" element={<RutaProtegida><Favoritos /></RutaProtegida>} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                }
              />
            </Routes>
          </BrowserRouter>
        </AdminAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
