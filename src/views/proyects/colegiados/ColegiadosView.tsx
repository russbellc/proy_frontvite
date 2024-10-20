import { ListaColegiados } from "@/components/app/Colegiados/ListaColegiados";
import {
	Button,
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui";

export const ColegiadosView = () => {
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
				<div className="flex items-center justify-start space-x-2 py-4">
				<Button
					variant="outline"
					size="sm"
					// onClick={() => table.previousPage()}
				>
					NUEVO COLEGIADO
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
