import z from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be atleast 3 character."),

  email: z.email("Invalid email address"),

  password: z.string().min(6, "Password must be atleast 6 character."),
});
