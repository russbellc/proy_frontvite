
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	// getPaginationRowModel,
} from "@tanstack/react-table";

import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	onNextPage: () => void; // Función para cargar la siguiente página
	onPreviousPage: () => void; // Función para cargar la página anterior
	handleChangeResultsPage: (newResultsPerPage: number) => void; // Función para cargar la página anterior
	canNextPage: boolean; // Indica si hay más páginas disponibles
	pageFirst: number;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	onNextPage,
	onPreviousPage,
	handleChangeResultsPage,
	canNextPage,
	pageFirst,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header,header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No hay resultados.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-between px-2">
				<div>
					<label className="mr-2">Resultados por página:</label>
					<select
						className="px-4 py-2 border rounded
							text-gray-700 leading-tight focus:outline-none focus:shadow-outline
						"
						value={pageFirst}
						onChange={(e) => handleChangeResultsPage(parseInt(e.target.value, 10))}
					>
						<option value={5}>5</option>
						<option value={10}>10</option>
						<option value={20}>20</option>
						<option value={50}>50</option>
						<option value={100}>100</option>
					</select>
				</div>
				<div className="flex items-center justify-end space-x-2 py-4">
					<Button
						variant="outline"
						size="sm"
						onClick={onPreviousPage}
						disabled={!data.length}
					>
						Anterior
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={onNextPage}
						disabled={!canNextPage}
					>
						Siguiente
					</Button>
				</div>
			</div>
		</>
	);
}
