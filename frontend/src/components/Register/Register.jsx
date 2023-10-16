import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { style } from "../../utils/style.js";

export default function Register() {
  const { visible, setVisible } = useContext(UserContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  /* getting the registration details from the user to register as a new user */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    try {
      const response = await axios.post(
        process.env.REACT_APP_BASE_URL + "/user/register",
        {
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          email: formData.get("email"),
          password: formData.get("password"),
        }
      );

      if (response.status === 201) {
        navigate("/");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
      console.log(error);
    }
  };

  return (
    <div className=" flex justify-center items-center h-full mt-10 dark:text-snow">
      {/* registration form */}
      <form onSubmit={handleSubmit}>
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg flex flex-col items-center bg-gray-200 drop-shadow-lg  dark:bg-bg-xiketic dark:shadow-6xl">
          <p className="title-font text-2xl mb-4">Register</p>
          <p className="text-red-600">{error}</p>
          <div className="relative mb-4">
            <input
              className={style.inputStyleClass}
              label="First Name"
              placeholder="First name"
              type="text"
              autoComplete="firstName"
              name="firstName"
              required
            />
          </div>
          <div className="relative mb-4">
            <input
              className={style.inputStyleClass}
              label="Last Name"
              placeholder="Last name"
              type="text"
              autoComplete="lastName"
              name="lastName"
              required
            />
          </div>
          <div className="relative mb-4">
            <input
              className={style.inputStyleClass}
              label="Email"
              placeholder=" E-mail"
              type="email"
              autoComplete="email"
              name="email"
              required
            />
          </div>
          <div className="relative mb-4">
            <input
              className={style.inputStyleClass}
              label="Password"
              placeholder="Password"
              type={visible ? "text" : "password"}
              autoComplete="new-password"
              name="password"
              required
            />
            {/* to show / hide password */}
            <span
              className="absolute right-5 top-3"
              onClick={() => setVisible(!visible)}
            >
              {!visible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          <button className={style.buttonStyleClass} type="submit">
            Register
          </button>

          <p className="register-link">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 " variant="contained">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
