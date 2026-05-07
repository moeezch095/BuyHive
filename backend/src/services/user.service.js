import bcrypt from "bcrypt";
import prisma from "../config/prismaClient.js";
import { generateAuthToken } from "../common/jwt.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../common/email.js";
import { generateResetToken } from "../common/token.js";
import { blacklistedTokens } from "../common/tokenBlacklist.js";

export const registerUser = async (data) => {
  console.log("register");
  const {
    first_name,
    last_name,
    company_name,
    country,
    email,
    phone_number,
    password,
  } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  console.log("abc");
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  console.log("data recived");

  const user = await prisma.user.create({
    data: {
      first_name,
      last_name,
      company_name,
      country,
      email,
      phone_number,
      password: hashedPassword,
    },
  });

  console.log("created");
  return user;
};

export const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }
  console.log("above token ");
  const token = generateAuthToken(user.id);
  console.log("token");
  return { user, token };
};

export const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("User not found");
  }

  const resetToken = generateResetToken();

  const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
  await prisma.user.update({
    where: { email },
    data: {
      reset_token: resetToken,
      reset_token_exp: resetTokenExpiry,
    },
  });

  const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

  await sendEmail(
    user.email,
    "Reset Your Password",
    `
      <h2>Password Reset Request</h2>

      <p>Click below to reset your password:</p>

      <a href="${resetLink}"
         style="display:inline-block;padding:10px 15px;background:#4CAF50;color:white;text-decoration:none;border-radius:5px;">
        Reset Password
      </a>

      <p>If button not working:</p>
      <p>${resetLink}</p>

      <p style="color:red;">This link expires in 15 minutes.</p>
    `,
  );

  //     const token = generateResetToken(user.id);

  //  const resetLink = `http://localhost:5173/reset-password?token=${token}`;
  // await sendEmail(
  //   user.email,
  //   "Password Reset Request",
  //   `
  //     <h2>Reset Your Password</h2>
  //     <p>You requested to reset your password.</p>

  //     <p>Click the button below to reset your password:</p>

  //     <a href="${resetLink}"
  //        style="display:inline-block;padding:10px 15px;background:#4CAF50;color:white;text-decoration:none;border-radius:5px;">
  //       Reset Password
  //     </a>

  //     <p style="margin-top:20px;">
  //       If button not working, copy this link:
  //     </p>

  //     <p>${resetLink}</p>
  //   `
  // );

  //   await sendEmail(
  //     user.email,
  //     "Password Reset",
  //     `
  // Your reset token:

  // ${token}

  // Use this token in reset password API.
  // `
  //   );

  // console.log(`Reset link: http://localhost:3000/reset-password?token=${token}`);
  return true;
};

export const resetPassword = async (resetToken, newPassword) => {
  const user = await prisma.user.findFirst({
    where: {
      reset_token: resetToken,
      reset_token_exp: {
        gte: new Date(), // not expired
      },
    },
  });

  if (!user) {
    throw new Error("Invalid or expired token");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      reset_token: null,
      reset_token_exp: null,
    },
  });

  return true;
};

// export const resetPassword = async (token , newPassword) => {
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     await prisma.user.update({
//       where : {id: decoded.userId},
//       data: { password : hashedPassword },
//     });
//     return true;

//   }  catch (err) {
//     console.log("other error :", err.message);
//     throw new Error("Invalid or expired token ");
//   }
// };



export const logoutUser = async (token) => {
  // token ko blacklist me daal do
  blacklistedTokens.add(token);

  return { message: "Logout successful" };
};