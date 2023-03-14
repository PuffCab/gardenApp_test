import { createContext } from "react";
import { useState, useEffect } from "react";
import { getToken } from "../utils/getToken";

export const AuthContext = createContext();
export const AuthContextProvider = (props) => {
  //   console.log("Auth context runs");
  //   const [loginUser, setLoginUser] = useState(null); //FIXME check if you can delete this state
  const [loggedinUser, setLoggedinUser] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const login = (email, password) => {
    console.log("auth login", email, password);
    // Check email format, password length ...avoid making useless requests to the server

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("email", email);
    urlencoded.append("password", password);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch("http://localhost:5003/api/users/login", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result.msg);
        console.log(result);
        setMessage(result.msg);

        if (result.token) {
          console.log(result.token);
          localStorage.setItem("token", result.token);
          setLoggedinUser(result.user);

          setMessage(result.msg);
        }
      })
      .catch((error) => console.log("error", error));
  };
  console.log("%cloggedInUser context:::", "color:red", loggedinUser);
  const logout = () => {
    console.log("logging out user");
    localStorage.removeItem("token");
    setLoggedinUser(null);
  };

  const getProfile = async () => {
    const token = getToken();

    if (token) {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };

      try {
        const response = await fetch(
          "http://localhost:5003/api/users/myprofile",
          requestOptions
        );
        const result = await response.json();
        console.log("result>>", result);
        setLoggedinUser(result.user);
        // setUserProfile({
        //   userName: result.user.userName,
        //   email: result.user.email,
        //   userPicture: result.user.userPicture,
        // });
        // console.log("userProfile", userProfile);
      } catch (error) {
        console.log("error", error);
      }
    } else {
      console.log("you need to log in first");
      setError("you need to log in first");
      setLoggedinUser(null);
    }
  };

  useEffect(() => {
    const token = getToken();
    console.log("token", token);

    if (token) {
      getProfile(token);
      console.log("LOGGED IN");
    } else {
      console.log("NOT logged in");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        // handleChangeHandler,
        // loginUser,
        // setLoginUser,
        loggedinUser,
        setLoggedinUser,
        login,
        logout,
        message,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
