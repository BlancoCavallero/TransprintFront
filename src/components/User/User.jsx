import React, { useState, useRef, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { useClickOutside } from "../../hooks/useClickOutside";
import { useAuth } from "../../hooks/useAuth";
import "./user.css";

// const getIniciales = (nombre, apellido) => {
//   const letraNombreInicial =
//     nombre?.trim().split(" ")[0][0]?.toUpperCase() ?? "";
//   const letraApellidoInicial =
//     apellido?.trim().split(" ")[0][0]?.toUpperCase() ?? "";
//   return letraNombreInicial + letraApellidoInicial;
// };

export const User = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  // const { user } = useAuth(); para el futuro.

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

//   const iniciales = useMemo(() => {
//     return getIniciales(user?.nombre, user?.apellido);
//   }, [user?.nombre, user?.apellido]);

  return (
    <div className="user__menu" ref={userMenuRef}>
      <button className="user__btn" onClick={toggleUserMenu}>
        <div className="user__avatar">NA</div>
        <span className="user__name_span">
          NOMBRE <span className="user__surname_span">APELLIDO</span>
        </span>
      </button>

      {userMenuOpen && (
        <div className="user__dropdown">
          <div className="user__info">
            <div className="user__avatar large">N</div>
            <div>
              <div className="user__name">
               APELLIDO
              </div>
              <div className="user__email">
                nombre-apellido@hotmail.comm
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
