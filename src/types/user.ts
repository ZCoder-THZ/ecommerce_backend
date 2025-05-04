import { userSchema } from "../schemas/auth.schema";
import z from "zod";

export type User = z.infer<typeof userSchema>;

