import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} from "../services/user.service.js";
import { logoutUser } from "../services/user.service.js";
import prisma from "../config/prismaClient.js";

console.log(" controllers");

export const registerController = async (req, res) => {
  console.log("start");
  try {
    console.log("data recived");
    const user = await registerUser(req.body);
    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.status(200).json({
      message: "Login successful",
      result,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    await forgotPassword(email);
    res.json({ message: "Resent link is send" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { reset_token, newPassword } = req.body;
    await resetPassword(reset_token, newPassword);
    res.status(201).json({ message: "Password update successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


export const logoutController = async (req, res) => {
  try {
    const token = req.headers.authorization;

    const result = await logoutUser(token);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
