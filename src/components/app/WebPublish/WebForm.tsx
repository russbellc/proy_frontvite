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
	Button,
} from "@/components/ui";
import { CategoriasGql, createWeb } from "@/graphql/WebGraph";
import { cn } from "@/lib/utils";
import { formSchemaWeb, FormWeb } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

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
	const [imagePreview, setImagePreview] = useState<File | null>(null);
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
	const [galleryImages, setGalleryImages] = useState<File[]>([]);
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const [newImage, setNewImage] = useState<File | null>(null);
	const [newImagePreview, setNewImagePreview] = useState<string | null>(null);

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
	}, [form, categoria]);

	useEffect(() => {
		console.log(imagePreview);
	}, [imagePreview]);

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
		if (imagePreview) {
			const result = await createWeb(data, imagePreview);
			console.log(result);
		} else {
			console.error("No image selected");
		}
		// console.log(data, id)
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			console.log("Archivo seleccionado:", file);
			console.log("Tipo MIME del archivo seleccionado:", file.type);

			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(file);
				setCardDesc((prev) => ({ ...prev, web_img: reader.result as string }));
			};
			reader.readAsDataURL(file);
		} else {
			setImagePreview(null);
		}
	};

	const handleAddImage = () => {
		if (newImage) {
			setGalleryImages((prev) => [...prev, newImage]);
			setNewImage(null);
			setNewImagePreview(null);
			setIsDialogOpen(false);
		}
	};

	const handleGalleryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setNewImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setNewImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<>
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="sm:max-w-md light:bg-white">
					<DialogHeader>
						<DialogTitle>Agregar Imagen</DialogTitle>
						<DialogDescription>
							Selecciona una imagen para agregar a la galería.
						</DialogDescription>
					</DialogHeader>
					<div>
						<Input
							type="file"
							className="bg-accent w-full text-accent-foreground"
							onChange={handleGalleryImageChange}
							/>
						{newImagePreview && (
							<div className="mt-4">
								<img
									src={newImagePreview}
									alt="Vista previa"
									className="w-full h-40 object-cover rounded-md border"
								/>
							</div>
						)}
					</div>
					<DialogFooter className="sm:justify-start">
						<DialogClose asChild>
							<Button
								type="button"
								variant="secondary"
								onClick={handleAddImage}
							>
								Guardar Imagen
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
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
															src={URL.createObjectURL(imagePreview)}
															alt="Vista previa"
															className="w-full mt-4 h-80 object-contain rounded-md border"
														/>
													</div>
												)}
											</FormItem>
										)}
									/>
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
							</div>
						</div>
					</form>
				</Form>
				<div className="mt-6">
					<h2 className="text-xl font-semibold mb-4">Galería de Imágenes</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{galleryImages.map((image, index) => (
							<img
								key={index}
								src={URL.createObjectURL(image)}
								alt={`Imagen ${index + 1}`}
								className="w-full h-40 object-cover rounded-md border"
							/>
						))}
					</div>
					<Button
						variant="secondary"
						size="default"
						className="mt-4"
						onClick={() => setIsDialogOpen(true)}
					>
						Agregar Imagen
					</Button>
				</div>
			</div>
			<div className="w-full md:w-[30%] mt-5 md:block md:pl-2 md:px-1 xl:px-16">
				<h2 className="text-xl font-semibold">Vista previa</h2>
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
