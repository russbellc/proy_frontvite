import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
	return (
		<>
			<div className="w-full lg:grid lg:h-screen lg:grid-cols-2 xl:h-screen">
				{/* <div className="hidden bg-muted lg:block"> */}
				<div className="relative hidden h-full flex-col bg-muted p-10 lg:flex dark:border-r">
					{/* <div className="absolute inset-0 bg-zinc-900" /> */}
					<div className="relative z-20 flex items-center text-lg font-medium cursor-pointer gap-3">
						<img src="/logo.svg" alt="Logo" width={30} height={30} />
						<h1 className=" font-bold text-xl">Baymax App</h1>
					</div>
					<div className="relative z-20 mt-auto">
						{/* <blockquote className="space-y-2">
							<p className="text-lg">
								&ldquo;This library has saved me countless hours of work and
								helped me deliver stunning designs to my clients faster than
								ever before.&rdquo;
							</p>
							<footer className="text-sm">Sofia Davis</footer>
						</blockquote> */}
					</div>
				</div>
				<Outlet />
			</div>
		</>
	);
};
