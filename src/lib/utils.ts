import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const calcularEdad = (fechaNacimiento: Date): number => {
  const hoy = new Date();
  const diferencia = hoy.getTime() - fechaNacimiento.getTime();
  const edad = new Date(diferencia).getUTCFullYear() - 1970;
  return edad;
};
