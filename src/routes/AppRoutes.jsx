import { Routes, Route, Navigate } from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import PublicRoute from "./PublicRoute";

// Imports de páginas
import { Login } from "../pages/Login/Login";
import { Chofer } from "../pages/Chofer/Chofer";
import { Mantenimiento } from "../pages/Mantenimiento/Mantenimiento";
import { Usuario } from "../pages/Usuario/Usuario";
import { Reporte } from "../pages/Reporte/Reporte";
import { Viaje } from "../pages/Viaje/Viaje";
import { Vehiculo } from "../pages/Vehiculo/Vehiculo";
import { Cliente } from "../pages/Cliente/Cliente";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import PrivateLayout from "../layout/PrivateLayout";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Páginas públicas */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Navigate to="/login" />} />
      </Route>

      {/* Páginas privadas */}
      <Route element={<PrivateLayout />}>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chofer" element={<Chofer />} />
          <Route path="/mantenimiento" element={<Mantenimiento />} />
          <Route path="/reporte" element={<Reporte />} />
          <Route path="/viaje" element={<Viaje />} />
          <Route path="/vehiculo" element={<Vehiculo />} />
          <Route path="/cliente" element={<Cliente />} />
          <Route path="/*" element={<Navigate to="/dashboard" />} />
        </Route>

        {/* Ruta solo para administradores */}
        <Route element={<AdminRoute />}>
          <Route path="/usuario" element={<Usuario />} />
        </Route>
      </Route>
    </Routes>
  );
};
