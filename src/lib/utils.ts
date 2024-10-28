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

export const per_tdoc: { value: number; label: string }[] = [
	{ value: 1, label: "DNI" },
	{ value: 2, label: "Carnet De Extranjería" },
	{ value: 3, label: "Carnet De Residencia" },
	{ value: 4, label: "Partida De Nacimiento" },
	{ value: 5, label: "Pasaporte" },
	{ value: 6, label: "Otro" },
] as const;

export const per_st: Status[] = [
	{ value: "Activo", label: "Activo" },
	{ value: "Cesante", label: "Cesante" },
	{ value: "Adscrito", label: "Adscrito" },
	{ value: "Fallecido", label: "Fallecido" },
] as const;

export const col_st: Status[] = [
	{ value: "Habilitado", label: "Habilitado" },
	{ value: "Inhabilitado", label: "Inhabilitado" },
] as const;

export const per_sexo: Status[] = [
	{ value: "M", label: "Masculino" },
	{ value: "F", label: "Femenino" },
] as const;
