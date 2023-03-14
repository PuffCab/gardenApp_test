import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken } from "../utils/getToken";
import { AuthContext } from "../store/AuthContext";

function Login() {
  const [loginUser, setLoginUser] = useState({});
  const { login, loggedinUser, message } = useContext(AuthContext);
  const token = getToken();
  const [isLoginDisabled, setIsLoginDisabled] = useState(true);
  const navigateTo = useNavigate();

  // function handleController() {
  //   handleChangeHandler();
  // }

  const handleChangeHandler = (e) => {
    const updatedLoginUser = { ...loginUser, [e.target.name]: e.target.value };
    setLoginUser(updatedLoginUser);

    setIsLoginDisabled(
      updatedLoginUser.password?.length < 6 ||
        !updatedLoginUser.email?.includes("@") ||
        !updatedLoginUser.email?.includes(".") ||
        !updatedLoginUser.password
    );
  };

  const submitLogin = () => {
    login(loginUser.email, loginUser.password);
  };

  useEffect(() => {
    if (loggedinUser) {
      navigateTo("/myprofile");
    }
  }, [loggedinUser]);

  return (
    <div>
      <div className="login-page">
        {token ? (
          <h1>Hello {loggedinUser.userName}</h1>
        ) : (
          <h1>Please Login: </h1>
        )}

        <input
          // value={email}
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          onChange={handleChangeHandler}
        />
        <input
          // value={password}
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          onChange={handleChangeHandler}
        />
        {message ? (
          <p>
            {" "}
            <small style={{ backgroundColor: "white" }}>{message}</small>
          </p>
        ) : null}
        <button
          className="register-button"
          onClick={submitLogin}
          disabled={isLoginDisabled}
          style={{ opacity: isLoginDisabled ? 0.5 : 1 }}
        >
          Login
        </button>
        <Link to="/signup">
          <button className="login-button">No Acount? Sign Up!</button>
        </Link>
      </div>
    </div>
  );
}

export default Login;
