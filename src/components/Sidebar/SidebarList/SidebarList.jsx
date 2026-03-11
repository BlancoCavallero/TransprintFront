import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./sidebarList.css";

export const SidebarList = ({ menuItems, closeSidebar }) => {

  const location = useLocation();
  
  const handleItemClick = (itemPath) => {
    // Solo cerrar si estamos en móvil y es un item diferente al actual
    if (closeSidebar && location.pathname !== itemPath) {
      closeSidebar();
    }
  };

  return (
    <nav className="sidebarList__nav">
      <ul>
        {menuItems.map((item) => (
          <li key={item.id}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive ? "sidebarList__nav-item active" : "sidebarList__nav-item"
              }
               onClick={() => handleItemClick(item.path)}
            >
              <span className="sidebarList__nav-icon">{item.icon}</span>
              <span className="sidebarList__nav-text">{item.text}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
