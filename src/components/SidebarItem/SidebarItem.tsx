import { cn } from "@/lib/utils";
import { SidebarItemsProps } from "./SidebarItems.types";
import { SidebarLink } from "./SidebarLink";

export const SidebarItem = ({
	padre,
	links,
	isCollapsed = false,
}: SidebarItemsProps) => {

	return (
		<div
			data-collapsed={isCollapsed}
			className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
		>
			<p className={cn(isCollapsed ? "hidden" : "", " text-ring px-4")}>
				{padre}
			</p>
			<nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
				{links.map((link, index) => (
					<SidebarLink key={index} link={link} isCollapsed={isCollapsed} />
				))}
			</nav>
		</div>
	);
};
