import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	// getPaginationRowModel,
} from "@tanstack/react-table";

import {
	Button,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	Drawer,
	DrawerContent,
	DrawerTrigger,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useEffect, useState } from "react";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	onNextPage: () => void; // Función para cargar la siguiente página
	onPreviousPage: () => void; // Función para cargar la página anterior
	handleChangeResultsPage: (newResultsPerPage: number) => void; // Función para cargar la página anterior
	canNextPage: boolean; // Indica si hay más páginas disponibles
	pageFirst: number;
}

type Status = {
	value: string;
	label: string;
};

const pages: Status[] = [
	{
		value: "5",
		label: "5",
	},
	{
		value: "10",
		label: "10",
	},
	{
		value: "20",
		label: "20",
	},
	{
		value: "50",
		label: "50",
	},
	{
		value: "100",
		label: "100",
	},
];

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
	const [open, setOpen] = useState<boolean>(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);

	useEffect(() => {
		if (selectedStatus) {
			handleChangeResultsPage(parseInt(selectedStatus.value));
		}
	}, [handleChangeResultsPage, selectedStatus])
	

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
												: flexRender(header.column.columnDef.header, header.getContext())}
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
					{isDesktop ? (
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<Button variant="outline" className="w-[150px] justify-start"
								>
									{selectedStatus ? (
										<>{selectedStatus.label} Registros</>
									) : (
										<>{pageFirst} Registros </>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-[200px] p-0" align="start">
								<StatusList
									setOpen={setOpen}
									setSelectedStatus={setSelectedStatus}
								/>
							</PopoverContent>
						</Popover>
					) : (
						<Drawer open={open} onOpenChange={setOpen}>
							<DrawerTrigger asChild>
								<Button variant="outline" className="w-[150px] justify-start">
									{selectedStatus ? (
										<>{selectedStatus.label} Registros</>
									) : (
										<>{pageFirst} Registros </>
									)}
								</Button>
							</DrawerTrigger>
							<DrawerContent>
								<div className="mt-4 border-t">
									<StatusList
										setOpen={setOpen}
										setSelectedStatus={setSelectedStatus}
									/>
								</div>
							</DrawerContent>
						</Drawer>
					)}
					{/* <label className="mr-2">Resultados por página:</label> */}
					{/* <select
						className="px-4 py-2 border rounded
							text-gray-700 leading-tight focus:outline-none focus:shadow-outline
						"
						value={pageFirst}
						onChange={(e) =>
							handleChangeResultsPage(parseInt(e.target.value, 10))
						}
					>
						<option value={5}>5</option>
						<option value={10}>10</option>
						<option value={20}>20</option>
						<option value={50}>50</option>
						<option value={100}>100</option>
					</select> */}
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

function StatusList({
	setOpen,
	setSelectedStatus,
}: {
	setOpen: (open: boolean) => void;
	setSelectedStatus: (status: Status | null) => void;
}) {
	return (
		<Command>
			<CommandInput placeholder="Filter status..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup>
					{pages.map((status) => (
						<CommandItem
							key={status.value}
							value={status.value}
							onSelect={(value) => {
								setSelectedStatus(
									pages.find((priority) => priority.value === value) || null
								);
								setOpen(false);
							}}
						>
							{status.label}
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	);
}
