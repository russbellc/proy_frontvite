import { useQuerySWR } from "@/hooks";
import { gql, useQuery } from "@apollo/client";
import { Key } from "react";

const GET_POSTS_CLIENT1 = `
	{
		getAll_sys_submenu {
			submenu_id
			submenu_titulo
		}
	}
`;
const GET_POSTS_CLIENT2 = gql`
	{
		getAll_sys_submenu {
			submenu_id
			submenu_titulo
		}
	}
`;

interface Submenu {
	submenu_id: Key | null | undefined;
	submenu_titulo: string | null | undefined;
}

interface Data {
	getAll_sys_submenu: Submenu[];
}

interface DataQuery {
	dataQuery: Data;
	isLoadingQuery: boolean;
	isErrorQuery: boolean;
}

export const DashboardView = () => {
	const { dataQuery, isLoadingQuery, isErrorQuery }: DataQuery =useQuerySWR(GET_POSTS_CLIENT1);

	const { data, loading, error } = useQuery(GET_POSTS_CLIENT2)

	const { getAll_sys_submenu } = dataQuery || {};

	if (isLoadingQuery) return <p>Loading...</p>;
	if (isErrorQuery) return <p>Error: {isErrorQuery}</p>;

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;


	return (
		<div>
			<h1>Dashboard SWR</h1>
			<ul>
				{getAll_sys_submenu.map(
					(submenu: {
						submenu_id: Key | null | undefined;
						submenu_titulo: string | null | undefined;
					}) => (
						<li key={submenu.submenu_id}>{submenu.submenu_titulo}</li>
					)
				)}
			</ul>
			<br /><br /><br />
			<h1>Dashboard SWR</h1>
			<ul>
				{data.getAll_sys_submenu.map(
					(submenu: {
						submenu_id: Key | null | undefined;
						submenu_titulo: string | null | undefined;
					}) => (
						<li key={submenu.submenu_id}>{submenu.submenu_titulo}</li>
					)
				)}
			</ul>
		</div>
	);

};
