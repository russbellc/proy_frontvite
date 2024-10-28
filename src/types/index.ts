import { calcularEdad } from "@/lib/utils";
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

// interface colegiado
export const formSchema = z.object({
    col_nro_cop: z
        .string()
        .min(5, {
            message: "Numero de COP debe tener al menos 5 caracteres",
        })
        .max(8, {
            message: "Numero de COP debe tener maximo 8 caracteres",
        }),
    col_fecha_colegiatura: z.date({
        required_error: "Selecciona una fecha",
    }),
    col_st: z.string({
        required_error: "Selecciona un estado",
    }),
    col_obs: z.string(),
    col_centro_trabajo: z.string().nullable(),
    per_tdoc: z.number({
        required_error: "Selecciona un tipo de documento",
    }),
    per_sexo: z.string({
        required_error: "Selecciona un sexo",
    }),
    per_nro_doc: z
        .string()
        .min(8, {
            message: "Numero de documento debe tener al menos 8 caracteres",
        })
        .max(12, {
            message: "Numero de documento debe tener maximo 12 caracteres",
        }),
    per_nombre: z
        .string()
        .min(2, {
            message: "Nombre debe tener al menos 2 caracteres",
        })
        .max(50),
    per_appat: z
        .string()
        .min(2, {
            message: "Apellido Paterno debe tener al menos 2 caracteres",
        })
        .max(50, {
            message: "Apellido Paterno debe tener maximo 50 caracteres",
        }),
    per_apmat: z
        .string()
        .min(2, {
            message: "Apellido Materno debe tener al menos 2 caracteres",
        })
        .max(50),
    per_correo: z.string().email({
        message: "Correo electronico invalido",
    }),
    per_nacionalidad: z.string().nullable(),
    per_direccion1: z.string().nullable(),
    per_direccion2: z.string().nullable(),
    per_lugar_nac: z.string().nullable(),
    per_fech_nac: z
        .string()
        .refine((fecha) => calcularEdad(fecha) >= 18, {
            message: "Debes tener al menos 18 años",
        })
        .refine((fecha) => calcularEdad(fecha) <= 90, {
            message: "La edad máxima permitida es 90 años",
        }),
    per_st: z.string(),
    per_telf: z.string().nullable(),
    per_celular1: z.string().nullable(),
    per_celular2: z.string().nullable(),
});

export type FormColegiado = z.infer<typeof formSchema>;
