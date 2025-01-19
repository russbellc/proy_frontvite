import { FC, useEffect, useState } from "react";
import { debounce } from "lodash";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Button,
	Calendar,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Checkbox,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	Drawer,
	DrawerContent,
	DrawerTrigger,
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
	Textarea,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FormPago, formSchemaPago } from "@/types";
import { createPago } from "@/graphql";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks";
import { IdefaultValues } from "@/views/proyects/pagos";
import { client3 } from "@/client";
import { gql } from "graphql-request";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Copy } from "lucide-react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Props {
	id: string;
	defaultValues: IdefaultValues;
}

interface ToastOptions {
	title: string;
	description: string;
	status: "success" | "error" | "info";
}

type Status = {
	value: string;
	label: string;
};

const pages: Status[] = [
	{
		value: "5",
		label: "5",
	},
	{
		value: "10",
		label: "10",
	},
	{
		value: "20",
		label: "20",
	},
	{
		value: "50",
		label: "50",
	},
	{
		value: "100",
		label: "100",
	},
];

export const PagosForm: FC<Props> = ({ id, defaultValues }) => {
	const [Pago, setPago] = useState([
		{
			aport_id: null,
			aport_mes: 1,
			aport_mes_desc: "Enero",
			aport_monto: 20,
		},
		{
			aport_id: null,
			aport_mes: 2,
			aport_mes_desc: "Febrero",
			aport_monto: 20,
		},
		{
			aport_id: null,
			aport_mes: 3,
			aport_mes_desc: "Marzo",
			aport_monto: 20,
		},
	]);
	// const [open, setOpen] = useState(false);
	const [saving, setSaving] = useState(false);

	const [open, setOpen] = useState<boolean>(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
	const navigate = useNavigate();
	const { toast } = useToast();
	const [dialogOpen, setDialogOpen] = useState<boolean>(true); // Estado para el Dialog inicial

	const get_periodo = gql`
		{
			getAll_periodos {
				period_id
				period_anio
			}
		}
	`;

	useEffect(() => {
		setOpen(true); // Abrir el Dialog al entrar en el formulario
	}, []);

	// 1. Define your form.
	const form = useForm<FormPago>({
		resolver: zodResolver(formSchemaPago),
		defaultValues,
	});

	const saveField = async (fieldName: keyof FormPago, value: unknown) => {
		setSaving(true); // Mostrar indicador de guardado
		try {
			const { update_pago } = await client3.request<{
				update_pago?: { pago_id: number };
			}>(
				gql`
					mutation Update_pago(
						$pagoId: Int!
						$fieldName: String!
						$value: String
					) {
						update_pago(
							pago_id: $pagoId
							fieldName: $fieldName
							value: $value
						) {
							pago_id
						}
					}
				`,
				{
					pagoId: +id, // Asegurarte de convertir `id` a número si es necesario
					fieldName: fieldName, // Sin comillas adicionales
					value: String(value), // Asegúrate de convertir el valor a string si es necesario
				}
			);
			console.log(update_pago);
			console.log(saving);
		} catch (error) {
			console.error(`Error al guardar el campo ${fieldName}:`, error);
		} finally {
			setSaving(false); // Ocultar indicador de guardado
		}
	};

	const debouncedSave = debounce(
		(fieldName: keyof FormPago, value: unknown) => {
			saveField(fieldName, value);
		},
		1000 // 500 ms de espera antes de ejecutar
	);

	useEffect(() => {
		// Subscribirse a los cambios de todos los campos
		if (id !== "new") {
			const subscription = form.watch((value, { name }) => {
				if (name) {
					debouncedSave(name as keyof FormPago, value[name]);
				}
			});

			return () => subscription.unsubscribe();
		}
	}, [debouncedSave, form, id]);

	// 2. Define a submit handler.
	const onSubmit = async (values: FormPago) => {
		console.log(values);
		const result = await createPago(values, id);

		if (result) {
			const { data, success, msg } = result;
			if (success && data) {
				console.log(data); // Aquí puedes acceder a los datos si la creación fue exitosa
				navigate("/pagos/");
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
		<>
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Buscar Colegiado</DialogTitle>
						<DialogDescription>
							Busca y selecciona un colegiado de la lista.
						</DialogDescription>
					</DialogHeader>
					<div className="flex items-center space-x-2">
						<div className="grid flex-1 gap-2">
							<Label htmlFor="search" className="sr-only">
								Buscar
							</Label>
							<Input id="search" placeholder="Buscar colegiado..." />
						</div>
					</div>
					<div className="mt-4">
						{/* Aquí iría el listado de nombres de colegiados */}
						<ul>
							<li>Colegiado 1</li>
							<li>Colegiado 2</li>
							<li>Colegiado 3</li>
							{/* Agregar más colegiados según sea necesario */}
						</ul>
					</div>
					<DialogFooter className="sm:justify-start">
						<DialogClose asChild>
							<Button type="button" variant="secondary">
								Cerrar
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
						{/* persona_name */}
						<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
							<FormField
								control={form.control}
								name="persona_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel
											className={cn(
												"block text-sm font-semibold",
												!field.value && "text-muted-foreground"
											)}
										>
											Nombre del Colegiado
										</FormLabel>
										<FormControl>
											<Input
												placeholder="Nro de Boleta/Venta"
												{...field}
												className="bg-accent"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						{/* pago_fecha */}
						<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
							<FormField
								control={form.control}
								name="pago_fecha"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel
											className={cn(
												"block text-sm font-semibold",
												!field.value && "text-muted-foreground"
											)}
										>
											Fecha de Pago
										</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"w-auto pl-3 text-left font-normal bg-accent",
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
						{/* pago_monto_total */}
						<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
							<FormField
								control={form.control}
								name="pago_monto_total"
								render={({ field }) => (
									<FormItem>
										<FormLabel
											className={cn(
												"block text-sm font-semibold",
												!field.value && "text-muted-foreground"
											)}
										>
											Monto Total
										</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.01"
												className="bg-accent"
												placeholder="Monto Total"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						{/* pago_nro_boletaventa */}
						<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
							<FormField
								control={form.control}
								name="pago_nro_boletaventa"
								render={({ field }) => (
									<FormItem>
										<FormLabel
											className={cn(
												"block text-sm font-semibold",
												!field.value && "text-muted-foreground"
											)}
										>
											Nro de Boleta/Venta
										</FormLabel>
										<FormControl>
											<Input
												placeholder="Nro de Boleta/Venta"
												{...field}
												className="bg-accent"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						{/* pago_recibo */}
						<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
							<FormField
								control={form.control}
								name="pago_recibo"
								render={({ field }) => (
									<FormItem>
										<FormLabel
											className={cn(
												"block text-sm font-semibold",
												!field.value && "text-muted-foreground"
											)}
										>
											Recibo
										</FormLabel>
										<FormControl>
											<div className="flex">
												<span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
													S/.
												</span>
												<Input
													placeholder="Recibo"
													{...field}
													className="bg-accent rounded-l-none"
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						{/* pago_notas */}
						<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-5/6">
							<FormField
								control={form.control}
								name="pago_notas"
								render={({ field }) => (
									<FormItem>
										<FormLabel
											className={cn(
												"block text-sm font-semibold",
												!field.value && "text-muted-foreground"
											)}
										>
											Notas
										</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Notas"
												className="resize-x bg-accent"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						{/* pago_aporte */}
						<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
							<FormField
								control={form.control}
								name="pago_aporte"
								render={({ field }) => (
									<FormItem>
										<FormLabel
											className={cn(
												"block text-sm font-semibold",
												!field.value && "text-muted-foreground"
											)}
										>
											Aporte
										</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.01"
												className="bg-accent"
												placeholder="Aporte"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						{/* pago_otros */}
						<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
							<FormField
								control={form.control}
								name="pago_otros"
								render={({ field }) => (
									<FormItem>
										<FormLabel
											className={cn(
												"block text-sm font-semibold",
												!field.value && "text-muted-foreground"
											)}
										>
											Otros
										</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.01"
												className="bg-accent"
												placeholder="Otros"
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
						<div>
							<div>
								{isDesktop ? (
									<Popover open={open} onOpenChange={setOpen}>
										<PopoverTrigger asChild>
											<Button
												variant="secondary"
												className="w-[150px] justify-start bg-accent"
											>
												{selectedStatus ? (
													<>{selectedStatus.label} Registros</>
												) : (
													<> Registros </>
												)}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-[200px] p-0" align="start">
											<StatusList
												setOpen={setOpen}
												setSelectedStatus={setSelectedStatus}
											/>
										</PopoverContent>
									</Popover>
								) : (
									<Drawer open={open} onOpenChange={setOpen}>
										<DrawerTrigger asChild>
											<Button
												variant="secondary"
												className="w-[150px] justify-start"
											>
												{selectedStatus ? (
													<>{selectedStatus.label} Registros</>
												) : (
													<> Registros </>
												)}
											</Button>
										</DrawerTrigger>
										<DrawerContent>
											<div className="mt-4 border-t">
												<StatusList
													setOpen={setOpen}
													setSelectedStatus={setSelectedStatus}
												/>
											</div>
										</DrawerContent>
									</Drawer>
								)}
							</div>
						</div>
					</div>
					<div>
						<div className="flex justify-between my-5">
							<Card className="w-full">
								<CardHeader>
									<CardTitle className="flex flex-col sm:flex-row justify-between">
										<p>Aporte Año: 2025</p>
										<div className="flex flex-col sm:flex-row justify-start mt-2 sm:mt-0">
											<div className="flex justify-between">
												<Button variant={"destructive"}>Cancelar</Button>
												<div className="flex items-center sm:mt-0 sm:ml-4">
													<Checkbox id={`terms-`} className="mr-2" />
													<label
														htmlFor={`terms-`}
														className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
													>
														Seleccionar Todos
													</label>
												</div>
											</div>
										</div>
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
										{[
											"Enero",
											"Febrero",
											"Marzo",
											"Abril",
											"Mayo",
											"Junio",
											"Julio",
											"Agosto",
											"Septiembre",
											"Octubre",
											"Noviembre",
											"Diciembre",
										].map((mes) => (
											<div key={mes} className="border rounded-lg p-4">
												<FormItem className="flex items-center space-x-4">
													<Checkbox id={`terms-${mes}`} className="mt-2" />
													<label
														htmlFor={`terms-${mes}`}
														className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
													>
														{mes}
													</label>
													<FormField
														control={form.control}
														name="pago_recibo"
														render={({ field }) => (
															<FormControl className="flex-1">
																<div className="flex">
																	<span className="inline-flex items-center px-2 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
																		S/.
																	</span>
																	<Input
																		placeholder="Recibo"
																		{...field}
																		className="bg-accent rounded-l-none"
																	/>
																</div>
															</FormControl>
														)}
													/>
													<FormMessage />
												</FormItem>
											</div>
										))}
									</div>
								</CardContent>
								{/* <CardFooter className="flex justify-start "></CardFooter> */}
							</Card>
						</div>
					</div>
				</form>
			</Form>
		</>
	);
};

function StatusList({
	setOpen,
	setSelectedStatus,
}: {
	setOpen: (open: boolean) => void;
	setSelectedStatus: (status: Status | null) => void;
}) {
	return (
		<Command>
			<CommandInput placeholder="Nro de resultados..." />
			<CommandList>
				<CommandEmpty>No se encontraron resultados</CommandEmpty>
				<CommandGroup>
					{pages.map((status) => (
						<CommandItem
							className="text-sm text-secondary-foreground"
							key={status.value}
							value={status.value}
							onSelect={(value) => {
								setSelectedStatus(
									pages.find((priority) => priority.value === value) || null
								);
								setOpen(false);
							}}
						>
							{status.label}
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	);
}
