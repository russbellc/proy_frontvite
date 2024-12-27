import { FC, useEffect, useState } from "react";
import { debounce } from "lodash";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
	RadioGroup,
	RadioGroupItem,
	Textarea,
} from "@/components/ui";
import { cn, col_st, per_sexo, per_st, per_tdoc } from "@/lib/utils";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FormColegiado, formSchemaCole } from "@/types";
import { createColegiado } from "@/graphql";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks";
import { IdefaultValues } from "@/views/proyects/colegiados";
import { client3 } from "@/client";
import { gql } from "graphql-request";

interface Props {
	id: string;
	defaultValues: IdefaultValues;
}

interface ToastOptions {
	title: string;
	description: string;
	status: "success" | "error" | "info";
}

export const ColegiadosForm: FC<Props> = ({ id, defaultValues }) => {
	const [open, setOpen] = useState(false);
	const [estado, setEstado] = useState(false);
	const [estadoCol, setEstadoCol] = useState(false);
	const [saving, setSaving] = useState(false);
	const navigate = useNavigate();
	const { toast } = useToast();

	// 1. Define your form.
	const form = useForm<FormColegiado>({
		resolver: zodResolver(formSchemaCole),
		defaultValues,
	});

	const saveField = async (fieldName: keyof FormColegiado, value: unknown) => {
		setSaving(true); // Mostrar indicador de guardado
		try {
			// console.log(`Guardando ${fieldName}: ${value}`);
			const { update_persona } = await client3.request<{
				update_persona?: { per_id: number };
			}>(
				gql`
					mutation Update_persona(
						$perId: Int!
						$fieldName: String!
						$value: String
					) {
						update_persona(
							per_id: $perId
							fieldName: $fieldName
							value: $value
						) {
							per_id
						}
					}
				`,
				{
					perId: +id, // Asegurarte de convertir `id` a número si es necesario
					fieldName: fieldName, // Sin comillas adicionales
					value: String(value), // Asegúrate de convertir el valor a string si es necesario
				}
			);
			// await client.request(SAVE_FIELD_MUTATION, { id, fieldName, value });
			console.log(update_persona);
			console.log(saving);
		} catch (error) {
			console.error(`Error al guardar el campo ${fieldName}:`, error);
		} finally {
			setSaving(false); // Ocultar indicador de guardado
		}
	};

	const debouncedSave = debounce(
		(fieldName: keyof FormColegiado, value: unknown) => {
			saveField(fieldName, value);
		},
		1000 // 500 ms de espera antes de ejecutar
	);

	useEffect(() => {
		// Subscribirse a los cambios de todos los campos
		if (id !== "new") {
			const subscription = form.watch((value, { name }) => {
				if (name) {
					debouncedSave(name as keyof FormColegiado, value[name]);
				}
			});

			return () => subscription.unsubscribe();
		}
	}, [debouncedSave, form, id]);

	// 2. Define a submit handler.
	const onSubmit = async (values: FormColegiado) => {
		// createColegiado2(values, id)
		const result = await createColegiado(values, id);

		if (result) {
			const { data, success, msg } = result;
			if (success && data) {
				console.log(data); // Aquí puedes acceder a los datos si la creación fue exitosa
				navigate("/colegiados/");
				// return toast mesage sussess save data
				toast({
					title: "Éxito",
					description: "Datos guardados correctamente.",
					status: "success",
				} as ToastOptions);
			} else {
				console.log(data, success, msg); // Mensaje de error o cualquier otro mensaje
			}
		} else {
			console.log("Error desconocido, no se obtuvo respuesta.");
		}
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
									<FormLabel
										className={cn(
											"block text-sm font-semibold",
											!field.value && "text-muted-foreground"
										)}
									>
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
									<FormLabel
										className={cn(
											"block text-sm font-semibold",
											!field.value && "text-muted-foreground"
										)}
									>
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
									<FormLabel
										className={cn(
											"block text-sm font-semibold",
											!field.value && "text-muted-foreground"
										)}
									>
										Nro. COP
									</FormLabel>
									<FormControl>
										<Input placeholder="Nro COP" {...field} maxLength={8} />
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
														"w-auto pl-3 text-left font-normal",
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
					<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
						<FormField
							control={form.control}
							name="per_sexo"
							render={({ field }) => (
								<FormItem className="space-y-3">
									<FormLabel
										className={cn(
											"block text-sm font-semibold",
											!field.value && "text-muted-foreground"
										)}
									>
										Sexo
									</FormLabel>
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
											className="flex space-x-4"
										>
											{per_sexo.map((sexo) => (
												<FormItem
													key={sexo.value}
													className="flex items-end space-x-2"
												>
													<FormControl className="rounded-full">
														<RadioGroupItem
															value={sexo.value}
															className="h-4 w-4"
														/>
													</FormControl>
													<FormLabel className="font-normal">
														{sexo.label}
													</FormLabel>
												</FormItem>
											))}
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					{/* per_nombre */}
					<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
						<FormField
							control={form.control}
							name="per_nombre"
							render={({ field }) => (
								<FormItem>
									<FormLabel
										className={cn(
											"block text-sm font-semibold",
											!field.value && "text-muted-foreground"
										)}
									>
										Nombre Completo
									</FormLabel>
									<FormControl>
										<Input placeholder="Nombre Completo" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					{/* per_appat */}
					<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
						<FormField
							control={form.control}
							name="per_appat"
							render={({ field }) => (
								<FormItem>
									<FormLabel
										className={cn(
											"block text-sm font-semibold",
											!field.value && "text-muted-foreground"
										)}
									>
										Apellido Paterno
									</FormLabel>
									<FormControl>
										<Input placeholder="Apellido Paterno" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					{/* per_apmat */}
					<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
						<FormField
							control={form.control}
							name="per_apmat"
							render={({ field }) => (
								<FormItem>
									<FormLabel
										className={cn(
											"block text-sm font-semibold",
											!field.value && "text-muted-foreground"
										)}
									>
										Apellido Materno
									</FormLabel>
									<FormControl>
										<Input placeholder="Apellido Materno" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					{/* per_correo */}
					<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
						<FormField
							control={form.control}
							name="per_correo"
							render={({ field }) => (
								<FormItem>
									<FormLabel
										className={cn(
											"block text-sm font-semibold",
											!field.value && "text-muted-foreground"
										)}
									>
										Correo Electrónico
									</FormLabel>
									<FormControl>
										<Input placeholder="Correo Electrónico" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					{/* per_nacionalidad */}
					<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
						<FormField
							control={form.control}
							name="per_nacionalidad"
							render={({ field }) => (
								<FormItem>
									<FormLabel
										className={cn(
											"block text-sm font-semibold",
											!field.value && "text-muted-foreground"
										)}
									>
										Nacionalidad
									</FormLabel>
									<FormControl>
										<Input placeholder="Nacionalidad" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					{/* per_direccion1 */}
					<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-2/6">
						<FormField
							control={form.control}
							name="per_direccion1"
							render={({ field }) => (
								<FormItem>
									<FormLabel
										className={cn(
											"block text-sm font-semibold",
											!field.value && "text-muted-foreground"
										)}
									>
										Dirección 1
									</FormLabel>
									<FormControl>
										<Input placeholder="Dirección" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					{/* per_direccion2 */}
					<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-2/6">
						<FormField
							control={form.control}
							name="per_direccion2"
							render={({ field }) => (
								<FormItem>
									<FormLabel
										className={cn(
											"block text-sm font-semibold",
											!field.value && "text-muted-foreground"
										)}
									>
										Dirección 2
									</FormLabel>
									<FormControl>
										<Input placeholder="Dirección" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					{/* per_lugar_nac */}
					<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
						<FormField
							control={form.control}
							name="per_lugar_nac"
							render={({ field }) => (
								<FormItem>
									<FormLabel
										className={cn(
											"block text-sm font-semibold",
											!field.value && "text-muted-foreground"
										)}
									>
										Ubigeo de Nacimiento
									</FormLabel>
									<FormControl>
										<Input placeholder="070101" {...field} maxLength={6} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					{/* per_fech_nac */}
					<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
						<FormField
							control={form.control}
							name="per_fech_nac"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel
										className={cn(
											"block text-sm font-semibold",
											!field.value && "text-muted-foreground"
										)}
									>
										Fecha de nacimiento
									</FormLabel>
									<FormControl>
										<Input type="date" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					{/* per_st */}
					<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
						<FormField
							control={form.control}
							name="per_st"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel
										className={cn(
											"block text-sm font-semibold",
											!field.value && "text-muted-foreground"
										)}
									>
										Estado actual
									</FormLabel>
									<Popover open={estado} onOpenChange={setEstado}>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													role="combobox"
													aria-expanded={estado}
													className={cn(
														"w-auto justify-between",
														!field.value && "text-muted-foreground"
													)}
												>
													{field.value
														? per_st.find((doc) => doc.value === field.value)
																?.label
														: "Selecciona un estado"}
													<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-40 p-0">
											<Command>
												<CommandInput placeholder="Busque un estado..." />
												<CommandList>
													<CommandEmpty>
														No se encontró ningún estado.
													</CommandEmpty>
													<CommandGroup>
														{per_st.map((doc) => (
															<CommandItem
																value={doc.label}
																key={doc.value}
																onSelect={() => {
																	form.setValue("per_st", doc.value);
																	setEstado(false);
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
					{/* per_telf */}
					<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
						<FormField
							control={form.control}
							name="per_telf"
							render={({ field }) => (
								<FormItem>
									<FormLabel
										className={cn(
											"block text-sm font-semibold",
											!field.value && "text-muted-foreground"
										)}
									>
										Número de teléfono
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Número de teléfono"
											{...field}
											maxLength={9}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					{/* per_celular1 */}
					<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
						<FormField
							control={form.control}
							name="per_celular1"
							render={({ field }) => (
								<FormItem>
									<FormLabel
										className={cn(
											"block text-sm font-semibold",
											!field.value && "text-muted-foreground"
										)}
									>
										Número de celular 1
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Número de celular"
											{...field}
											maxLength={9}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					{/* per_celular2 */}
					<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
						<FormField
							control={form.control}
							name="per_celular2"
							render={({ field }) => (
								<FormItem>
									<FormLabel
										className={cn(
											"block text-sm font-semibold",
											!field.value && "text-muted-foreground"
										)}
									>
										Número de celular 2
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Número de celular"
											{...field}
											maxLength={9}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					{/* col_st */}
					<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
						<FormField
							control={form.control}
							name="col_st"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel
										className={cn(
											"block text-sm font-semibold",
											!field.value && "text-muted-foreground"
										)}
									>
										Estado del Colegiado
									</FormLabel>
									<Popover open={estadoCol} onOpenChange={setEstadoCol}>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													role="combobox"
													aria-expanded={estadoCol}
													className={cn(
														"w-auto justify-between",
														!field.value && "text-muted-foreground",
														field.value === "Habilitado"
															? "bg-green-700"
															: "bg-red-700"
													)}
												>
													{field.value
														? col_st.find((doc) => doc.value === field.value)
																?.label
														: "Selecciona un estado"}
													<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-40 p-0">
											<Command>
												<CommandInput placeholder="Busque un estado..." />
												<CommandList>
													<CommandEmpty>
														No se encontró ningún estado.
													</CommandEmpty>
													<CommandGroup>
														{col_st.map((doc) => (
															<CommandItem
																value={doc.label}
																key={doc.value}
																onSelect={() => {
																	form.setValue("col_st", doc.value);
																	setEstadoCol(false);
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
					{/* col_centro_trabajo */}
					<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-2/6">
						<FormField
							control={form.control}
							name="col_centro_trabajo"
							render={({ field }) => (
								<FormItem>
									<FormLabel
										className={cn(
											"block text-sm font-semibold",
											!field.value && "text-muted-foreground"
										)}
									>
										Centro de trabajo
									</FormLabel>
									<FormControl>
										<Input placeholder="Centro de trabajo" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					{/* col_obs */}
					<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-5/6">
						<FormField
							control={form.control}
							name="col_obs"
							render={({ field }) => (
								<FormItem>
									<FormLabel
										className={cn(
											"block text-sm font-semibold",
											!field.value && "text-muted-foreground"
										)}
									>
										Obserbaciones
									</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Obserbaciones"
											className="resize-x"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					{id == "new" && (
						<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-6/6">
							<Button
								type="submit"
								variant="secondary"
								size="default"
								className="w-full sm:w-auto"
							>
								Guardar
							</Button>
						</div>
					)}
				</div>
			</form>
		</Form>
	);
};
