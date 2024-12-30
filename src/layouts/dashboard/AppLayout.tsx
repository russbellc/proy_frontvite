import { Logo } from "@/components/Logo";
import { ModeToggle } from "@/components/mode-toggle";
import { SidebarItem, SidebarItemsProps } from "@/components/SidebarItem";
import { SidebarRoutes } from "@/components/SidebarRoutes";
import {
	Button,
	// Input,
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
	ScrollArea,
	Separator,
	Sheet,
	SheetContent,
	SheetTrigger,
	TooltipProvider,
} from "@/components/ui";
import { UserNav } from "@/components/UserNav";
import { cn } from "@/lib/utils";
import {
	Archive,
	BadgeCheck,
	HandCoins,
	LayoutDashboard,
	Menu,
	Newspaper,
	Users2,
} from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";

interface AppLayoutProps {
	defaultLayout?: number[] | undefined;
	defaultCollapsed?: boolean;
	navCollapsedSize?: number;
}

const nav: SidebarItemsProps[] = [
	{
		padre: "General",
		links: [
			{
				title: "Dashboard",
				// label: "128",
				href: "/",
				icon: LayoutDashboard,
			},
			{
				title: "Colegiados",
				// label: "128",
				href: "/colegiados",
				icon: Users2,
			},
			{
				title: "Pagos",
				// label: "",
				href: "/pagos",
				icon: HandCoins,
			},
		],
	},
	{
		padre: "Web",
		links: [
			{
				title: "Articulos",
				// label: "21",
				href: "/articulos",
				icon: Newspaper,
			},
			{
				title: "Noticias",
				// label: "21",
				href: "/noticias",
				icon: Archive,
			},
		],
	},
	{
		padre: "Configuración",
		links: [
			{
				title: "Periodos",
				// label: "972",
				href: "/periodos",
				icon: Users2,
			},
			{
				title: "Estados",
				// label: "342",
				href: "/estados",
				icon: BadgeCheck,
			},
		],
	},
];

export const AppLayout = ({
	defaultLayout = [265, 440, 655],
	defaultCollapsed = false,
	navCollapsedSize,
}: AppLayoutProps) => {
	const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

	const handledActive = () => {
		setIsCollapsed(!isCollapsed);
	};

	return (
		<>
			<TooltipProvider delayDuration={0}>
				<ResizablePanelGroup
					direction="horizontal"
					onLayout={(sizes: number[]) => {
						document.cookie = `react-resizable-panels:layout=${JSON.stringify(
							sizes
						)}`;
					}}
					className="h-full items-stretch"
				>
					<ResizablePanel
						defaultSize={defaultLayout[0]}
						collapsedSize={navCollapsedSize}
						collapsible={true}
						minSize={15}
						maxSize={20}
						onCollapse={() => {
							console.log(isCollapsed);
							setIsCollapsed(isCollapsed);
							document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
								isCollapsed
							)}`;
						}}
						className={cn(
							isCollapsed ? "min-w-[50px] max-w-[50px]" : "min-w-[200px]",
							"transition-all duration-300 ease-in-out h-screen",
							"hidden md:flex flex-col justify-between bg-background"
						)}
					>
						<div
							className={cn(
								" flex flex-col h-[52px] items-center justify-center py-7",
								isCollapsed ? "h-[52px]" : "px-2"
							)}
						>
							<Logo isCollapsed={isCollapsed} />
						</div>
						<ScrollArea className="h-full">
							<div className=" flex flex-col justify-between h-full">
								<div className="h-full">
									{nav.map((item, index) => (
										<>
											{/* <Separator key={index} /> */}
											<SidebarItem
												key={index}
												padre={item.padre}
												links={item.links}
												isCollapsed={isCollapsed}
											/>
										</>
									))}
								</div>
							</div>
						</ScrollArea>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel
						defaultSize={defaultLayout[1]}
						minSize={30}
						className={cn("h-screen")}
					>
						<div className="flex h-full flex-col">
							<div className="flex items-center p-2 justify-between gap-x-4 md:pr-4">
								<div className=" block md:hidden">
									<Sheet>
										<SheetTrigger className=" flex items-center">
											<Menu className="h-4 w-4" />
										</SheetTrigger>
										<SheetContent side={"left"}>
											<SidebarRoutes nav={nav} />
										</SheetContent>
									</Sheet>
								</div>
								<div className=" items-center gap-2 hidden md:flex">
									<Button variant="ghost" size="icon" onClick={handledActive}>
										<Menu className="h-4 w-4" />
									</Button>
								</div>
								{/* <div className=" mx-4 relative w-[500px]">
									<Input placeholder="Buscar..." className=" rounded-lg" />
									<Search strokeWidth={1} className=" absolute top-2 right-2" />
								</div> */}
								<div className=" flex items-center space-x-4">
									<ModeToggle />
									<UserNav />
								</div>
							</div>
							<Separator />
							<ScrollArea className="h-full bg-[#fafbfc] dark:bg-secondary">
								<div className="flex flex-col p-4 h-full bg-[#fafbfc] dark:bg-secondary">
									<div className="flex-grow">
										<Outlet />
									</div>
									<footer className="mt-auto py-4 text-center text-secondary-foreground">
										<p>© {new Date().getFullYear()} FastMed App. Todos los derechos reservados.</p>
									</footer>
								</div>
							</ScrollArea>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</TooltipProvider>
		</>
	);
};
