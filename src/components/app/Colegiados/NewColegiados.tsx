import { FC } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
} from "@/components/ui";
import { calcularEdad } from "@/lib/utils";

interface Props {
	// isOpen: boolean;
	// setIsOpen: (open: boolean) => void;
}

// type Status = {
// 	value: string;
// 	label: string;
// };

// const tdoc: Status[] = [
// 	{ value: "DNI", label: "DNI" },
// 	{ value: "RUC", label: "RUC" },
// ];
// const sexo: Status[] = [
// 	{ value: "M", label: "Masculino" },
// 	{ value: "F", label: "Femenino" },
// ];


const formSchema = z.object({
	per_tdoc: z.string({
		required_error: "Selecciona un tipo de documento",
	}),
	per_sexo: z.string({
		required_error: "Selecciona un sexo",
	}),
	per_nro_doc: z
		.number()
		.min(8, {
			message: "Numero de documento debe tener al menos 8 digitos",
		})
		.max(12, {
			message: "Numero de documento debe tener maximo 12 digitos",
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
	per_correo: z
		.string()
		.email({
			message: "Correo electronico invalido",
		})
		.nullable(),
	per_nacionalidad: z
		.string()
		.min(2, {
			message: "Nacionalidad debe tener al menos 2 caracteres",
		})
		.max(50, {
			message: "Nacionalidad debe tener maximo 50 caracteres",
		})
		.nullable(),
	per_direccion1: z
		.string()
		.min(2, {
			message: "Direccion debe tener al menos 2 caracteres",
		})
		.max(50, {
			message: "Direccion debe tener maximo 50 caracteres",
		})
		.nullable(),
	per_direccion2: z
		.string()
		.min(2, {
			message: "Direccion debe tener al menos 2 caracteres",
		})
		.max(50, {
			message: "Direccion debe tener maximo 50 caracteres",
		})
		.nullable(),
	per_lugar_nac: z.string().min(2).max(50).nullable(),
	per_fech_nac: z
		.date()
		.refine((fecha) => calcularEdad(fecha) >= 18, {
			message: "Debes tener al menos 18 años",
		})
		.refine((fecha) => calcularEdad(fecha) <= 90, {
			message: "La edad máxima permitida es 90 años",
		}),
	per_st: z.string().min(2).max(50).nullable(),
	per_telf: z
		.string()
		.regex(/^\d{6,7}$/, {
			message: "El número de teléfono fijo debe tener entre 6 y 7 dígitos",
		})
		.nullable(),
	per_celular1: z
		.string()
		.regex(/^9\d{8}$/, {
			message: "El número de celular debe tener 9 dígitos y comenzar con '9'",
		})
		.nullable(),
	per_celular2: z
		.string()
		.regex(/^9\d{8}$/, {
			message: "El número de celular debe tener 9 dígitos y comenzar con '9'",
		})
		.nullable(),
});

export const NewColegiados: FC<Props> = () => {
	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			per_tdoc: "DNI",
			per_nro_doc: 0,
			per_nombre: "",
			per_appat: "",
			per_apmat: "",
			per_sexo: "Masculino",
			per_correo: "",
			per_nacionalidad: "",
			per_direccion1: "",
			per_direccion2: "",
			per_lugar_nac: "",
			per_fech_nac: new Date("2008-01-01"),
			per_st: "",
			per_telf: "",
			per_celular1: "",
			per_celular2: "",
		},
	});

	// 2. Define a submit handler.
	const onSubmit = (values: z.infer<typeof formSchema>) => {
		console.log(values);
	};
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="grid grid-cols-1 md:grid-cols-4 lg:grid-rows-5 gap-4"
			>
				{/* per_tdoc */}
				<div className="col-span-2">
					<FormField
						control={form.control}
						name="per_tdoc"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="block text-sm font-semibold">
									Tipo de Documento
								</FormLabel>
								<FormControl>
									<Input placeholder="DNI" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				{/* per_nro_doc */}
				{/* per_nombre */}
				{/* per_appat */}
				{/* per_apmat */}
				{/* per_sexo */}
				{/* per_correo */}
				{/* per_nacionalidad */}
				{/* per_direccion1 */}
				{/* per_direccion2 */}
				{/* per_lugar_nac */}
				{/* per_fech_nac */}
				{/* per_st */}
				{/* per_telf */}
				{/* per_celular1 */}
				{/* per_celular2 */}
				<div className="col-span-2 col-start-1 row-start-6">
					<Button type="submit" size={"default"}>
						Guardar
					</Button>
				</div>
			</form>
		</Form>
	);
};
