import { User } from "../User/User";
import { GoSidebarCollapse } from "react-icons/go";
import { GoSidebarExpand } from "react-icons/go";
import "./header.css";


export const Header = ({ toggleSidebar, isCollapsed }) => {

  return (
    <header className="header__container">
      <div className="header__left">
        <button onClick={toggleSidebar} className="header__toggle">
          {isCollapsed ? <GoSidebarCollapse /> : <GoSidebarExpand />}
        </button>
        <div className="header__logo">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color: "inherit",
              cursor: "pointer",
            }}
          >
            <span className="header__span"></span>
          </a>
        </div>
      </div>

      <div className="header__right">
        <User />
      </div>
    </header>
  );
};

