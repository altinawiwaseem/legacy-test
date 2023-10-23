import React, { useContext } from "react";
import ColorModeSwitcher from "../Context/ThemeContext/ColorModeSwitcher";
import { ThemeContext } from "../Context/ThemeContext/ThemeContext";
import "./Header.css";
import { UserContext } from "../Context/UserContext/UserContext";

const Header = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  console.log("ee", user);
  return (
    <header className={`${theme} header`}>
      {user ? (
        <>
          <div className="logo">LOGO</div>
          <nav>
            <ul className="nav-bar">
              <li>
                <a href="/search">Search</a>
              </li>
              <li>
                <a href="/">Test</a>
              </li>

              <li>
                <ColorModeSwitcher />
              </li>
            </ul>
          </nav>
          <div className="username">{`${user.firstName} ${user.lastName}`}</div>{" "}
        </>
      ) : (
        <ul className="nav-bar">
          {" "}
          <li>
            <a href="/login">Log in</a>
          </li>
          <li>
            {" "}
            <a href="/register">Register</a>{" "}
          </li>
          <li>
            <ColorModeSwitcher />
          </li>
        </ul>
      )}
    </header>
  );
};

export default Header;
