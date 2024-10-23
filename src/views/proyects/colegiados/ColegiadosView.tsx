import { ListaColegiados } from "@/components/app/Colegiados/ListaColegiados";
import {
	Button,
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui";
import { useNavigate } from "react-router-dom";

export const ColegiadosView = () => {
	const navigate = useNavigate(); // Hook para cambiar de página

	const handleNavigate = () => {
		navigate("/colegiados/new"); // Cambiar a la ruta deseada
	};
	return (
		<div>
			<div className="flex items-center justify-between space-y-2 px-4 pb-3 pt-2">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">Colegiados</h2>
					<p className="text-muted-foreground">
						Listado de colegiados del CROXCUSCO
					</p>
				</div>
			</div>
			<Card>
				<CardHeader>
					<div className="flex items-center justify-start">
						<Button variant="secondary" size="sm" onClick={handleNavigate}>
							Nuevo Colegiado
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<ListaColegiados />
				</CardContent>
				<CardFooter>
					<div className="text-xs text-muted-foreground">
						Showing <strong>1-10</strong> of <strong>32</strong> products
					</div>
				</CardFooter>
			</Card>
		</div>
	);
};
