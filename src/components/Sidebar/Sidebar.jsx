import { SidebarList } from "./SidebarList/SidebarList";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import logoTransprint from "../../assets/images/logoTransprint.png";
import "./sidebar.css";
import { 
  FaChartBar,
  FaTruck,    
  FaComments,      
  FaBullhorn,      
  FaFolderOpen,    
  FaUserCircle,    
  FaUserCog        
} from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { FaHouse, FaPerson,FaPersonCircleCheck} from "react-icons/fa6";
import { GiPathDistance } from "react-icons/gi";

const allMenuItems = [
  {
    id: 1,
    icon: <FaHouse className="icon-violet" />,
    text: "Dashboard",
    path: "/dashboard",
  },
  {
    id: 2,
    icon: <FaPerson className="icon-violet" />,
    text: "Clientes",
    path: "/cliente",
  },
  {
    id: 3,
    icon: <FaTruck className="icon-violet" />,
    text: "Vehículos",
    path: "/vehiculo",
  },
  {
    id: 4,
    icon: <FaPersonCircleCheck className="icon-violet" />,
    text: "Choferes",
    path: "/chofer",
  },
  {
    id: 5,
    icon: <GiPathDistance className="icon-violet" />,
    text: "Viajes",
    path: "/viaje",
  },
  {
    id: 6,
    icon: <IoMdSettings className="icon-violet" />,
    text: "Mantenimiento",
    path: "/mantenimiento",
  },
  {
    id: 7,
    icon: <FaUserCog className="icon-violet" />,
    text: "Usuarios",
    path: "/usuario",
    adminOnly: true, // Este item solo se muestra para administradores
  },
  {
    id: 8,
    icon: <FaChartBar className="icon-violet" />,
    text: "Reportes",
    path: "/reporte",
  }
];

const Sidebar = ({ isCollapsed, toggleSidebar, isMobile }) => {
  const { user, userDataReady } = useAuth();
  
  // Filtrar items del menu según el rol del usuario
  const isAdmin = userDataReady && Array.isArray(user?.roles) && user.roles.includes("Administrador");
  const menuItems = allMenuItems.filter(item => !item.adminOnly || isAdmin); 

  return (
    <>
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar__header">
          {/* {isMobile && (
            <button className="sidebar__collapse-btn" onClick={toggleSidebar}>
              ←
            </button>
          )} */}
          <Link
            to="/gestion-welcome"
            className="siderbar__logo"
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <img
              src={logoTransprint}
              alt="Transprint SRL"
              className="sidebar__logo-img"
            />
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
