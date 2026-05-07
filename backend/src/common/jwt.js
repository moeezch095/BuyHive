import jwt from "jsonwebtoken";

export const generateAuthToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,

    { expiresIn: "2d" },
  );
};

// export const  generateResetToken = (userId) => {
//   return jwt.sign(
//     {userId}, process.env.JWT_SECRET,
//     { expiresIn : "30m", }
//   );
// };
