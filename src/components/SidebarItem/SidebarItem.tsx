import { cn } from "@/lib/utils";
import { SidebarItemsProps } from "./SidebarItems.types";
import { Link, useLocation } from "react-router-dom";

export const SidebarItem = (props: SidebarItemsProps) => {
	const { item } = props;
	const { label, icon: Icon, href } = item;

	const location = useLocation();

	const activePath = location.pathname === href;

	return (
		<Link
			to={href}
			className={cn(
				` flex gap-x-4 mt-2 light:text-slate-700 dark:text-white text-sm items-center hover:bg-slate-300/20 p-2 rounded-lg cursor-pointer`,
				activePath && " bg-slate-400/20"
			)}
		>
			<Icon className="w-5 h-5" strokeWidth={1} />
			{label}
		</Link>
	);
};
