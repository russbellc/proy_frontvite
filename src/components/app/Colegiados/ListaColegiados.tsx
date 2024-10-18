import { useQuerySWR } from "@/hooks";
import { Data, columns } from "./columns";
import { DataTable } from "./data-table";

const GET_POSTS_CLIENT1 = `
	{
		getAll_persona {
			colegiados {
				col_nro_cop
				col_st
			}
			per_nombre
			per_appat
			per_apmat
			per_nro_doc
			per_st
		}
	}
`;

interface DataQuery {
	dataQuery: Data;
	isLoadingQuery: boolean;
	isErrorQuery: string;
}

export const ListaColegiados = () => {
	const { dataQuery, isLoadingQuery, isErrorQuery }: DataQuery =
		useQuerySWR(GET_POSTS_CLIENT1);

	if (isLoadingQuery) return <p>Loading...</p>;
	if (isErrorQuery) return <p>Error: {isErrorQuery}</p>;

	const { getAll_persona } = dataQuery || {};

	return (
		<>
			<DataTable columns={columns} data={getAll_persona} />
		</>
	);
};
