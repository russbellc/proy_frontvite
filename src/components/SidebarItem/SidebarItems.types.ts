import { LucideProps } from "lucide-react"

export type SidebarItemsProps = {
	padre: string;
	isCollapsed?: boolean;
	links: {
		title: string;
		label?: string;
		href: string;
		icon: React.ForwardRefExoticComponent<
			Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
		>;
	}[];
}