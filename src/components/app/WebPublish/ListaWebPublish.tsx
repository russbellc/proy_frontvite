import { client3 } from "@/client";
import { Badge, Button, Card, CardContent, Checkbox, Skeleton } from "@/components/ui";
import { useQuerySWR } from "@/hooks";
import { gql } from "graphql-request";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Iweb {
	web_id: number;
	web_img: string;
	web_titulo: string;
	web_mini_desc: string;
	web_fecha_create: string;
	web_st: number;
	tabweb_categoria: {
		cat_nombre: string;
	};
}

interface DataQuery {
	dataQuery: {
		getAll_web: {
			edges: {
				cursor: string;
				node: Iweb;
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
	searchTerm?: string | null;
}

export const ListaWebPublish: FC<Props> = ({ searchTerm }) => {
	const navigate = useNavigate();
	const [pagination, setPagination] = useState<{
		first: number;
		after: string | null;
		filter?: string | null;
		history: (string | null)[]; // Historial de cursores
	}>({
		first: 16, // Número de resultados por página
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

	const handleNavigate = async (id: number) => {
		if (id) {
			const { getOne_pago } = await client3.request<{ getOne_pago: unknown }>(
				gql`
                        {
                            getOne_pago(pago_id: ${id}) {
                                pago_id
                            }
                        }
                    `
			);
			if (getOne_pago == null) navigate(`/web/`);
			navigate(`/web/${id}`);
		}
	};

	const GET_POSTS_CLIENT1 = gql`
		{
			getAll_web(
				first: ${pagination.first},
				after: ${pagination.after ? `"${pagination.after}"` : null}
				filter: ${pagination.filter ? `"${pagination.filter}"` : null}
			) {
				edges {
					cursor
					node {
						web_id
                        web_img
                        web_titulo
                        web_mini_desc
                        web_fecha_create
                        web_st
                        tabweb_categoria {
                            cat_nombre
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

	const SkeletonCard = () => (
		<Card>
			<Skeleton className="w-full h-32 rounded-t-md" />
			<CardContent>
				<Skeleton className="h-6 w-3/4 mb-2" />
				<Skeleton className="h-4 w-full mb-2" />
				<Skeleton className="h-4 w-1/2 mb-2" />
				<div className="flex justify-between items-center py-3">
					<Skeleton className="h-4 w-1/4" />
					<Skeleton className="h-6 w-1/4" />
				</div>
				<div className="flex items-center justify-between">
					<Skeleton className="h-8 w-1/4" />
					<Skeleton className="h-6 w-1/4" />
				</div>
			</CardContent>
		</Card>
	);

	if (isLoadingQuery) {
		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{Array.from({ length: pagination.first }).map((_, index) => (
					<SkeletonCard key={index} />
				))}
			</div>
		);
	}

	if (isErrorQuery) return <p>Error: {isErrorQuery}</p>;

	const { getAll_web } = dataQuery || {};
	const web_publish = getAll_web?.edges.map((edge) => edge.node) || [];
	const pageInfo = getAll_web?.pageInfo || {};

	const handleNextPage = () => {
		if (pageInfo.hasNextPage) {
			setPagination((prevPagination) => ({
				...prevPagination,
				after: pageInfo.endCursor,
				history: [...prevPagination.history, prevPagination.after],
			}));
		}
	};

	const handlePreviousPage = () => {
		const newHistory = [...pagination.history];
		const previousCursor = newHistory.pop() || null;
		setPagination((prevPagination) => ({
			...prevPagination,
			after: previousCursor,
			history: newHistory,
		}));
	};

	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{web_publish.map((node) => (
					<Card key={node.web_id}>
						<img
							src={node.web_img}
							alt={node.web_titulo}
							className="w-full h-32 object-cover rounded-t-md"
						/>
						<CardContent>
							<h3 className="text-lg font-bold pt-3">{node.web_titulo}</h3>
							<p className="text-sm text-muted-foreground">
								{node.web_mini_desc}
							</p>
							<p className="text-xs text-muted-foreground pt-1">
								Fecha de publicación:{" "}
								{new Date(node.web_fecha_create).toLocaleDateString()}
							</p>
							<div className="flex justify-between items-center py-3">
								<p className="text-xs text-muted-foreground">Categoría:</p>
								<Badge variant="secondary" className="ml-auto">
									{node.tabweb_categoria.cat_nombre}
								</Badge>
							</div>
							<div className="flex items-center justify-between">
								<Button
									variant="secondary"
									size="sm"
									onClick={() => handleNavigate(node.web_id)}
								>
									Editar
								</Button>
								<Checkbox
									checked={node.web_st === 1}
									onCheckedChange={() => console.log("Estado cambiado")}
								/>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
			<div className="flex justify-start items-center gap-3 py-4">
				<Button
					variant="secondary"
					size="sm"
					onClick={handlePreviousPage}
					disabled={pagination.history.length === 0}
				>
					Anterior
				</Button>
				<Button
					variant="secondary"
					size="sm"
					onClick={handleNextPage}
					disabled={!pageInfo.hasNextPage}
				>
					Siguiente
				</Button>
			</div>
		</>
	);
};
