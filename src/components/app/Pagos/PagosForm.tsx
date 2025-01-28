import React, { FC, useEffect, useState } from "react";
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
import { capitalizeWords, cn } from "@/lib/utils";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FormPago, formSchemaPago } from "@/types";
import { createPago, PeriodoGql, searchPersonaGql } from "@/graphql";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks";
import { IdefaultValues } from "@/views/proyects/pagos";
import { client3 } from "@/client";
import { gql } from "graphql-request";
import useMediaQuery from "@/hooks/useMediaQuery";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
	id: string;
	defaultValues: IdefaultValues;
}

interface ToastOptions {
	title: string;
	description: string;
	status: "success" | "error" | "info";
}

interface IPersona {
	per_id: number;
	per_nombre: string;
	per_appat: string;
	per_apmat: string;
	per_nro_doc: string;
	per_st?: string;
	colegiados: {
		col_id: number;
		col_nro_cop: string;
		col_st: string;
	}[];
}

interface Pagos {
	aportaciones: Aportacione[];
	pago_otros: PagoOtro[];
}

interface Aportacione {
	pago_id: number;
	pago_colegiado: number;
	anio: string;
	periodo: number;
	aporta_mes: AportaMe[];
}

interface AportaMe {
	aport_id: null;
	aport_mes: number;
	aport_mes_desc: string;
	aport_monto: number;
	aport_st: number; // Nuevo estado
}

interface PagoOtro {
	pago_o_id: number;
	pago_o_concepto: number;
	pago_o_desc: string;
	pago_o_importe: number;
}

type Status = {
	value: string;
	label: string;
	cuota: number;
};

