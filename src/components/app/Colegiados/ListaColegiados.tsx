import { useQuerySWR } from "@/hooks";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { gql } from "graphql-request";
import { FC, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui";

interface Persona {
	per_id: number;
	per_nombre: string;
	per_appat: string;
	per_apmat: string;
	per_nro_doc: string;
	per_st: string;
	colegiados: {
		col_nro_cop: string;
		col_st: string;
	}[];
}

interface DataQuery {
	dataQuery: {
		getAll_persona: {
			edges: {
				cursor: string;
				node: Persona;
			}[];
			pageInfo: {
				hasNextPage: boolean;
				endCursor: string | null;
			};
		};
	};
	isLoadingQuery: boolean;
	isErrorQuery: string;
}

interface Props {
	searchTerm: string | null;
}

export const ListaColegiados: FC<Props> = ({ searchTerm }) => {
	const [pagination, setPagination] = useState<{
		first: number;
		after: string | null;
		filter?: string | null;
		history: (string | null)[]; // Historial de cursores
	}>({
		first: 10, // Número de resultados por página
		after: null, // Cursor inicial, null para la primera página
		filter: null, // Inicialmente sin filtro
		history: [], // Inicialmente vacío
	});

	// Actualizar el filtro cuando cambie el searchTerm
	useEffect(() => {
		setPagination((prevPagination) => ({
			...prevPagination,
			filter: searchTerm || null, // Si no hay término, el filtro es null
			after: null, // Reiniciar paginación al cambiar el filtro
			history: [],
		}));
	}, [searchTerm]);

	const GET_POSTS_CLIENT1 = gql`
		{
			getAll_persona(
				first: ${pagination.first},
				after: ${pagination.after ? `"${pagination.after}"` : null}
				filter: ${pagination.filter ? `"${pagination.filter}"` : null}
			) {
				edges {
					cursor
					node {
						per_id
						per_nombre
						per_appat
						per_apmat
						per_nro_doc
						per_st
						colegiados {
							col_nro_cop
							col_st
						}
					}
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
		}
	`;

	const { dataQuery, isLoadingQuery, isErrorQuery }: DataQuery =
		useQuerySWR(GET_POSTS_CLIENT1);

	if (isLoadingQuery) return <SkeletonTable />;
	if (isErrorQuery) return <p>Error: {isErrorQuery}</p>;

	const { getAll_persona } = dataQuery || {};
	const personas = getAll_persona?.edges.map((edge) => edge.node) || [];
	const pageInfo = getAll_persona?.pageInfo || {};

	// Manejar paginación
	const handleNextPage = () => {
		if (pageInfo.hasNextPage) {
			setPagination((prevPagination) => ({
				...prevPagination,
				after: pageInfo.endCursor,
				history: [...prevPagination.history, prevPagination.after], // Agregar la página actual al historial
			}));
		}
	};

	// Manejar paginación a la página anterior
	const handlePreviousPage = () => {
		setPagination((prevPagination) => {
			const previousCursor =
				prevPagination.history[prevPagination.history.length - 1] || null; // Última página visitada
			return {
				...prevPagination,
				after: previousCursor,
				history: prevPagination.history.slice(0, -1), // Eliminar el último cursor del historial
			};
		});
	};

	// Cambiar el número de resultados por página
	const handleChangeResultsPage = (newResultsPerPage: number) => {
		setPagination((prevPagination) => ({
			...prevPagination,
			first: newResultsPerPage,
			after: null, // Reiniciar la paginación al cambiar el número de resultados
			history: [], // Reiniciar historial al cambiar el tamaño de página
		}));
	};

	return (
		<>
			<DataTable
				columns={columns}
				data={personas}
				onNextPage={handleNextPage}
				onPreviousPage={handlePreviousPage}
				canNextPage={pageInfo.hasNextPage}
				handleChangeResultsPage={handleChangeResultsPage}
				pageFirst={pagination.first}
			/>
		</>
	);
};

const SkeletonTable = () => {
	return (
		<div className="rounded-md border">
			<table className="w-full border-collapse">
				<thead>
					<tr>
						{Array(5)
							.fill(null)
							.map((_, index) => (
								<th key={index} className="py-5 px-4">
									<Skeleton className="h-4 w-24" />
								</th>
							))}
					</tr>
				</thead>
				<tbody>
					{Array(10)
						.fill(null)
						.map((_, rowIndex) => (
							<tr key={rowIndex} className="border-t">
								{Array(5)
									.fill(null)
									.map((_, cellIndex) => (
										<td key={cellIndex} className="py-5 px-4">
											<Skeleton className="h-4 w-full" />
										</td>
									))}
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
};
