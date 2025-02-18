import { client3 } from "@/client";
import { WebForm } from "@/components/app/WebPublish/WebForm";
import { WebFormSkeleton } from "@/components/app/WebPublish/WebFormSkeleton"; // Importar el nuevo esqueleto
import { Card, CardContent } from "@/components/ui";
import { gql } from "graphql-request";
import { FC, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

interface DataWeb {
	getOne_web: {
		web_titulo: string;
		web_categoria: number;
		web_mini_desc: string;
		web_desc: string;
		web_img: string;
		tabweb_categoria: {
			cat_id: number;
			cat_nombre: string;
		};
		web_galeria: {
			gal_id: number;
			gal_img: string;
		}[];
	};
}

export const NewWeb: FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [defaultValues, setDefaultValues] = useState<IdefaultValues>({
		web_id: 0,
		web_categoria: 0,
		web_titulo: "",
		web_mini_desc: "",
		web_desc: "",
		web_img: "",
		web_st: 1,
		web_galeria: [],
	});

	const fetchWeb = useCallback(
		async (web_id: number) => {
			setLoading(true);
			setError(null);

			try {
				const resp = await client3.request<DataWeb>(gql`
					{
						getOne_web(web_id: ${web_id}) {
							web_titulo
							web_categoria
							web_mini_desc
							web_desc
							web_img
							tabweb_categoria {
								cat_id
								cat_nombre
							}
							web_galeria {
								gal_id
								gal_img
							}
						}
					}
				`);
				if (resp.getOne_web == null) navigate("/web");
				if (resp.getOne_web) {
					const { getOne_web } = resp;
					const {
						web_categoria: cat_id,
						web_titulo,
						web_mini_desc,
						web_desc,
						web_img,
						web_galeria,
					} = getOne_web;
					setDefaultValues({
						web_id: 0,
						web_categoria: cat_id,
						web_titulo,
						web_mini_desc,
						web_desc,
						web_img,
						web_st: 1,
						web_galeria: web_galeria.map((gal) => ({
							gal_id: gal.gal_id,
							gal_img: gal.gal_img,
						})),
					});
				}
			} catch (error) {
				setError("Error al obtener la persona.");
				console.error("Error al obtener la persona:", error);
			} finally {
				setLoading(false);
			}
		},
		[navigate]
	);

	useEffect(() => {
		if (id !== "new" && id != null && !isNaN(+id)) {
			fetchWeb(+id);
		}
	}, [id, fetchWeb]);

	return (
		<div>
			<div className="flex items-center justify-between space-y-2 px-4 pb-3 pt-2">
				<div>
					<h2 className="text-2xl font-bold tracking-tight text-secondary-foreground">
						{id == "new" ? "Nueva" : "Editando"} Publicación
					</h2>
					<p className="text-muted-foreground">
						Formulario para modificar datos de una Publicación
					</p>
				</div>
			</div>
			<Card>
				<CardContent>
					<div className="flex flex-col md:flex-row justify-between pt-5">
						{id == "new" ? (
							<WebForm id="new" defaultValues={defaultValues} />
						) : loading ? (
							<WebFormSkeleton /> // Usar el nuevo esqueleto
						) : error ? (
							<div>Error: {error}</div>
						) : (
							<WebForm id={id ?? "new"} defaultValues={defaultValues} />
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
