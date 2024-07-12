import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
interface LogoProps {
	isCollapsed?: boolean;
}
export const Logo = ({ isCollapsed }: LogoProps) => {
	const navigate = useNavigate();
	const handleLogoClick = () => navigate("/");

	return (
		<div
			className=" min-h-14 flex items-center cursor-pointer gap-3"
			onClick={handleLogoClick}
		>
			<img src="/logo.svg" alt="Logo" className=" h-7 w-7" />
			<h1
				className={cn(
					isCollapsed ? "hidden" : "flex",
					"font-bold text-lg transition-all duration-700 ease-in-out",
					"whitespace-nowrap"
				)}
			>
				Baymax App
			</h1>
		</div>
	);
};
