import { FC, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Button,
	Calendar,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	Form,
	FormControl,
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
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
	{ value: "CARNET DE EXTRANJERIA", label: "CARNET DE EXTRANJERIA" },
	{ value: "PASAPORTE", label: "PASAPORTE" },
	{ value: "CARNET DE RESIDENCIA", label: "CARNET DE RESIDENCIA" },
	{ value: "PARTIDA DE NACIMIENTO", label: "PARTIDA DE NACIMIENTO" },
	{ value: "OTRO", label: "OTRO" },
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
	per_tdoc: z.string({
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
	const [open, setOpen] = useState(false);
	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			per_tdoc: "DNI",
			// per_nro_doc: 0,
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
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
					{/* per_tdoc */}
					<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
						<FormField
							control={form.control}
							name="per_tdoc"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel className={cn(
											"block text-sm font-semibold",
											!field.value && "text-muted-foreground"
										)}>
										Tipo de Documento
									</FormLabel>
									<Popover open={open} onOpenChange={setOpen}>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													role="combobox"
													aria-expanded={open}
													className={cn(
														"w-auto justify-between",
														!field.value && "text-muted-foreground"
													)}
												>
													{field.value
														? per_tdoc.find((doc) => doc.value === field.value)
																?.label
														: "Seleccione un Documento"}
													<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-64 p-0">
											<Command>
												<CommandInput placeholder="Busque un Documento..." />
												<CommandList>
													<CommandEmpty>
														No se encontraron Documentos que coincidan con la
														busqueda.
													</CommandEmpty>
													<CommandGroup>
														{per_tdoc.map((doc) => (
															<CommandItem
																value={doc.label}
																key={doc.value}
																onSelect={() => {
																	form.setValue("per_tdoc", doc.value);
																	setOpen(false);
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
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					{/* per_nro_doc */}
					<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
						<FormField
							control={form.control}
							name="per_nro_doc"
							render={({ field }) => (
								<FormItem>
									<FormLabel className={cn(
											"block text-sm font-semibold",
											!field.value && "text-muted-foreground"
										)}>
										Nro de Documento
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Nro de Documento"
											{...field}
											maxLength={12}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					{/* col_nro_cop */}
					<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
						<FormField
							control={form.control}
							name="col_nro_cop"
							render={({ field }) => (
								<FormItem>
									<FormLabel className={cn(
											"block text-sm font-semibold",
											!field.value && "text-muted-foreground"
										)}>
										Nro. COP
									</FormLabel>
									<FormControl>
										<Input placeholder="Nro COP" {...field} maxLength={12} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					{/* col_fecha_colegiatura */}
					<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
						<FormField
							control={form.control}
							name="col_fecha_colegiatura"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel
										className={cn(
											"block text-sm font-semibold",
											!field.value && "text-muted-foreground"
										)}
									>
										Fecha de colegiatura
									</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={"outline"}
													className={cn(
														"w-[240px] pl-3 text-left font-normal",
														!field.value && "text-muted-foreground"
													)}
												>
													{field.value ? (
														format(field.value, "PPP", { locale: es })
													) : (
														<span>Selecciona una fecha</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={field.onChange}
												disabled={(date) =>
													date > new Date() || date < new Date("1900-01-01")
												}
												initialFocus
												locale={es}
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					{/* per_sexo */}
					<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">5</div>
					{/* per_nombre */}
					<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">6</div>
					{/* per_appat */}
					{/* per_apmat */}
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
				</div>
			</form>
		</Form>
	);
};
