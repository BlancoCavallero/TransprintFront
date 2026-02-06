import React, { useState, useRef, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { useClickOutside } from "../../hooks/useClickOutside";
import { useAuth } from "../../hooks/useAuth";
import "./user.css";

const getInitiales = (nombreCompleto) => {
  if (!nombreCompleto || typeof nombreCompleto !== 'string') {
    return 'NA';
  }
  
  const palabras = nombreCompleto.trim().split(/\s+/);
  if (palabras.length === 0) return 'NA';
  
  // Primera letra del primer nombre
  const primeraLetra = palabras[0][0]?.toUpperCase() ?? '';
  
  // Primera letra de la última palabra
  const ultimaPalabra = palabras[palabras.length - 1];
  const ultimaLetra = ultimaPalabra[0]?.toUpperCase() ?? '';
  
  return primeraLetra + ultimaLetra;
};

export const User = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, userDataReady } = useAuth();
  const { appLogout } = useAuth();
  const navegar = useNavigate();
  const userMenuRef = useRef(null);

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  useClickOutside(userMenuRef, () => {
    setUserMenuOpen(false);
  });

  const handleLogout = async () => {
    await appLogout();
    navegar("/login", { replace: true });
  };

  const iniciales = useMemo(() => {
    return getInitiales(user?.nombre_completo);
  }, [user?.nombre_completo]);

  const nombreCompleto = user?.nombre_completo || 'Usuario';
  const email = user?.email || 'Sin correo';

  // Si los datos del usuario aún no están listos, mostrar "Cargando..."
  if (!userDataReady) {
    return (
      <div className="user__menu" ref={userMenuRef}>
        <button className="user__btn" disabled>
          <div className="user__avatar">--</div>
          <span className="user__name_span">Cargando...</span>
        </button>
      </div>
    );
  }

  return (
    <div className="user__menu" ref={userMenuRef}>
      <button className="user__btn" onClick={toggleUserMenu}>
        <div className="user__avatar">{iniciales}</div>
        <span className="user__name_span">
          {nombreCompleto}
        </span>
      </button>

      {userMenuOpen && (
        <div className="user__dropdown">
          <div className="user__info">
            <div className="user__avatar large">{iniciales[0]}</div>
            <div>
              <div className="user__name">
               {nombreCompleto}
              </div>
              <div className="user__email">
                {email}
              </div>
            </div>
          </div>
          <div className="user__dropdown-divider"></div>
          <button className="user__dropdown-item" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};
