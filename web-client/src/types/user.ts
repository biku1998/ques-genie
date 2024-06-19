import { z } from "zod";

const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
  avatarUrl: z.string().nullable(),
});

export type User = z.infer<typeof UserSchema>;
