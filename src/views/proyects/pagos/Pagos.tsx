import { client3 } from "@/client";
import { NewPagosSkeleton } from "@/components/app/pagos/NewPagosSkeleton";
import { PagosForm } from "@/components/app/pagos/PagosForm";
import { Card, CardContent } from "@/components/ui";
import { PagosI } from "@/interfaces";
import { gql } from "graphql-request";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export interface IdefaultValues {
	pago_fecha: Date;
	pago_monto_total: number;
	pago_nro_boletaventa: string;
	pago_recibo: string;
	pago_notas: string;
	pago_aporte: number;
	pago_otros: number;
	Pagos?: PagosI[];
}

export interface DataPago {
	getOne_pago: {
		pago_id: number;
		pago_fecha: Date;
		pago_monto_total: number;
		pago_nro_boletaventa: string;
		pago_recibo: string;
		pago_notas: string;
		pago_aporte: number;
		pago_otros: number;
	};
}

export const Pagos = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [defaultValues, setDefaultValues] = useState<IdefaultValues>({
		pago_fecha: new Date(),
		pago_monto_total: 0,
		pago_nro_boletaventa: "",
		pago_recibo: "",
		pago_notas: "",
		pago_aporte: 0,
		pago_otros: 0,
		Pagos: [],
	});

	const fetchPago = useCallback(
		async (pago_id: number) => {
			setLoading(true);
			setError(null);

			try {
				const resp = await client3.request<DataPago>(
					gql`
			  {
				getOne_pago(pago_id: ${pago_id}) {
				  pago_fecha
				  pago_monto_total
				  pago_nro_boletaventa
				  pago_recibo
				  pago_notas
				  pago_aporte
				  pago_otros
				}
			  }
			`
				);
				if (resp.getOne_pago == null) navigate(`/pagos/`);
				if (resp.getOne_pago) {
					const { getOne_pago } = resp;
					setDefaultValues(getOne_pago);
				}
			} catch (error) {
				setError("Error al obtener el pago.");
				console.error("Error al obtener el pago:", error);
			} finally {
				setLoading(false);
			}
		},
		[navigate]
	);

	useEffect(() => {
		if (id !== "new" && id != null && !isNaN(+id)) {
			console.log(id);
			fetchPago(+id);
		}
	}, [id, fetchPago]);

	return (
		<div>
			<div className="flex items-center justify-between space-y-2 px-4 pb-3 pt-2">
				<div>
					<h2 className="text-2xl font-bold tracking-tight  text-secondary-foreground">
						{id == "new" ? "Nuevo" : "Editando"} Pago
					</h2>
					<p className="text-muted-foreground">
						Formulario para modificar datos de un pago
					</p>
				</div>
			</div>
			<Card>
				<CardContent>
					<div className=" pt-5">
						{id == "new" ? (
							<PagosForm id="new" defaultValues={defaultValues} />
						) : loading ? (
							<NewPagosSkeleton />
						) : error ? (
							<div>Error: {error}</div>
						) : (
							<PagosForm id={id ?? "new"} defaultValues={defaultValues} />
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
