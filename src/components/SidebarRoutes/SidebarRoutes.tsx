import { SidebarItem } from "../SidebarItem";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { dataGeneralSidebar, dataSupportSidebar, dataToolsSidebar } from "./SidebarRoutes.data";

export const SidebarRoutes = () => {
	return (
		<div className=" flex flex-col justify-between h-full">
			<div>
				<div className=" p-2 md:p-6">
					<p className=" text-slate-500 mb-2">General</p>
					{dataGeneralSidebar.map((item) => (
						<SidebarItem key={item.label} item={item} />
					))}
				</div>
				<Separator />
                <div className=" p-2 md:p-6">
					<p className=" text-slate-500 mb-2">Herramientas</p>
					{dataToolsSidebar.map((item) => (
						<SidebarItem key={item.label} item={item} />
					))}
				</div>
				<Separator />
                <div className=" p-2 md:p-6">
					<p className=" text-slate-500 mb-2">Soporte</p>
					{dataSupportSidebar.map((item) => (
						<SidebarItem key={item.label} item={item} />
					))}
				</div>
			</div>
            <div>
                <div className=" text-center p-6">
                <Button variant={"outline"} className="w-full">
                    Cerrar sesión
                </Button>
                </div>
                <Separator />
                <footer className=" my-4  text-center">
                    2024. Todos los derechos reservados
                </footer>
            </div>
		</div>
	);
};
