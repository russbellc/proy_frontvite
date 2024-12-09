import { client3 } from "@/client";
import { NewColegiados } from "@/components/app/Colegiados/NewColegiados";
import { NewColegiadosSkeleton } from "@/components/app/Colegiados/NewColegiadosSkeleton";
import { Card, CardContent } from "@/components/ui";
import { gql } from "graphql-request";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export interface IdefaultValues {
	col_fecha_colegiatura: Date;
	col_nro_cop: string;
	col_st: string;
	col_obs: string;
	col_centro_trabajo: string;
	per_tdoc: number;
	per_sexo: string;
	per_nro_doc: string;
	per_nombre: string;
	per_appat: string;
	per_apmat: string;
	per_nacionalidad: string;
	per_direccion1: string;
	per_direccion2: string;
	per_lugar_nac: string;
	per_st: string;
	per_telf: string;
	per_celular1: string;
	per_celular2: string;
}

export interface DataPersona {
	getOne_persona: {
		per_id: number;
		per_tdoc: number;
		per_nro_doc: string;
		per_nombre: string;
		per_appat: string;
		per_apmat: string;
		per_sexo: string;
		per_correo: string;
		per_nacionalidad: string;
		per_direccion1: string;
		per_direccion2: string;
		per_lugar_nac: string;
		per_fech_nac: Date;
		per_st: string;
		per_telf: string;
		per_celular1: string;
		per_celular2: string;
		colegiados?: {
			col_nro_cop: string;
			col_fecha_colegiatura: Date;
			col_centro_trabajo: string;
			col_st: string;
			col_obs: string;
		}[];
	};
}

export const ColegiadosDetalleView = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [defaultValues, setDefaultValues] = useState<IdefaultValues>({
		col_fecha_colegiatura: new Date(),
		col_nro_cop: "",
		col_st: "Habilitado",
		col_obs: "",
		col_centro_trabajo: "",
		per_tdoc: 1,
		per_sexo: "M",
		per_nro_doc: "",
		per_nombre: "",
		per_appat: "",
		per_apmat: "",
		per_nacionalidad: "Peruano",
		per_direccion1: "",
		per_direccion2: "",
		per_lugar_nac: "",
		per_st: "Activo",
		per_telf: "",
		per_celular1: "",
		per_celular2: "",
	});

	const fetchPersona = useCallback(async (per_id: number) => {
		setLoading(true);
		setError(null);

		try {
			const resp = await client3.request<DataPersona>(
				gql`
			  {
				getOne_persona(per_id: ${per_id}) {
				  per_tdoc
				  per_nro_doc
				  per_nombre
				  per_appat
				  per_apmat
				  per_sexo
				  per_correo
				  per_nacionalidad
				  per_direccion1
				  per_direccion2
				  per_lugar_nac
				  per_fech_nac
				  per_st
				  per_telf
				  per_celular1
				  per_celular2
				  colegiados {
					col_nro_cop
					col_fecha_colegiatura
					col_centro_trabajo
					col_st
					col_obs
				  }
				}
			  }
			`
			);
			if (resp.getOne_persona == null) navigate(`/colegiados/`);
			if (resp.getOne_persona) {
				const { getOne_persona } = resp;
				const { colegiados, ...rest } = getOne_persona;
				const colegiado = colegiados?.[0];
				setDefaultValues((prev) => ({
					...prev,
					...rest,
					...colegiado,
				}));
			}
		} catch (error) {
			setError("Error al obtener la persona.");
			console.error("Error al obtener la persona:", error);
		} finally {
			setLoading(false);
		}
	}, [navigate]);

	useEffect(() => {
		if (id !== "new" && id != null && !isNaN(+id)) {
			console.log(id);
			fetchPersona(+id);
		}
	}, [id, fetchPersona]);

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
						{id == "new" ? (
							<NewColegiados id="new" defaultValues={defaultValues} />
						) : loading ? (
							<NewColegiadosSkeleton />
						) : error ? (
							<div>Error: {error}</div>
						) : (
							<NewColegiados id={id ?? "new"} defaultValues={defaultValues} />
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
