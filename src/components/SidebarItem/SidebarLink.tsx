import React from "react";
import {
	Badge,
	buttonVariants,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "../ui";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";

interface SidebarLinkProps {
	isCollapsed: boolean;
	link: {
		href: string;
		title: string;
		icon: React.ForwardRefExoticComponent<
			Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
		>;
		label?: string;
	};
}

export const SidebarLink = ({ isCollapsed, link }: SidebarLinkProps) => {
	const location = useLocation();

	const activePath = location.pathname === link.href;

	return isCollapsed ? (
		<Tooltip delayDuration={0}>
			<TooltipTrigger asChild>
				<Link
					to={link.href}
					className={cn(
						buttonVariants({
							variant: activePath ? "default" : "ghost",
							size: "icon",
						}),
						"h-9 w-9",
						activePath &&
							"dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
					)}
				>
					<link.icon className="h-4 w-4" />
					<span className="sr-only">{link.title}</span>
				</Link>
			</TooltipTrigger>
			<TooltipContent side="right" className="flex items-center gap-4">
				{link.title}
				{link.label && (
					<Badge className="ml-auto text-muted-foreground" variant="secondary">
						{link.label}
					</Badge>
				)}
			</TooltipContent>
		</Tooltip>
	) : (
		<Link
			to={link.href}
			className={cn(
				buttonVariants({
					variant: activePath ? "default" : "ghost",
					size: "sm",
				}),
				activePath &&
					"dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
				"justify-start"
			)}
		>
			<link.icon className="mr-2 h-4 w-4" />
			{link.title}
			{link.label && (
				<Badge
					className={cn(
						"ml-auto",
						activePath && "text-background dark:text-white"
					)}
					variant="secondary"
				>
					{link.label}
				</Badge>
			)}
		</Link>
	);
};
