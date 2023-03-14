import "./NavBar.css";
import { getToken } from "../utils/getToken";
import { useContext } from "react";
import { AuthContext } from "../store/AuthContext";
import { Link } from "react-router-dom";

function NavigationBar() {
  const { logout } = useContext(AuthContext);
  const token = getToken();
  return (
    <>
      <header className="nav-bar">
        <Link to="/" className="logo">
          {" "}
          Garden App{" "}
        </Link>
        <input className="menu-btn" type="checkbox" id="menu-btn" />
        <label className="menu-icon" htmlFor="menu-btn">
          <span className="navicon"></span>
        </label>
        <ul className="menu">
          <li>
            {" "}
            {/* <a href="/">plants</a>{" "} */}
            <Link to="/">plants</Link>{" "}
          </li>
          {token ? (
            <li>
              {" "}
              <Link to="/myprofile">My Profile</Link>
            </li>
          ) : (
            <li>
              {" "}
              <Link to="/login">log in</Link>{" "}
            </li>
          )}
          <li>
            {" "}
            {token && (
              <Link to="/login" onClick={() => logout(getToken, logout)}>
                logout
              </Link>
            )}
          </li>
          <li> {!token && <Link to="/signup">sign up</Link>}</li>
        </ul>{" "}
      </header>{" "}
    </>
  );
}

export default NavigationBar;
