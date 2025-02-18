import { Card, CardContent, Skeleton } from "@/components/ui";
import { FC } from "react";

export const WebFormSkeleton: FC = () => {
	return (
		<>
			<div className="w-full md:w-[70%] md:pr-2">
				<Card>
					<CardContent>
						<div className="border rounded-md shadow-md py-4 px-6">
							<div className="flex flex-col md:flex-row gap-6">
								{/* Contenido de la primera columna */}
								<div className="flex-1 space-y-4">
									{/* <Skeleton className="h-6 w-full mb-2" /> */}
									<Skeleton className="h-10 w-full mb-2" />
									<Skeleton className="h-6 w-full mb-2" />
									<Skeleton className="h-10 w-full mb-2" />
									<Skeleton className="h-6 w-full mb-2" />
									<Skeleton className="h-20 w-full mb-2" />
									<Skeleton className="h-6 w-full mb-2" />
									<Skeleton className="h-40 w-full mb-2" />
								</div>
								{/* Contenido de la segunda columna */}
								<div className="flex-1 space-y-4">
									{/* <Skeleton className="h-6 w-full mb-2" /> */}
									<Skeleton className="h-10 w-full mb-2" />
									<Skeleton className="h-6 w-full mb-2" />
									<Skeleton className="h-10 w-full mb-2" />
									<Skeleton className="h-6 w-full mb-2" />
									<Skeleton className="h-80 w-full mb-2" />
									{/* <Skeleton className="h-10 w-full mb-2" /> */}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
				<div className="mt-6">
					<h2 className="text-xl font-semibold mb-2">Galería de Imágenes</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{Array.from({ length: 8 }).map((_, index) => (
							<div key={index} className="relative">
								<Skeleton className="w-full h-40 rounded-md" />
							</div>
						))}
					</div>
				</div>
			</div>
			<div className="w-full md:w-[30%] mt-5 md:block md:pl-2 md:px-1 xl:px-16">
				<h2 className="text-xl font-semibold my-4">Vista previa</h2>
				<Card className="hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-shadow duration-300">
					<Skeleton className="w-full h-52 rounded-t-md" />
					<CardContent>
						<Skeleton className="h-6 w-full mt-3" />
						<Skeleton className="h-4 w-full mt-2" />
						<Skeleton className="h-4 w-full mt-2" />
						<Skeleton className="h-4 w-full mt-2" />
					</CardContent>
				</Card>
			</div>
		</>
	);
};
