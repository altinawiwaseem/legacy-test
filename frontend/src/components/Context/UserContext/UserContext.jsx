import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserContext = createContext(null);
const UserContextProvider = ({ children }) => {
  const [error, setError] = useState("");
  const [user, setUser] = useState("");
  const [token, setToken] = useState("");

  //sign in the right user from db
  const [signIn, setSignIn] = useState({});
  //for eye icon in password
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  /* getting the user data and setting to local storage */
  const userData = async (formData) => {
    try {
      await axios
        .post(
          process.env.REACT_APP_BASE_URL + "/user/login",
          {
            email: formData.get("email"),
            password: formData.get("password"),
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          const { token, user } = response.data;
          localStorage.setItem("token", JSON.stringify(token));
          localStorage.setItem("user", JSON.stringify(user));
          setError("");
          navigate("/");
        })
        .then(() => {
          localStorageUser();
        });

      setError("");
      navigate("/");
      return;
    } catch (error) {
      console.log(error);
      setError(" The email address or password is incorrect ");
    }
  };
  /* logout the user and clear local storage */
  const handleLogout = async () => {
    try {
      await axios
        .get(process.env.REACT_APP_BASE_URL + "/user/logout", {
          withCredentials: true,
        })
        .then(() => {
          setUser("");
        })
        .then(localStorage.clear("user"))
        .then(() => navigate("/"));
    } catch (error) {
      console.log(error);
    }
  };
  /* getting the user details from local storage */
  const localStorageUser = () => {
    let user = localStorage.getItem("user");

    if (user) {
      user = JSON.parse(localStorage.getItem("user"));
    }

    let token = localStorage.getItem("token");

    if (token) {
      token = JSON.parse(localStorage.getItem("token"));
    }

    setUser(user);
    setToken(token);

    return;
  };

  const getUser = async () => {
    try {
      await axios
        .post(
          process.env.REACT_APP_BASE_URL + "/user/userData",
          { id: user?._id },
          {
            withCredentials: true,
          }
        )
        .then(() => {
          localStorageUser();
        });
      return;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    localStorageUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        userData,
        error,
        user,
        setUser,
        token,
        handleLogout,
        getUser,
        signIn,
        setSignIn,
        visible,
        setVisible,
        localStorageUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export { UserContext, UserContextProvider };
