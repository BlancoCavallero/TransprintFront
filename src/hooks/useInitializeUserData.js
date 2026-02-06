import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { getUsuario } from '../services/usuarioService';

/**
 * Hook que carga automáticamente los datos completos del usuario autenticado
 * Se ejecuta una sola vez cuando el usuario entra a la app
 */
export const useInitializeUserData = () => {
  const { user, isAuthenticated, userDataReady, updateUserData } = useAuth();

  useEffect(() => {
    // Solo ejecutar si: usuario autenticado, datos NO listos, y tenemos user_id
    if (isAuthenticated && !userDataReady && user?.user_id) {
      const fetchAndUpdateUserData = async () => {
        try {
          console.log("🔄 Cargando datos completos del usuario...");
          
          // Esperar un poco para asegurar que la sesión está lista
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Traer todos los usuarios
          const response = await getUsuario();
          const usuarios = Array.isArray(response)
            ? response
            : Array.isArray(response?.data)
              ? response.data
              : Array.isArray(response?.data?.data)
                ? response.data.data
                : [];
          
          // Encontrar el usuario actual por su user_id
          const usuarioActual = usuarios.find(u => u.user_id === user.user_id);
          
          if (usuarioActual) {
            console.log("✅ Datos del usuario cargados:", usuarioActual);
            // Actualizar el contexto con los datos completos
            updateUserData(usuarioActual);
          } else {
            console.warn("⚠️ Usuario no encontrado en la base de datos");
            // Aún así marcar como listo aunque no tengamos datos completos
            updateUserData(user);
          }
        } catch (error) {
          console.error("❌ Error al cargar datos del usuario:", error);
          // Si falla, al menos marcar como listo para no quedarse en "Cargando..."
          updateUserData(user);
        }
      };

      fetchAndUpdateUserData();
    }
  }, [isAuthenticated, userDataReady, user?.user_id, updateUserData]);
};
