// PrivateLayout.js
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import { Header } from "../components/Header/Header";
import "./privateLayout.css";


// import { useAuth } from "../hooks/useAuth";

const PrivateLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
//   const {user}=useAuth();
  const location = useLocation();
  const isWelcomePage = location.pathname.includes("dashboard");


  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
      <div className="app-private-layout">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
        //   user={user}
        />

        <div className={`content-area ${sidebarCollapsed ? "collapsed" : ""}`}>
          <Header
            toggleSidebar={toggleSidebar}
            isCollapsed={sidebarCollapsed}
            isMobile={isMobile}
          />
       <main className={`${isWelcomePage ? "no-padding" : "main-content"}`}>
        <Outlet />
      </main>
        </div>
      </div>
  );
};

export default PrivateLayout;
