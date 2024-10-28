import { NewColegiados } from "@/components/app/Colegiados/NewColegiados";
import { Card, CardContent } from "@/components/ui";
import { useParams } from "react-router-dom";

export const ColegiadosDetalleView = () => {
	const { id } = useParams();
	return (
		<div>
			<div className="flex items-center justify-between space-y-2 px-4 pb-3 pt-2">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">
						{id == "new" ? "Nuevo" : "Editando"} Colegiado
					</h2>
					<p className="text-muted-foreground">
						Formulario para modificar datos de un colegiado
					</p>
				</div>
			</div>
			<Card>
				<CardContent>
					<div className=" pt-5">
						<NewColegiados id={id ?? "new"} />
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
