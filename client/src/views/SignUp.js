import { useState } from "react";
import { Link } from "react-router-dom";
import { serverURL } from "../utils/serverURL";

const SignUp = () => {
  // Computed property Names, event handler for all 3 events
  const [newUser, setNewUser] = useState(null);
  const [loginUser, setLoginUser] = useState({});
  const [isSignupDisabled, setIsSignupDisabled] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const handleChangeHandler = (e) => {
    // setNewUser({ ...newUser, [e.target.name]: e.target.value });
    const updatedNewUser = { ...newUser, [e.target.name]: e.target.value };
    setNewUser(updatedNewUser);

    setIsSignupDisabled(
      updatedNewUser.userName === "" ||
        updatedNewUser.password?.length < 6 ||
        !updatedNewUser.email?.includes("@") ||
        !updatedNewUser.email?.includes(".") ||
        !updatedNewUser.password
    );
  };

  const fetchSignUp = async () => {
    console.log("newUser", newUser);
    const urlencoded = new URLSearchParams();
    urlencoded.append("userName", newUser.userName);
    urlencoded.append("email", newUser.email);
    urlencoded.append("password", newUser.password);
    console.log('urlenconded.get("password)', urlencoded.get("password"));
    urlencoded.append(
      "userPicture",
      newUser.userPicture
        ? newUser.userPicture
        : "https://res.cloudinary.com/dvqfcis2q/image/upload/v1677069630/Plants/magritte_1_hdpqmv.png"
    );

    var requestOptions = {
      method: "POST",
      body: urlencoded,
    };

    try {
      const response = await fetch(
        `${serverURL}/api/users/signup`,
        requestOptions
      );
      const result = await response.json();
      setMessage(result.msg);
      console.log(result);
    } catch (error) {
      setError(error.msg);
      console.log("error", error);
    }
  };

  return (
    <div>
      <div className="sign-up-page">
        {/* {newUser.userName ? (
        console.log("loggedinUser", newUser)
      ) : ( */}
        <h1>Please register: </h1>
        {/*  )} */}
        {/*
       <input
        value={userName}
        type="text"
        placeholder="Username"
        onChange={(e) => setUserName(e.target.value)}
      /> */}
        <input
          // value={password}
          type="text"
          name="userName"
          id="userName"
          placeholder="User Name"
          onChange={handleChangeHandler}
        />
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
        {error || message ? (
          <p>
            {" "}
            <small style={{ backgroundColor: "white" }}>
              {message} {error}
            </small>
          </p>
        ) : null}
        <button
          className="register-button"
          onClick={fetchSignUp}
          disabled={isSignupDisabled}
          style={{ opacity: isSignupDisabled ? 0.5 : 1 }}
        >
          Signup
        </button>
        <Link to="/login">
          <button className="login-button">Got an Acount? Login!</button>
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
