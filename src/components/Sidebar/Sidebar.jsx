import { SidebarList } from "./SidebarList/SidebarList";
import { Link } from "react-router-dom";
import "./sidebar.css";
import {
  FaBullhorn,
  FaChartBar,
  FaComments,
  FaFolderOpen,
  FaUserCircle,
  FaUserCog,
} from "react-icons/fa";

const menuItems = [
  {
    id: 1,
    icon: <FaChartBar className="icon-violet" />,
    text: "Dashboard",
    path: "/gestion-dashboard",
  },
  {
    id: 2,
    icon: <FaComments className="icon-violet" />,
    text: "Consultas",
    path: "/gestion-consultas",
  },
  {
    id: 3,
    icon: <FaBullhorn className="icon-violet" />,
    text: "Reclamos",
    path: "/gestion-reclamos",
  },
  {
    id: 4,
    icon: <FaFolderOpen className="icon-violet" />,
    text: "Denuncias",
    path: "/gestion-denuncias",
  },
  {
    id: 9,
    icon: <FaUserCircle className="icon-violet" />,
    text: "Gestión de Información",
    path: "/gestion-informacion",
  },
  {
    id: 10,
    icon: <FaUserCog className="icon-violet" />,
    text: "Gestión de Usuarios",
    path: "/gestion-administracion",
  },
];

const Sidebar = ({ isCollapsed, toggleSidebar, isMobile, user }) => {
// El sidebar puede recibir user que seria luego para limitar las opciones que ve cada rol de usuario. Actualmente lo borre de los props porque no lo estoy usando. 

  return (
    <>
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar__header">
          {isMobile && (
            <button className="sidebar__collapse-btn" onClick={toggleSidebar}>
              ←
            </button>
          )}
          <Link
            to="/gestion-welcome"
            className="siderbar__logo"
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <p>Transprint SRL</p>
          </Link>
        </div>
        <SidebarList
          menuItems={menuItems}
          closeSidebar={isMobile ? toggleSidebar : undefined}
        />

        <div className="sidebar__footer">
          <div >
            © Grupo 7 Seminario Integrador,{" "}
            {new Date().getFullYear()}
          </div>
          <div className="siderbar__version">
            Versión 1.0.0
          </div>
        </div>
      </div>
      {/* Overlay para móviles */}
      {!isCollapsed && isMobile && (
        <div className="sidebar__overlay" onClick={toggleSidebar} />
      )}
    </>
  );
};

export default Sidebar;
