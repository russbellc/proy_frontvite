import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Input,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
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
					<CardTitle>Colegiados</CardTitle>
					<CardDescription>
						Listado de colegiados del CROXCUSCO.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form>
						<div className="grid w-full items-center gap-4">
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="name">Name</Label>
								<Input id="name" placeholder="Name of your project" />
							</div>
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="framework">Framework</Label>
								<Select>
									<SelectTrigger id="framework">
										<SelectValue placeholder="Select" />
									</SelectTrigger>
									<SelectContent position="popper">
										<SelectItem value="next">Next.js</SelectItem>
										<SelectItem value="sveltekit">SvelteKit</SelectItem>
										<SelectItem value="astro">Astro</SelectItem>
										<SelectItem value="nuxt">Nuxt.js</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</form>
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
