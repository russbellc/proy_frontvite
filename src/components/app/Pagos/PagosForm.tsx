import { FC, useEffect, useState } from "react";
import { debounce } from "lodash";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Button,
	Calendar,
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

interface Props {
	id: string;
	defaultValues: IdefaultValues;
}

interface ToastOptions {
	title: string;
	description: string;
	status: "success" | "error" | "info";
}

export const PagosForm: FC<Props> = ({ id, defaultValues }) => {
	// const [open, setOpen] = useState(false);
	const [saving, setSaving] = useState(false);
	const navigate = useNavigate();
	const { toast } = useToast();

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
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
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
										<Input placeholder="Nro de Boleta/Venta" {...field} />
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
										<Input placeholder="Recibo" {...field} />
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
											className="resize-x"
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
				</div>
			</form>
		</Form>
	);
};
