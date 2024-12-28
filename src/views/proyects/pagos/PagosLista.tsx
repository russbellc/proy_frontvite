
import { ListaPagos } from "@/components/app/pagos/ListaPagos";
import {
	Button,
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	Input,
} from "@/components/ui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const PagosLista = () => {
	const navigate = useNavigate(); // Hook para cambiar de página
	const [filter, setFilter] = useState<string>("");
	const [searchTerm, setSearchTerm] = useState<string | null>(null);

	useEffect(() => {
		const timer = setTimeout(() => {
			setSearchTerm(filter); // Actualizamos `searchTerm` después del debounce
		}, 500); // 500ms de espera antes de buscar
		return () => clearTimeout(timer); // Limpia el temporizador al desmontar o cambiar
	}, [filter]);

	const handleNavigate = () => {
		navigate("/pagos/new"); // Cambiar a la ruta deseada
	};

	return (
		<div>
			<div className="flex items-center justify-between space-y-2 px-4 pb-3 pt-2">
				<div>
					<h2 className="text-2xl font-bold tracking-tight text-secondary-foreground">Pagos</h2>
					<p className="text-muted-foreground">Listado de pagos CROXCUSCO</p>
				</div>
			</div>
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<Button variant="secondary" size="sm" onClick={handleNavigate}>
							Nuevo Pago
						</Button>
						<Input
							type="buscar"
							placeholder="Buscar"
							className="max-w-sm bg-accent"
							onChange={(e) => setFilter(e.target.value)}
						/>
					</div>
				</CardHeader>
				<CardContent>
					<ListaPagos searchTerm={searchTerm} />
				</CardContent>
				<CardFooter>
				</CardFooter>
			</Card>
		</div>
	);
};
