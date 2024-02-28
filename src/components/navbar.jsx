import React, {useContext} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faUser, faSquarePlus, faSun, faMoon} from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
import whiteLogo from "../whiteLogo.png";
import darkLogo from "../blackLogo.png";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

export const Navbar = () => {

  const {isAuth} = useContext(AuthContext);

  const username = localStorage.getItem("username");
  const profilePic = localStorage.getItem("profilePic");

  const {theme, setTheme} = useContext(ThemeContext);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  }

    return (
    <div className="navbar">
        <div className="logo">{theme === "light" ? <img src={darkLogo} /> :
          <img src={whiteLogo} />}
          </div>
        <ul>
          <Link style={{textDecoration: "none"}} to="/"><li><FontAwesomeIcon icon={faHouse} /> home</li></Link>
          <Link style={{textDecoration: "none"}} to="/create"><li><FontAwesomeIcon icon={faSquarePlus} /> create</li></Link>

          <div className="user">
          <Link style={{textDecoration: "none"}} to="/user">
            {isAuth ?
            <li><div className="user-info-nav">
            <img src={profilePic} />
            <div className="username">{username}</div>
              </div></li> :
            <li><FontAwesomeIcon icon={faUser} /> Log In</li>
            }
            </Link>
          </div>
          <div className="theme">
          <li onClick={toggleTheme}>{theme === "light" ? <span><FontAwesomeIcon icon={faMoon} /> Dark</span> :
            <span><FontAwesomeIcon icon={faSun} /> Light</span>}
            </li>
          </div>
        </ul>
      </div>
    )
}