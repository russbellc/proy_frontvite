import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
	return (
		<>
			<div className="w-full lg:grid lg:h-screen lg:grid-cols-2 xl:h-screen">
				<div
					className="relative hidden h-full flex-col bg-muted p-10 lg:flex dark:border-r"
					style={{
						// backgroundImage: "url('/login/obstetra02-v1.png')",
						backgroundImage: "url('/login/background-med01.jpg')",
						backgroundSize: "cover",
						backgroundRepeat: "no-repeat",
						backgroundPosition: "center",
					}}
				>
					<div className="relative z-20 flex items-center text-lg font-medium cursor-pointer gap-3">
						<img src="/logo.svg" alt="Logo" width={30} height={30} />
						<h1 className=" font-bold text-xl">FastMed App</h1>
					</div>
					<div className="relative z-20 mt-auto">
						<blockquote className="space-y-2">
							<p className="text-lg">
								&ldquo;FastMed ha simplificado mis tareas diarias, ayudándome a
								proporcionar un cuidado médico eficiente y de alta
								calidad.&rdquo;
							</p>
							<footer className="text-sm">Sofia Davis</footer>
						</blockquote>
					</div>
				</div>
				<Outlet />
			</div>
		</>
	);
};
