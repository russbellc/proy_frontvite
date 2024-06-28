import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/dashboard/AppLayout";
import { DashboardView } from "./views/DashboardView";
import { AuthLayout } from "./layouts/login/AuthLayout";
import { LoginView } from "./views/auth/LoginView";
import { EmpresaView } from "./views/proyects/empresa/EmpresaView";

export default function Router() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<AppLayout />}>
					<Route path="/" element={<DashboardView />} />
					<Route path="/empresa" element={<EmpresaView />} />
				</Route>
				<Route element={<AuthLayout />}>
					<Route path="/auth/login" element={<LoginView />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
