import { z } from "zod";

export const schema_CreateCandidateAccount = z
  .object({
    fullname: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((value) => value.confirmPassword === value.password, {
    message: "confirmation password doesn't match your password",
    path: ["confirmPassword"]
  });

export const schema_Authentication = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})
