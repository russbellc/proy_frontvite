import { WebForm } from "@/components/app/WebPublish/WebForm";
import { Card, CardContent } from "@/components/ui";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface IdefaultValues {
	web_id: number;
	web_categoria: number;
	web_titulo: string;
	web_mini_desc: string;
	web_desc: string;
	web_img: string;
	web_st: number;
	web_usu_create: number;
	web_fecha_create: string;
}

export const NewWeb: FC = () => {
	const { id } = useParams();
	const [defaultValues, setDefaultValues] = useState<IdefaultValues>({
		web_id: 0,
		web_categoria: 0,
		web_titulo: "",
		web_mini_desc: "",
		web_desc: "",
		web_img: "",
		web_st: 1,
		web_usu_create: 0,
		web_fecha_create: "",
	});

	useEffect(() => {
		const data: IdefaultValues = {
			web_id: 0,
			web_categoria: 0,
			web_titulo: "",
			web_mini_desc: "",
			web_desc: "",
			web_img: "",
			web_st: 1,
			web_usu_create: 0,
			web_fecha_create: "",
		}
		setDefaultValues(data)
	}, [])
	
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
						<WebForm id={id ?? "new"} defaultValues={defaultValues} />
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