export const PagosForm: FC<Props> = ({ id, defaultValues }) => {
	const [saving, setSaving] = useState(false);

	const [listaPerona, setListaPerona] = useState<IPersona[]>([]);

	const [listaPagos, setListaPagos] = useState<Pagos>({
		aportaciones: [],
		pago_otros: [
			{
				pago_o_id: 1,
				pago_o_concepto: 1,
				pago_o_desc: "Pago de inscripción",
				pago_o_importe: 100,
			},
			{
				pago_o_id: 2,
				pago_o_concepto: 2,
				pago_o_desc: "Pago de multa",
				pago_o_importe: 50,
			},
		],
	});
	const [listaPeriodo, setListaPeriodo] = useState<
		{ period_id: number; period_anio: number; period_cuota: number }[]
	>([]);

	const [open, setOpen] = useState<boolean>(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
	const [filter, setFilter] = useState<string>("");
	const [searchPersona, setSearchPersona] = useState<string | null>(null);
	const navigate = useNavigate();
	const { toast } = useToast();
	const [dialogOpen, setDialogOpen] = useState<boolean>(true); // Estado para el Dialog inicial
	const [errorDialogOpen, setErrorDialogOpen] = useState<boolean>(false);
	const [duplicateDialogOpen, setDuplicateDialogOpen] = useState<boolean>(false);

	useEffect(() => {
		console.log(listaPagos);
	}, [listaPagos]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setSearchPersona(filter); // Actualizamos `searchTerm` después del debounce
		}, 500); // 500ms de espera antes de buscar
		return () => clearTimeout(timer); // Limpia el temporizador al desmontar o cambiar
	}, [filter]);

	useEffect(() => {
		// setOpen(true); // Abrir el Dialog al entrar en el formulario
		onPeriodo();
	}, []);

	useEffect(() => {
		onSearchPerson(searchPersona);
	}, [searchPersona]);

	// 1. Define your form.
	const form = useForm<FormPago>({
		resolver: zodResolver(formSchemaPago),
		defaultValues,
	});

	const onPeriodo = async () => {
		const periodos = await PeriodoGql();
		if (periodos) {
			const { data, success, msg } = periodos;
			if (success && data) {
				setListaPeriodo(data);
			} else {
				console.log(data, success, msg); // Mensaje de error o cualquier otro mensaje
			}
		} else {
			console.log("Error desconocido, no se obtuvo respuesta.");
		}
	};

	const onSearchPerson = async (value: unknown) => {
		// createColegiado2(values, id)
		const result = await searchPersonaGql(value);

		if (result) {
			const { data, success, msg } = result;
			if (success && data) {
				setListaPerona(data);
			} else {
				console.log(data, success, msg); // Mensaje de error o cualquier otro mensaje
			}
		} else {
			console.log("Error desconocido, no se obtuvo respuesta.");
		}
	};

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

	const handleSelectPersona = async (persona: {
		per_nombre: string;
		per_appat: string;
		per_apmat: string;
		colegiados: { col_id: number }[];
	}) => {
		const nombres = capitalizeWords(
			`${persona.per_nombre} ${persona.per_appat} ${
				persona.per_apmat ? persona.per_apmat : ""
			}`
		);
		const newColId = persona.colegiados[0].col_id;
		form.setValue("persona_name", nombres);
		form.setValue("col_id", newColId);
		setListaPagos((prevListaPagos) => ({
			...prevListaPagos,
			aportaciones: prevListaPagos.aportaciones.map((aporte) => ({
				...aporte,
				pago_colegiado: newColId,
			})),
		}));
		setDialogOpen(false);
	};

	const handleCheckboxChange = (
		aporteId: number,
		mesId: number,
		checked: boolean
	) => {
		setListaPagos((prevListaPagos) => ({
			...prevListaPagos,
			aportaciones: prevListaPagos.aportaciones.map((aporte) =>
				aporte.pago_id === aporteId
					? {
							...aporte,
							aporta_mes: aporte.aporta_mes.map((mes) =>
								mes.aport_mes === mesId
									? { ...mes, aport_st: checked ? 1 : 0 }
									: mes
							),
					  }
					: aporte
			),
		}));
	};

	const handlePriceChange = (
		aporteId: number,
		mesId: number,
		newPrice: number
	) => {
		setListaPagos((prevListaPagos) => ({
			...prevListaPagos,
			aportaciones: prevListaPagos.aportaciones.map((aporte) =>
				aporte.pago_id === aporteId
					? {
							...aporte,
							aporta_mes: aporte.aporta_mes.map((mes) =>
								mes.aport_mes === mesId
									? { ...mes, aport_monto: newPrice }
									: mes
							),
					  }
					: aporte
			),
		}));
	};

	const handleSelectAllChange = (aporteId: number, checked: boolean) => {
		setListaPagos((prevListaPagos) => ({
			...prevListaPagos,
			aportaciones: prevListaPagos.aportaciones.map((aporte) =>
				aporte.pago_id === aporteId
					? {
							...aporte,
							aporta_mes: aporte.aporta_mes.map((mes) => ({
								...mes,
								aport_st: checked ? 1 : 0,
							})),
					  }
					: aporte
			),
		}));
	};

	const handleCancel = (aporteId: number) => {
		setListaPagos((prevListaPagos) => ({
			...prevListaPagos,
			aportaciones: prevListaPagos.aportaciones.filter(
				(aporte) => aporte.pago_id !== aporteId
			),
		}));
	};

	const handleAddPeriodo = () => {
		if (!selectedStatus || !form.getValues("col_id")) {
			setErrorDialogOpen(true);
			return;
		}

		const existingPeriodo = listaPagos.aportaciones.find(
			(aporte) => aporte.anio === selectedStatus.label && aporte.periodo === parseInt(selectedStatus.value)
		);

		if (existingPeriodo) {
			setDuplicateDialogOpen(true);
			return;
		}

		const newAportacion = {
			pago_id: listaPagos.aportaciones.length + 1, // Generar un nuevo ID
			pago_colegiado: form.getValues("col_id"),
			anio: selectedStatus.label,
			periodo: parseInt(selectedStatus.value),
			aporta_mes: [
				{
					aport_id: null,
					aport_mes: 1,
					aport_mes_desc: "Enero",
					aport_monto: selectedStatus.cuota,
					aport_st: 0,
				},
				{
					aport_id: null,
					aport_mes: 2,
					aport_mes_desc: "Febrero",
					aport_monto: selectedStatus.cuota,
					aport_st: 0,
				},
				{
					aport_id: null,
					aport_mes: 3,
					aport_mes_desc: "Marzo",
					aport_monto: selectedStatus.cuota,
					aport_st: 0,
				},
				{
					aport_id: null,
					aport_mes: 4,
					aport_mes_desc: "Abril",
					aport_monto: selectedStatus.cuota,
					aport_st: 0,
				},
				{
					aport_id: null,
					aport_mes: 5,
					aport_mes_desc: "Mayo",
					aport_monto: selectedStatus.cuota,
					aport_st: 0,
				},
				{
					aport_id: null,
					aport_mes: 6,
					aport_mes_desc: "Junio",
					aport_monto: selectedStatus.cuota,
					aport_st: 0,
				},
				{
					aport_id: null,
					aport_mes: 7,
					aport_mes_desc: "Julio",
					aport_monto: selectedStatus.cuota,
					aport_st: 0,
				},
				{
					aport_id: null,
					aport_mes: 8,
					aport_mes_desc: "Agosto",
					aport_monto: selectedStatus.cuota,
					aport_st: 0,
				},
				{
					aport_id: null,
					aport_mes: 9,
					aport_mes_desc: "Septiembre",
					aport_monto: selectedStatus.cuota,
					aport_st: 0,
				},
				{
					aport_id: null,
					aport_mes: 10,
					aport_mes_desc: "Octubre",
					aport_monto: selectedStatus.cuota,
					aport_st: 0,
				},
				{
					aport_id: null,
					aport_mes: 11,
					aport_mes_desc: "Noviembre",
					aport_monto: selectedStatus.cuota,
					aport_st: 0,
				},
				{
					aport_id: null,
					aport_mes: 12,
					aport_mes_desc: "Diciembre",
					aport_monto: selectedStatus.cuota,
					aport_st: 0,
				},
			],
		};

		setListaPagos((prevListaPagos) => ({
			...prevListaPagos,
			aportaciones: [...(prevListaPagos.aportaciones || []), newAportacion as Aportacione],
		}));
	};

	useEffect(() => {
		const totalAportes = listaPagos.aportaciones.reduce((total, aporte) => {
			const totalMeses = aporte.aporta_mes.reduce((mesTotal, mes) => {
				return mes.aport_st === 1 && mes.aport_id === null ? mesTotal + mes.aport_monto : mesTotal;
			}, 0);
			return total + totalMeses;
		}, 0);

		form.setValue("pago_aporte", totalAportes);
		form.setValue("pago_monto_total", totalAportes + form.getValues("pago_otros"));
	}, [listaPagos, form]);

	return (
		<>
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="sm:max-w-md light:bg-white">
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
							<Input
								id="search"
								placeholder="Buscar colegiado..."
								onChange={(e) => setFilter(e.target.value)}
							/>
						</div>
					</div>
					<div className="mt-4">
						<ScrollArea className="h-96 w-full rounded-md border">
							<div className="p-4">
								<ul>
									{listaPerona.map((persona) => (
										<React.Fragment key={persona.per_id}>
											<li
												className="cursor-pointer hover:bg-accent p-2 rounded flex items-center"
												onClick={() => handleSelectPersona(persona)}
											>
												<Avatar className="mr-2">
													<AvatarImage
														src={`https://api.adorable.io/avatars/40/${persona.per_nro_doc}.png`}
														alt={persona.per_nombre}
													/>
													<AvatarFallback>
														{persona.per_nombre.charAt(0)}
														{persona.per_appat.charAt(0)}
													</AvatarFallback>
												</Avatar>
												{capitalizeWords(
													`${persona.per_nombre} ${persona.per_appat} ${
														persona.per_apmat ? persona.per_apmat : ""
													}`
												)}{" "}
												- {persona.per_nro_doc}
											</li>
											<Separator className="my-2" />
										</React.Fragment>
									))}
								</ul>
							</div>
						</ScrollArea>
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
			<Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
				<DialogContent className="sm:max-w-md light:bg-white">
					<DialogHeader>
						<DialogTitle>Alerta:</DialogTitle>
						<DialogDescription>
							Por favor, seleccione un Año y un Colegiado antes de añadir un periodo.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="sm:justify-start">
						<DialogClose asChild>
							<Button type="button" variant="secondary" onClick={() => setErrorDialogOpen(false)}>
								Cerrar
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<Dialog open={duplicateDialogOpen} onOpenChange={setDuplicateDialogOpen}>
				<DialogContent className="sm:max-w-md light:bg-white">
					<DialogHeader>
						<DialogTitle>Alerta</DialogTitle>
						<DialogDescription>
							Ya existe un periodo similar registrado. Por favor, seleccione un periodo diferente.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="sm:justify-start">
						<DialogClose asChild>
							<Button type="button" variant="secondary" onClick={() => setDuplicateDialogOpen(false)}>
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
												onClick={() => setDialogOpen(true)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						{/* col_id (hidden) */}
						<input type="hidden" {...form.register("col_id")} />
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
											Nro. Recibo
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
					</div>
					<Separator className="my-4" />
					<div className="flex flex-col gap-4 sm:flex-row sm:justify-between mt-5">
						<p className="mr-2 text-3xl font-bold">Aportaciones:</p>
						<div className="flex items-center mt-2 sm:mt-0">
							<div className="flex-1 sm:flex-auto sm:w-auto lg:w-auto flex items-center">
								<div>
									{isDesktop ? (
										<Popover open={open} onOpenChange={setOpen}>
											<PopoverTrigger asChild>
												<Button
													variant="secondary"
													className="w-[120px] justify-start bg-accent"
												>
													{selectedStatus ? (
														<>Año {selectedStatus.label}</>
													) : (
														<>Seleccione el Año</>
													)}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-[200px] p-0" align="start">
												<StatusList
													setOpen={setOpen}
													setSelectedStatus={setSelectedStatus}
													listaPeriodo={listaPeriodo}
												/>
											</PopoverContent>
										</Popover>
									) : (
										<Drawer open={open} onOpenChange={setOpen}>
											<DrawerTrigger asChild>
												<Button
													variant="secondary"
													className="w-[120px] justify-start"
												>
													{selectedStatus ? (
														<>Año {selectedStatus.label}</>
													) : (
														<>Año</>
													)}
												</Button>
											</DrawerTrigger>
											<DrawerContent>
												<div className="mt-4 border-t">
													<StatusList
														setOpen={setOpen}
														setSelectedStatus={setSelectedStatus}
														listaPeriodo={listaPeriodo}
													/>
												</div>
											</DrawerContent>
										</Drawer>
									)}
								</div>
								<div
									className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-700 cursor-pointer"
									onClick={handleAddPeriodo}
								>
									<PlusIcon className="mr-2 h-4 w-4" />
									Añadir Periodo
								</div>
							</div>
						</div>

						{/* <div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
							
						</div> */}
					</div>
					<div>
						{(listaPagos.aportaciones ?? []).map((aporte) => (
							<div key={aporte.pago_id} className="flex justify-between my-5">
								<Card className="w-full">
									<CardHeader>
										<CardTitle className="flex flex-col sm:flex-row justify-between">
											<p>Aporte Año: {aporte.anio}</p>
											<div className="flex flex-col sm:flex-row justify-start mt-2 sm:mt-0">
												<div className="flex justify-between">
													<Button
														variant={"destructive"}
														onClick={() => handleCancel(aporte.pago_id)}
													>
														Cancelar
													</Button>
													<div className="flex items-center sm:mt-0 sm:ml-4">
														<Checkbox
															id={`terms-${aporte.pago_id}`}
															className="mr-2"
															onCheckedChange={(checked: boolean) =>
																handleSelectAllChange(aporte.pago_id, checked)
															}
														/>
														<label
															htmlFor={`terms-${aporte.pago_id}`}
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
											{aporte.aporta_mes.map((mes) => (
												<div
													key={mes.aport_mes}
													className="border rounded-lg p-4"
												>
													<FormItem className="flex items-center space-x-4">
														<Checkbox
															id={`terms-${mes.aport_mes}`}
															className="mt-2"
															checked={mes.aport_st === 1}
															onCheckedChange={(checked: boolean) =>
																handleCheckboxChange(
																	aporte.pago_id,
																	mes.aport_mes,
																	checked
																)
															
															}
															disabled={mes.aport_id !== null}
														/>
														<label
															htmlFor={`terms-${mes.aport_mes}`}
															className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
														>
															{mes.aport_mes_desc}
														</label>
														<FormField
															control={form.control}
															name={`aporte_${mes.aport_mes}`}
															render={({ field }) => (
																<FormControl className="flex-1">
																	<div className="flex">
																		<span className="inline-flex items-center px-2 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
																			S/.
																		</span>
																		<Input
																			placeholder="Recibo"
																			{...field}
																			className="bg-accent rounded-l-none text-right"
																			defaultValue={mes.aport_monto.toFixed(2)}
																			value={
																				field.value as
																					| string
																					| number
																					| undefined
																			}
																			onChange={(e) =>
																				handlePriceChange(
																					aporte.pago_id,
																					mes.aport_mes,
																					parseFloat(e.target.value)
																				)
																			
																			}
																			disabled={mes.aport_id !== null}
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
								</Card>
							</div>
						))}
					</div>
					<div></div>
					{/* notas y pagos */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
						<div>
							<p className="text-lg font-bold">Notas:</p>
							<FormField
								control={form.control}
								name="pago_notas"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Textarea
												placeholder="Notas"
												className="resize-x bg-accent h-32"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div>
							<p className="text-lg font-bold">Totales:</p>
							<div className="flex flex-col space-y-2">
								<FormField
									control={form.control}
									name="pago_aporte"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<div className="flex">
													<span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md whitespace-nowrap w-48 font-bold">
														Total Aportes
													</span>
													<Input
														placeholder="Recibo"
														{...field}
														className="bg-accent rounded-l-none text-right"
													/>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="pago_otros"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<div className="flex">
													<span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md whitespace-nowrap w-48 font-bold">
														Total Otros
													</span>
													<Input
														placeholder="Recibo"
														{...field}
														className="bg-accent rounded-l-none text-right"
													/>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="pago_monto_total"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<div className="flex">
													<span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md whitespace-nowrap w-48 font-bold">
														Total
													</span>
													<Input
														placeholder="Recibo"
														{...field}
														className="bg-accent rounded-l-none text-right"
													/>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
						{id == "new" && (
							<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-3/6">
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
		</>
	);
};

function StatusList({
	setOpen,
	setSelectedStatus,
	listaPeriodo,
}: {
	setOpen: (open: boolean) => void;
	setSelectedStatus: (status: Status | null) => void;
	listaPeriodo: {
		period_id: number;
		period_anio: number;
		period_cuota: number;
	}[];
}) {
	return (
		<Command>
			<CommandInput placeholder="Nro de resultados..." />
			<CommandList>
				<CommandEmpty>No se encontraron resultados</CommandEmpty>
				<CommandGroup>
					{listaPeriodo.map((periodo) => (
						<CommandItem
							className="text-sm text-secondary-foreground"
							key={periodo.period_id}
							value={String(periodo.period_id)}
							onSelect={() => {
								setSelectedStatus({
									value: String(periodo.period_id),
									label: String(periodo.period_anio),
									cuota: periodo.period_cuota,
								});
								setOpen(false);
							}}
						>
							{periodo.period_anio}
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	);
}
