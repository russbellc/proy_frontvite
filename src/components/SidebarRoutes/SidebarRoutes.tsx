import { Logo } from "../Logo";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui";
import { SidebarItem, SidebarItemsProps } from "../SidebarItem";
import { FC } from "react";


interface Props {
	nav: SidebarItemsProps[];
}

export const SidebarRoutes: FC<Props> = ({ nav }) => {
	return (
		<div className=" flex flex-col h-full">
			<div className=" flex flex-col items-center justify-center m-auto bg-background w-auto ">
				<Logo />
			</div>
			<ScrollArea className="h-full">
				<div className=" flex flex-col justify-between h-full">
					<div className="h-full">
						{nav.map((item, index) => (
							<>
								<Separator key={index} />
								<SidebarItem
									key={index}
									padre={item.padre}
									links={item.links}
								/>
							</>
						))}
					</div>
				</div>
			</ScrollArea>
		</div>
	);
};
