import { Badge, Button } from "@/components/ui";
import { ColumnDef } from "@tanstack/react-table";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui";
import { MoreHorizontal } from "lucide-react";

export interface Personas {
	data: Data;
}

export interface Data {
	getAll_persona: GetAllPersona[];
}

export interface GetAllPersona {
	colegiados?: Colegiado[];
	per_id: number;
	per_nombre: string;
	per_appat: string;
	per_apmat: string;
	per_nro_doc: string;
	per_st: null | string;
}

export interface Colegiado {
	col_nro_cop: string;
	col_st: string;
}

// export const columns: ColumnDef<GetAllPersona>[] = [

export const columns = (
	onNavigate: (id: number) => void
): ColumnDef<GetAllPersona>[] => [
	{
		id: "actions",
		header: "Actions",

		cell: ({ row }) => {
			const persona: GetAllPersona = row.original;
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Acciones</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => onNavigate(persona.per_id)} // Llamada a la función
						>
							Edit file
						</DropdownMenuItem>
						<DropdownMenuItem>Delete file</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
	{
		accessorKey: "ape_nom",
		header: "Apellidos y Nombres",
		cell: (info) => (
			<span>
				{info.row.original.per_appat} {info.row.original.per_apmat}{" "}
				{info.row.original.per_nombre}
			</span>
		),
		footer: (props) => props.column.id,
	},
	{
		accessorKey: "per_nro_doc",
		header: "Nro Documento",
	},
	{
		accessorKey: "col_nro_cop",
		header: "Nro Colegiado",
		cell: (info) => (
			<span>{info.row.original.colegiados?.[0].col_nro_cop}</span>
		),
	},
	{
		accessorKey: "col_st",
		header: "Condición",
		cell: (info) => <span>{info.row.original.colegiados?.[0].col_st}</span>,
	},
	{
		accessorKey: "per_st",
		header: "Estado",
		cell: ({ row }) => {
			const state: number = row.getValue("per_st");
			const variant =
				state === 1 ? "secondary" : state === 0 ? "destructive" : "default";
			return <Badge variant={variant}>{state}</Badge>;
		},
	},
];
