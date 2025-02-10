import { ComboBox } from "@/components/Forms/ComboBox";
import {
	Badge,
	Card,
	CardContent,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Textarea,
	Switch,
} from "@/components/ui";
import { CategoriasGql } from "@/graphql/WebGraph";
import { cn } from "@/lib/utils";
import { formSchemaWeb, FormWeb } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface IdefaultValues {
	web_id: number;
	web_categoria: number;
	web_titulo: string;
	web_mini_desc: string;
	web_desc: string;
	web_img: string;
	web_st: number;
}

interface Props {
	id: string;
	defaultValues: IdefaultValues;
}

interface Icategoria {
	cat_id: number;
	cat_nombre: string;
}

export const WebForm: FC<Props> = ({ id, defaultValues }) => {
	const [estado, setEstado] = useState(false);
	const [categoria, setCategoria] = useState<Icategoria[]>([]);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [cardDesc, setCardDesc] = useState({
		web_id: 2,
		web_img:
			"https://res.cloudinary.com/dgzxplp31/image/upload/c_scale,h_400,w_400/samples/dessert-on-a-plate",
		web_titulo: "Titulo de la publicación",
		web_mini_desc:
			"Descripción corta de la publicación para mostrar en la lista de publicaciones de la web de la institución.",
		web_fecha_create: new Date(),
		tabweb_categoria: {
			cat_nombre: "Cursos",
		},
	});

	useEffect(() => {
		onCategoria();
	}, []);

	const form = useForm<FormWeb>({
		resolver: zodResolver(formSchemaWeb),
		defaultValues,
	});

	useEffect(() => {
		const subscription = form.watch((value) => {
			setCardDesc((prev) => ({
				...prev,
				web_titulo: value.web_titulo || prev.web_titulo,
				web_mini_desc: value.web_mini_desc || prev.web_mini_desc,
				tabweb_categoria: {
					cat_nombre:
						categoria.find((cat) => cat.cat_id === value.web_categoria)
							?.cat_nombre || prev.tabweb_categoria.cat_nombre,
				},
			}));
		});
		return () => subscription.unsubscribe();
	}, [imagePreview, form, categoria]);

	const onCategoria = async () => {
		const categoria = await CategoriasGql();
		if (categoria) {
			const { data, success, msg } = categoria;
			if (success && data) {
				setCategoria(data);
			} else {
				console.log(data, success, msg);
			}
		} else {
			console.log("Error desconocido, no se obtuvo respuesta.");
		}
	};

	const onSubmit = async (data: FormWeb) => {
		console.log(data, id);
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
				setCardDesc((prev) => ({ ...prev, web_img: reader.result as string }));
			};
			reader.readAsDataURL(file);
		} else {
			setImagePreview(null);
		}
	};

	return (
		<>
			<div className="w-full md:w-[70%] md:pr-2">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="border rounded-md shadow-md py-4 px-6">
							<div className="flex flex-col md:flex-row gap-6">
								{/* Contenido de la primera columna */}
								<div className="flex-1 space-y-4">
									<FormField
										control={form.control}
										name="web_titulo"
										render={({ field }) => (
											<FormItem>
												<FormLabel
													className={cn(
														"block text-sm font-semibold",
														!field.value && "text-muted-foreground"
													)}
												>
													Título de la Publicación
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Título de la Publicación"
														{...field}
														className="bg-accent w-full"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="web_categoria"
										render={({ field }) => (
											<FormItem className="flex flex-col">
												<FormLabel
													className={cn(
														"block text-sm font-semibold",
														!field.value && "text-muted-foreground"
													)}
												>
													Categoría
												</FormLabel>
												<ComboBox
													open={estado}
													setOpen={setEstado}
													selectedItem={categoria.find(
														(item) => item.cat_id === field.value
													)}
													setSelectedItem={(item) => {
														if (item) {
															form.setValue("web_categoria", item.cat_id);
														}
													}}
													items={categoria}
													displayLabel={(item) => item.cat_nombre}
													displayValue={(item) => item.cat_id.toString()}
													buttonLabel="Selecciona una categoría"
												/>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="web_mini_desc"
										render={({ field }) => (
											<FormItem>
												<FormLabel
													className={cn(
														"block text-sm font-semibold",
														!field.value && "text-muted-foreground"
													)}
												>
													Descripción Corta
												</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Descripción Corta"
														{...field}
														className="bg-accent w-full"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="web_desc"
										render={({ field }) => (
											<FormItem>
												<FormLabel
													className={cn(
														"block text-sm font-semibold",
														!field.value && "text-muted-foreground"
													)}
												>
													Descripción
												</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Descripción"
														{...field}
														className="bg-accent w-full h-40"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								{/* Contenido de la segunda columna */}
								<div className="flex-1 space-y-4">
									<FormField
										control={form.control}
										name="web_st"
										render={({ field }) => (
											<FormItem>
												<FormLabel
													className={cn(
														"block text-sm font-semibold",
														!field.value && "text-muted-foreground"
													)}
												>
													Publicar en la Web
												</FormLabel>
												<FormControl>
													<Switch
														id="web_st"
														checked={field.value === 1}
														onCheckedChange={(checked: boolean) =>
															field.onChange(checked ? 1 : 0)
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="web_img"
										render={({ field }) => (
											<FormItem>
												<FormLabel
													className={cn(
														"block text-sm font-semibold",
														!field.value && "text-muted-foreground"
													)}
												>
													Imagen de portada
												</FormLabel>
												<FormControl>
													<Input
														{...field}
														type="file"
														className="bg-accent w-full text-accent-foreground"
														onChange={(e) => {
															field.onChange(e);
															handleImageChange(e);
														}}
													/>
												</FormControl>
												<FormMessage />
												{imagePreview && (
													<div className="mt-6">
														<img
															src={imagePreview}
															alt="Vista previa"
															className="w-full mt-4 h-80 object-contain rounded-md border"
														/>
													</div>
												)}
											</FormItem>
										)}
									/>
								</div>
							</div>
						</div>
					</form>
				</Form>
			</div>
			<div className="w-full md:w-[30%] mt-5 md:block md:pl-2 md:px-1 xl:px-16">
				<Card
					key={cardDesc.web_id}
					className="hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-shadow duration-300"
				>
					<img
						src={cardDesc.web_img}
						alt={cardDesc.web_titulo}
						className="w-full h-52 object-cover rounded-t-md"
					/>
					<CardContent>
						<h3 className="text-lg font-bold pt-3">{cardDesc.web_titulo}</h3>
						<p className="text-sm text-muted-foreground">
							{cardDesc.web_mini_desc}
						</p>
						<p className="text-xs text-muted-foreground pt-3">
							<b>Fecha de publicación:</b>{" "}
							{new Date(cardDesc.web_fecha_create).toLocaleDateString()}
						</p>
						<div className="flex justify-between items-center pt-1">
							<p className="text-xs text-muted-foreground">
								<b>Categoría:</b>
							</p>
							<Badge variant="secondary" className="ml-auto">
								{cardDesc.tabweb_categoria.cat_nombre}
							</Badge>
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
};
