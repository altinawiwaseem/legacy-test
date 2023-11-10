import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { generateToken } from "../helpers/authenticationHelper.js";
import { User } from "../models/user.js";
dotenv.config();
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

//registrating a new user
export const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  // Check if the provided password meets the strength requirements
  if (!strongPasswordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 11);
  try {
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(409).json({ message: "User is already registered!" });
    }
    const createdUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({ message: "User created", createdUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//login an existing user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: " user not found" });
    }
    //checking password that exists at the db and the user given from frontend
    const checkPassword = await bcrypt.compare(password, user.password);
    if (checkPassword) {
      //generating a token for the user using JWT passport
      const user = await User.findOne({ email }).select("-password");
      const token = await generateToken(user);

      return res
        .status(200)
        .cookie("jwt", token, {
          httpOnly: true,
          secure: false,
          sameSite: false,
        })

        .json({ user, token });
    } else {
      return res.status(400).json({ message: "No access granted" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//getting the user data from db
export const getUserData = async (req, res) => {
  const { id } = req.body;

  try {
    const userData = await User.findOne({ _id: id });

    return res.status(200).json(userData);
  } catch (error) {
    return res.send(error.message);
  }
};

//logout of user by clearing all the cookies
export const logout = async (req, res, next) => {
  try {
    res
      .clearCookie("jwt", {
        httpOnly: true,
        secure: false,
        sameSite: false,
      })
      .send("User logged out");
  } catch (error) {
    res.send(error);
  }
};
