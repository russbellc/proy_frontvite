import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui";
import { MoreHorizontal } from "lucide-react";

interface Pago {
	pago_id: number;
	colegiados: {
		persona: {
			per_nombre: string;
			per_appat: string;
			per_apmat: string;
		};
		col_nro_cop: string;
	};
	pago_monto_total: number;
	pago_nro_boletaventa: string;
	pago_recibo: string;
	pago_fecha: Date;
}

export const columns = (
	handleNavigate: (id: number) => void
): ColumnDef<Pago>[] => [
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const pago: Pago = row.original;
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
						<DropdownMenuItem onClick={() => handleNavigate(pago.pago_id)}>
							Editar
						</DropdownMenuItem>
						{/* <DropdownMenuItem>Eliminar</DropdownMenuItem> */}
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
	{
		accessorKey: "pago_recibo",
		header: "ID",
		cell: ({ row }) => <div>{row.original.pago_id}</div>,
	},
	{
		accessorKey: "colegiados.persona.per_appat",
		header: "Nombres y Apellidos",
		cell: ({ row }) => (
			<div>
				{row.original.colegiados.persona.per_nombre +
					" " +
					row.original.colegiados.persona.per_appat +
					" " +
					(row.original.colegiados.persona.per_apmat
						? row.original.colegiados.persona.per_apmat
						: "")}
			</div>
		),
	},
	{
		accessorKey: "colegiados.col_nro_cop",
		header: "Nro COP",
		cell: ({ row }) => <div>{row.original.colegiados.col_nro_cop}</div>,
	},
	{
		accessorKey: "pago_monto_total",
		header: "Monto Total",
		cell: ({ row }) => <div>{ "S/. " + row.original.pago_monto_total}</div>,
	},
	{
		accessorKey: "pago_nro_boletaventa",
		header: "Nro Boleta/Venta",
		cell: ({ row }) => <div>{row.original.pago_nro_boletaventa}</div>,
	},
	{
		accessorKey: "pago_recibo",
		header: "Recibo",
		cell: ({ row }) => <div>{row.original.pago_recibo}</div>,
	},
	{
		accessorKey: "pago_fecha",
		header: "Fecha",
		cell: ({ row }) => (
			<div>{format(new Date(row.original.pago_fecha), "dd/MM/yyyy")}</div>
		),
	},
];
