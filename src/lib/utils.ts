import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const calcularEdad = (fechaNacimiento: string): number => {
  const fechaNacimientoJS = new Date(fechaNacimiento);
  const hoy = new Date();
  const diferencia = hoy.getTime() - fechaNacimientoJS.getTime();
  const edad = new Date(diferencia).getUTCFullYear() - 1970;
  return edad;
};


type Status = {
	value: string;
	label: string;
};

export const per_tdoc: Status[] = [
	{ value: "DNI", label: "DNI" },
	{ value: "CARNET DE EXTRANJERIA", label: "CARNET DE EXTRANJERIA" },
	{ value: "PASAPORTE", label: "PASAPORTE" },
	{ value: "CARNET DE RESIDENCIA", label: "CARNET DE RESIDENCIA" },
	{ value: "PARTIDA DE NACIMIENTO", label: "PARTIDA DE NACIMIENTO" },
	{ value: "OTRO", label: "OTRO" },
] as const;

export const per_st: Status[] = [
	{ value: "ACTIVO", label: "ACTIVO" },
	{ value: "CESANTE", label: "CESANTE" },
	{ value: "ADSCRITO", label: "ADSCRITO" },
	{ value: "FALLECIDO", label: "FALLECIDO" },
] as const;

export const col_st: Status[] = [
	{ value: "HABILITADO", label: "HABILITADO" },
	{ value: "INHABILITADO", label: "INHABILITADO" },
] as const;

export const per_sexo: Status[] = [
	{ value: "M", label: "Masculino" },
	{ value: "F", label: "Femenino" },
] as const;