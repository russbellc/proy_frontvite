import { z } from "zod";


// interface de Autenticacion
const authSchema = z.object({
    name: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(8).max(20),
    password_confirmation: z.string().min(8).max(20)
});

type Auth = z.infer<typeof authSchema>;
export type UserLoginForm = Pick<Auth, 'email' | 'password'>
