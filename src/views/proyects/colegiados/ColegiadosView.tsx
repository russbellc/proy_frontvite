import { ListaColegiados } from "@/components/app/Colegiados/ListaColegiados";
import {
	Button,
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui";

export const ColegiadosView = () => {
	return (
		<div>
			<div className="flex items-center justify-between space-y-2 px-4 pb-3 pt-2">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">Colegiados</h2>
					<p className="text-muted-foreground">
						Listado de colegiados del CROXCUSCO
					</p>
				</div>
			</div>
			<Card>
				<CardHeader>
					<div className="flex items-center justify-start">
						<Dialog>
							<DialogTrigger asChild>
								<Button variant="secondary" size="sm">
									Nuevo Colegiado
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Are you absolutely sure?</DialogTitle>
									<DialogDescription>
										This action cannot be undone. Are you sure you want to
										permanently delete this file from our servers?
									</DialogDescription>
								</DialogHeader>
								<DialogFooter>
									<Button type="submit">Confirm</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				</CardHeader>
				<CardContent>
					<ListaColegiados />
				</CardContent>
				<CardFooter>
					<div className="text-xs text-muted-foreground">
						Showing <strong>1-10</strong> of <strong>32</strong> products
					</div>
				</CardFooter>
			</Card>
		</div>
	);
};
