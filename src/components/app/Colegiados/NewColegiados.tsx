import { FC } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Button,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui";
import { calcularEdad, cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

interface Props {
	// isOpen: boolean;
	// setIsOpen: (open: boolean) => void;
}

type Status = {
	value: string;
	label: string;
};

const per_tdoc: Status[] = [
	{ value: "DNI", label: "DNI" },
	{ value: "RUC", label: "RUC" },
] as const;

// const languages = [
// 	{ label: "English", value: "en" },
// 	{ label: "French", value: "fr" },
// 	{ label: "German", value: "de" },
// 	{ label: "Spanish", value: "es" },
// 	{ label: "Portuguese", value: "pt" },
// 	{ label: "Russian", value: "ru" },
// 	{ label: "Japanese", value: "ja" },
// 	{ label: "Korean", value: "ko" },
// 	{ label: "Chinese", value: "zh" },
// ] as const;
// const sexo: Status[] = [
// 	{ value: "M", label: "Masculino" },
// 	{ value: "F", label: "Femenino" },
// ];

const formSchema = z.object({
	language: z.string({
		required_error: "Please select a language.",
	}),
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
				<div className="col-start-3">
					<FormField
						control={form.control}
						name="per_tdoc"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Nro de Documento</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant="outline"
												role="combobox"
												className={cn(
													"w-[200px] justify-between",
													!field.value && "text-muted-foreground"
												)}
											>
												{field.value
													? per_tdoc.find((doc) => doc.value === field.value)?.label
													: "Seleccione un Documento"}
												<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-[200px] p-0">
										<Command>
											<CommandInput placeholder="Busque un Documento..." />
											<CommandList>
												<CommandEmpty>No language found.</CommandEmpty>
												<CommandGroup>
													{per_tdoc.map((doc) => (
														<CommandItem
															value={doc.label}
															key={doc.value}
															onSelect={() => {
																form.setValue("per_tdoc", doc.value);
															}}
														>
															<Check
																className={cn(
																	"mr-2 h-4 w-4",
																	doc.value === field.value
																		? "opacity-100"
																		: "opacity-0"
																)}
															/>
															{doc.label}
														</CommandItem>
													))}
												</CommandGroup>
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>
								<FormDescription>
									This is the language that will be used in the dashboard.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
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
