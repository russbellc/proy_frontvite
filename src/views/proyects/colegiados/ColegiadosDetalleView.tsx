import { NewColegiados } from "@/components/app/Colegiados/NewColegiados";
import {
	// Button,
	Card,
	CardContent,
	// CardFooter,
	// CardHeader,
} from "@/components/ui";
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
				{/* <CardHeader>
					<div className="flex items-center justify-start">
						<Button variant="secondary" size="sm">
							Nuevo Colegiado
						</Button>
					</div>
				</CardHeader> */}
				<CardContent>
					<div className=" pt-5">
						<NewColegiados />
					</div>
				</CardContent>
				{/* <CardFooter>
					<div className="text-xs text-muted-foreground">
						Showing <strong>1-10</strong> of <strong>32</strong> products
					</div>
				</CardFooter> */}
			</Card>
		</div>
	);
};
