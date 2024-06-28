import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";

export const AppLayout = () => {
	return (
		<>
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
		</>
	);
};
