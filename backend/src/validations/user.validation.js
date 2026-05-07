import { z } from "zod";

export const registerSchema = z.object({
  first_name: z.string().min(3, "first name must be at lesat 3 characters"),
  last_name: z.string().min(2),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "password must be at lesat 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  reset_token: z.string().min(10, "Invalid token from validation"),
  newPassword: z.string().min(6, "Password is too short"),
});
