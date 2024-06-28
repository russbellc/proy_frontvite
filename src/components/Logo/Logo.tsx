import { useNavigate } from "react-router-dom";

export const Logo = () => {
	const navigate = useNavigate();

	const handleLogoClick = () => navigate("/");

	return (
		<div
			className=" min-h-20 flex items-center px-6 border-b cursor-pointer gap-2"
			onClick={handleLogoClick}
		>
			<img src="/logo.svg" alt="Logo" width={30} height={30} />
			<h1 className=" font-bold text-xl">Baymax App</h1>
		</div>
	);
};
