import { Logo } from "@/components/Logo";
import { ModeToggle } from "@/components/mode-toggle";
import { Navbar2 } from "@/components/Navbar";
import { SidebarRoutes } from "@/components/SidebarRoutes";
import {
	Button,
	Input,
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
	AlertCircle,
	Archive,
	ArchiveX,
	File,
	Inbox,
	Menu,
	MessagesSquare,
	Search,
	Send,
	ShoppingCart,
	Trash2,
	Users2,
} from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";

interface AppLayoutProps {
	defaultLayout?: number[] | undefined;
	defaultCollapsed?: boolean;
	navCollapsedSize?: number;
}

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
						<div className=" flex flex-col justify-between h-full">
							<div className="h-full">
								<ScrollArea className="h-screen">
									<Separator />
									<Navbar2
										padre={"General"}
										isCollapsed={isCollapsed}
										links={[
											{
												title: "Inbox",
												label: "128",
												icon: Inbox,
												variant: "default",
											},
											{
												title: "Drafts",
												label: "9",
												icon: File,
												variant: "ghost",
											},
											{
												title: "Sent",
												label: "",
												icon: Send,
												variant: "ghost",
											},
											{
												title: "Junk",
												label: "23",
												icon: ArchiveX,
												variant: "ghost",
											},
											{
												title: "Trash",
												label: "",
												icon: Trash2,
												variant: "ghost",
											},
											{
												title: "Archive",
												label: "",
												icon: Archive,
												variant: "ghost",
											},
										]}
									/>
									<Separator />
									<Navbar2
										padre={"Herramientas"}
										isCollapsed={isCollapsed}
										links={[
											{
												title: "Social",
												label: "972",
												icon: Users2,
												variant: "ghost",
											},
											{
												title: "Updates",
												label: "342",
												icon: AlertCircle,
												variant: "ghost",
											},
											{
												title: "Forums",
												label: "128",
												icon: MessagesSquare,
												variant: "ghost",
											},
											{
												title: "Shopping",
												label: "8",
												icon: ShoppingCart,
												variant: "ghost",
											},
											{
												title: "Promotions",
												label: "21",
												icon: Archive,
												variant: "ghost",
											},
										]}
									/>
									<Separator />
									<Navbar2
										padre={"Herramientas"}
										isCollapsed={isCollapsed}
										links={[
											{
												title: "Social",
												label: "972",
												icon: Users2,
												variant: "ghost",
											},
											{
												title: "Updates",
												label: "342",
												icon: AlertCircle,
												variant: "ghost",
											},
											{
												title: "Forums",
												label: "128",
												icon: MessagesSquare,
												variant: "ghost",
											},
											{
												title: "Shopping",
												label: "8",
												icon: ShoppingCart,
												variant: "ghost",
											},
											{
												title: "Promotions",
												label: "21",
												icon: Archive,
												variant: "ghost",
											},
										]}
									/>
								</ScrollArea>
							</div>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
						<div className="flex h-full flex-col">
							<div className="flex items-center p-2 justify-between gap-x-4 md:pr-6">
								<div className=" block md:hidden">
									<Sheet>
										<SheetTrigger className=" flex items-center">
											<Menu className="h-4 w-4" />
										</SheetTrigger>
										<SheetContent side={"left"}>
											<ScrollArea className="h-full">
												<SidebarRoutes />
											</ScrollArea>
										</SheetContent>
									</Sheet>
								</div>
								<div className=" items-center gap-2 hidden md:flex">
									<Button variant="ghost" size="icon" onClick={handledActive}>
										<Menu className="h-4 w-4" />
									</Button>
								</div>
								<div className=" mx-4 relative w-[500px]">
									<Input placeholder="Buscar..." className=" rounded-lg" />
									<Search strokeWidth={1} className=" absolute top-2 right-2" />
								</div>
								<div className=" flex items-center space-x-4">
									<ModeToggle />
									<UserNav />
								</div>
							</div>
							<Separator />
							<div className="p-6 h-full bg-[#fafbfc] dark:bg-secondary">
								<Outlet />
							</div>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</TooltipProvider>
		</>
	);
};
/*
	<div className="flex w-full h-full">
				<div className=" hidden xl:block w-80 h-full xl:fixed">
					<Sidebar />
				</div>
				<div className=" w-full xl:ml-80">
					<Navbar />
					<div className="p-6 bg-[#fafbfc] dark:bg-secondary">
						<Outlet />
					</div>
				</div>
			</div>
*/
