import React, { useContext } from "react";
import { ThemeContext } from "../Context/ThemeContext/ThemeContext";
import "./Header.css";
import { UserContext } from "../Context/UserContext/UserContext";
import ThemeSwitcher from "../Context/ThemeContext/ThemeSwitcher";
import logo from "../../images/j-service-logo.png";

const Header = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);

  return (
    <header className={`${theme} header`}>
      <div className="logo">
        <a href="/">
          {" "}
          <img className="logo-img" src={logo} alt="logo" />
        </a>
      </div>
      <div className="nav">
        <nav>
          <ul className="nav-bar">
            <li>
              <a href="/">Test</a>
            </li>
            <li>
              <a href="/search">Search</a>
            </li>

            <li>
              <a href="/log">Tests Log</a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="user-info">
        {user ? (
          <>
            <div className="username">{`${user.firstName} ${user.lastName}`}</div>
            <ThemeSwitcher />
          </>
        ) : (
          <>
            <ul className="nav-bar">
              {" "}
              <li>
                <a href="/login">Log in</a>
              </li>
              <li>
                {" "}
                <a href="/register">Register</a>{" "}
              </li>
            </ul>
            <ThemeSwitcher />
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
