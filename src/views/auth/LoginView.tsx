import { Button, Input, Label } from "@/components/ui";
import { UserLoginForm } from "@/types";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@/components/ErrorMessage";
import { cn } from "@/lib/utils";
import { authenticateUser } from "@/graphql";

export const LoginView = () => {
	const initialValues: UserLoginForm = {
		email: "",
		password: "",
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ defaultValues: initialValues });

	const handleLogin = async (formData: UserLoginForm) => {
		console.log(formData);
		const resp = await authenticateUser(formData);
		console.log(resp);
	};

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
						<h1 className=" font-bold text-2xl">FastMed App</h1>
					</div>
					<h1 className="text-3xl font-bold">Acceso de usuario</h1>
					<p className="text-balance text-muted-foreground">
						Ingrese su correo electrónico para iniciar sesión en su cuenta
					</p>
				</div>
				<form onSubmit={handleSubmit(handleLogin)} noValidate>
					<div className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="email">Correo electrónico</Label>
							<Input
								id="email"
								type="email"
								placeholder="Email de Registro"
								{...register("email", {
									required: "El correo electrónico es obligatorio",
									pattern: {
										value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
										message: "Correo electrónico inválido",
									},
								})}
							/>
							{errors.email && (
								<ErrorMessage>{errors.email.message}</ErrorMessage>
							)}
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
							<Input
								id="password"
								type="password"
								placeholder="Contraseña"
								{...register("password", {
									required: "La contraseña es obligatoria",
									minLength: {
										value: 6,
										message: "La contraseña debe tener al menos 6 caracteres",
									},
								})}
							/>
							{errors.password && (
								<ErrorMessage>{errors.password.message}</ErrorMessage>
							)}
						</div>
						<Button
							type="submit"
							className={cn(
								"w-full",
								errors.email || errors.password ? "bg-gray-400" : "bg-primary",
								"hover:bg-primary/90"
							)}
						>
							Iniciar sesión
						</Button>
					</div>
				</form>
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
