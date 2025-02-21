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
	ScrollArea,
} from "@/components/ui";
import {
	CategoriasGql,
	createWeb,
	// isValidImage,
	// uploadImage,
} from "@/graphql/WebGraph";
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
import { useNavigate } from "react-router-dom";
import { useSaveFieldWeb, useToast } from "@/hooks";
import { debounce } from "lodash";
// import { client3 } from "@/client";
// import { gql } from "graphql-request";

interface IdefaultValues {
	web_id: number;
	web_categoria: number;
	web_titulo: string;
	web_mini_desc: string;
	web_desc: string;
	web_img: string;
	web_st: number;
	web_galeria: {
		gal_id: number;
		gal_img: string;
	}[];
}

interface Props {
	id: string;
	defaultValues: IdefaultValues;
}

interface Icategoria {
	cat_id: number;
	cat_nombre: string;
}

interface ToastOptions {
	title: string;
	description: string;
	status: "success" | "error" | "info";
}

export const WebForm: FC<Props> = ({ id, defaultValues }) => {
	const { toast } = useToast();
	const navigate = useNavigate();
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
	const [galleryUrls, setGalleryUrls] = useState<
		{ gal_id: number; gal_img: string }[]
	>(defaultValues.web_galeria);
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const [newImages, setNewImages] = useState<File[]>([]);
	const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
	const [viewImageDialogOpen, setViewImageDialogOpen] =
		useState<boolean>(false);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	const form = useForm<FormWeb>({
		resolver: zodResolver(formSchemaWeb),
		defaultValues,
	});

	const { saveField } = useSaveFieldWeb(id, imagePreview, setImagePreview);

	const debouncedSave = debounce(
		(fieldName: keyof FormWeb, value: unknown) => {
			saveField(fieldName, value);
		},
		1000 // 500 ms de espera antes de ejecutar
	);

	useEffect(() => {
		// Subscribirse a los cambios de todos los campos
		if (id !== "new") {
			const subscription = form.watch((value, { name }) => {
				if (name) {
					debouncedSave(
						name as keyof FormWeb,
						(value as FormWeb)[name as keyof FormWeb]
					);
				}
			});
			return () => subscription.unsubscribe();
		}
	}, [debouncedSave, form, id]);

	useEffect(() => {
		const onchangeCard = () => {
			setCardDesc({
				web_id: defaultValues.web_id,
				web_img: defaultValues.web_img,
				web_titulo: defaultValues.web_titulo,
				web_mini_desc: defaultValues.web_mini_desc,
				web_fecha_create: new Date(),
				tabweb_categoria: {
					cat_nombre: defaultValues.web_categoria.toString(),
				},
			});
		};

		if (id !== "new") {
			onchangeCard();
		}
	}, [
		id,
		defaultValues.web_id,
		defaultValues.web_img,
		defaultValues.web_titulo,
		defaultValues.web_mini_desc,
		defaultValues.web_categoria,
	]);

	useEffect(() => {
		onCategoria();
	}, []);

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
			// console.log(data);
			const result = await createWeb(data, imagePreview, galleryImages);
			if (result) {
				const { data, success, msg } = result;
				if (success && data) {
					// console.log(data); // Aquí puedes acceder a los datos si la creación fue exitosa
					navigate("/web/");
					// return toast mesage sussess save data
					toast({
						title: "Éxito",
						description: "Datos guardados correctamente.",
						status: "success",
					} as ToastOptions);
				} else {
					console.log(data, success, msg);
				}
			} else {
				console.log("Error desconocido, no se obtuvo respuesta.");
			}
		} else {
			console.error("No image selected");
		}
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// console.log("Archivo seleccionado:", file);
			// console.log("Tipo MIME del archivo seleccionado:", file.type);

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

	const handleAddImages = () => {
		if (newImages.length > 0) {
			setGalleryImages((prev) => [...prev, ...newImages]);
			setNewImages([]);
			setNewImagePreviews([]);
			setIsDialogOpen(false);
		}
	};

	const handleGalleryImagesChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const files = Array.from(e.target.files || []);
		setNewImages(files);
		const previews = files.map((file) => URL.createObjectURL(file));
		setNewImagePreviews(previews);
	};

	const handleRemoveImageNew = (index: number) => {
		setGalleryImages((prev) => prev.filter((_, i) => i !== index));
	};

	const handleRemoveImageEdit = (gal_id: number) => {
		setGalleryUrls((prev) => prev.filter((img) => img.gal_id !== gal_id));
	};

	const handleViewImage = (image: string) => {
		setSelectedImage(image);
		setViewImageDialogOpen(true);
	};

	return (
		<>
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="sm:max-w-md light:bg-white md:max-w-2xl md:max-h-max">
					<DialogHeader>
						<DialogTitle>Agregar Imágenes</DialogTitle>
						<DialogDescription>
							Selecciona imágenes para agregar a la galería.
						</DialogDescription>
					</DialogHeader>
					<div>
						<Input
							type="file"
							className="bg-accent w-full text-accent-foreground"
							onChange={handleGalleryImagesChange}
							multiple
						/>
						<ScrollArea className="h-96 w-full rounded-md border mt-4">
							<div className="mt-4">
								{newImagePreviews.length > 0 && (
									<div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 mx-4">
										{newImagePreviews.map((preview, index) => (
											<img
												key={index}
												src={preview}
												alt={`Vista previa ${index + 1}`}
												className="w-full h-40 object-cover rounded-md border"
											/>
										))}
									</div>
								)}
							</div>
						</ScrollArea>
					</div>
					<DialogFooter className="sm:justify-start">
						<DialogClose asChild>
							<Button
								type="button"
								variant="secondary"
								onClick={handleAddImages}
							>
								Guardar Imágenes
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<Dialog open={viewImageDialogOpen} onOpenChange={setViewImageDialogOpen}>
				<DialogContent className="sm:max-w-md light:bg-white md:max-w-2xl md:max-h-max">
					<DialogHeader>
						<DialogTitle>Vista Previa de la Imagen</DialogTitle>
					</DialogHeader>
					<div className="flex justify-center items-center">
						{selectedImage && (
							<img
								src={selectedImage}
								alt="Vista previa"
								className="w-full h-auto object-contain rounded-md border"
							/>
						)}
					</div>
					<DialogFooter className="sm:justify-start">
						<DialogClose asChild>
							<Button
								type="button"
								variant="secondary"
								onClick={() => setViewImageDialogOpen(false)}
							>
								Cerrar
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
									<FormLabel
										className={cn(
											"block text-sm font-semibold",
											!form.register("web_img") && "text-muted-foreground"
										)}
									>
										Imagen de portada
									</FormLabel>
									<Input
										id="web_imgPortada"
										type="file"
										placeholder="Imagen de portada"
										className="bg-accent w-full text-accent-foreground"
										onChange={(e) => {
											handleImageChange(e);
											// form.setValue("web_img", "Portada");
											form.setValue(
												"web_img",
												URL.createObjectURL(e.target.files?.[0] || new Blob())
											);
										}}
									/>
									<FormField
										control={form.control}
										name="web_img"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<input type="hidden" {...field} />
												</FormControl>
												<FormMessage />
												{id == "new" ? (
													imagePreview && (
														<div className="mt-6">
															<img
																src={URL.createObjectURL(imagePreview)}
																alt="Vista previa"
																className="w-full mt-4 h-80 object-contain rounded-md border"
															/>
														</div>
													)
												) : imagePreview ? (
													<div className="mt-6">
														<img
															src={URL.createObjectURL(imagePreview)}
															alt="Vista previa"
															className="w-full mt-4 h-80 object-contain rounded-md border"
														/>
													</div>
												) : (
													<div className="mt-6">
														<img
															src={
																typeof field.value === "string"
																	? field.value
																	: URL.createObjectURL(field.value)
															}
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
					<h2 className="text-xl font-semibold mb-2">Galería de Imágenes</h2>
					<Button
						variant="secondary"
						size="default"
						className="mb-4"
						onClick={() => setIsDialogOpen(true)}
					>
						Agregar Imágenes
					</Button>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{id === "new"
							? galleryImages.map((image, index) => (
									<div key={index} className="relative">
										<img
											src={URL.createObjectURL(image)}
											alt={`Imagen ${index + 1}`}
											className="w-full h-40 object-cover rounded-md border cursor-pointer"
											onClick={() =>
												handleViewImage(URL.createObjectURL(image))
											}
										/>
										<button
											onClick={() => handleRemoveImageNew(index)}
											className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-3 bg-opacity-75"
										></button>
									</div>
						))
							: galleryUrls.map((image, index) => (
									<div key={index} className="relative">
										<img
											src={image.gal_img}
											alt={`Imagen ${index + 1}`}
											className="w-full h-40 object-cover rounded-md border cursor-pointer"
											onClick={() => handleViewImage(image.gal_img)}
										/>
										<button
											onClick={() => handleRemoveImageEdit(image.gal_id)}
											className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-3 bg-opacity-75"
										></button>
									</div>
						))}

						{id !== "new" &&
							galleryImages.map((image, index) => (
								<div key={index} className="relative">
									<img
										src={URL.createObjectURL(image)}
										alt={`Imagen ${index + 1}`}
										className="w-full h-40 object-cover rounded-md border cursor-pointer"
										onClick={() => handleViewImage(URL.createObjectURL(image))}
									/>
									<button
										onClick={() => handleRemoveImageNew(index)}
										className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-3 bg-opacity-75"
									></button>
								</div>
							))}
					</div>
				</div>
			</div>
			<div className="w-full md:w-[30%] mt-5 md:block md:pl-2 md:px-1 xl:px-16">
				<h2 className="text-xl font-semibold my-4">Vista previa</h2>
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
