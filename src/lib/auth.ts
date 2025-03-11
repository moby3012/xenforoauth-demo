// src/lib/auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "./auth-options";

export const getServerAuthSession = () => getServerSession(authOptions);
