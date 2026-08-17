import z from "zod";

export const getUserSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  role: z.enum(["ADMIN", "USER"]).optional(),
  search: z.string().trim().min(1).max(100).optional(),
  sortBy: z.enum(["name", "email", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type GetUsersInput = z.infer<typeof getUserSchema>;
