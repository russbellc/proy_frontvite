import { Button, Input, Label } from "@/components/ui";
import { Link } from "react-router-dom";

export const LoginView = () => {
	return (
		<div className="flex items-center justify-center py-12">
			<div className="mx-auto grid w-[350px] gap-6">
				<div className="grid gap-2 text-center">
					<div className="flex items-center text-lg font-medium cursor-pointer mx-auto mb-16 lg:hidden ">
						<img
							src="/logo.svg"
							alt="Logo"
							width={40}
							height={40}
							className="mx-3"
						/>
						<h1 className=" font-bold text-2xl">Baymax App</h1>
					</div>
					<h1 className="text-3xl font-bold">Acceso de usuario</h1>
					<p className="text-balance text-muted-foreground">
						Ingrese su correo electrónico para iniciar sesión en su cuenta
					</p>
				</div>
				<div className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="email">Correo electrónico</Label>
						<Input id="email" type="email" placeholder="m@gmail.com" required />
					</div>
					<div className="grid gap-2">
						<div className="flex items-center">
							<Label htmlFor="password">Contraseña</Label>
							<Link
								to="/forgot-password"
								className="ml-auto inline-block text-sm underline"
							>
								¿Olvidaste tu contraseña?
							</Link>
						</div>
						<Input id="password" type="password" required />
					</div>
					<Button type="submit" className="w-full">
						Iniciar sesión
					</Button>
				</div>
				{/* <div className="mt-4 text-center text-sm">
					¿No tienes una cuenta?{" "}
					<Link to="#" className="underline">
						Registrate
					</Link>
				</div> */}
			</div>
		</div>
	);
};
