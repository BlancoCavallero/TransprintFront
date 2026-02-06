import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AdminRoute = () => {
  const { isAuthenticated, user, userDataReady } = useAuth();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Mientras se cargan los datos del usuario, no hacer nada (mostrar pantalla vacía)
  if (!userDataReady) {
    return <div></div>;
  }

  // Verificar si el usuario tiene el rol "Administrador"
  const isAdmin = Array.isArray(user?.roles) && user.roles.includes("Administrador");

  if (!isAdmin) {
    // Si no es administrador, redirigir al dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // Si es admin, permitir acceso a las rutas internas (Outlet renderiza las rutas hijas)
  return <Outlet />;
};

export default AdminRoute;
