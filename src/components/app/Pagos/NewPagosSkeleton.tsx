import { Skeleton } from "@/components/ui";

export function NewPagosSkeleton() {
	return (
		<div className="space-y-4 p-4">
			<div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
				{/* Tipo de Documento */}
				<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
					<div className="flex flex-col">
						<Skeleton className="h-4 w-full mb-2" />
						<Skeleton className="h-12 w-full rounded-md" />
					</div>
				</div>

				{/* Nro de Documento */}
				<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
					<div className="flex flex-col">
						<Skeleton className="h-4 w-full mb-2" />
						<Skeleton className="h-12 w-full rounded-md" />
					</div>
				</div>

				{/* Nro. COP */}
				<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
					<div className="flex flex-col">
						<Skeleton className="h-4 w-full mb-2" />
						<Skeleton className="h-12 w-full rounded-md" />
					</div>
				</div>

				{/* Fecha de Pago */}
				<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
					<div className="flex flex-col">
						<Skeleton className="h-4 w-full mb-2" />
						<Skeleton className="h-12 w-full rounded-md" />
					</div>
				</div>

				{/* Monto Total */}
				<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
					<div className="flex flex-col">
						<Skeleton className="h-4 w-full mb-2" />
						<Skeleton className="h-12 w-full rounded-md" />
					</div>
				</div>

				{/* Nro Boleta/Venta */}
				<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
					<div className="flex flex-col">
						<Skeleton className="h-4 w-full mb-2" />
						<Skeleton className="h-12 w-full rounded-md" />
					</div>
				</div>

				{/* Recibo */}
				<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-1/6">
					<div className="flex flex-col">
						<Skeleton className="h-4 w-full mb-2" />
						<Skeleton className="h-12 w-full rounded-md" />
					</div>
				</div>

				{/* Botón Guardar */}
				<div className="flex-1 sm:flex-auto sm:w-1/3 lg:w-6/6">
					<Skeleton className="h-10 w-full sm:w-32 rounded-md" />
				</div>
			</div>
		</div>
	);
}
