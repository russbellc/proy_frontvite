import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { AppLayout } from "./layouts/dashboard/AppLayout";
import { DashboardView } from "./views/DashboardView";
import { AuthLayout } from "./layouts/login/AuthLayout";
import { LoginView } from "./views/auth/LoginView";
import { EmpresaView } from "./views/proyects/empresa/EmpresaView";
// import { AppLayout2 } from "./layouts/dashboard/AppLayout2";
import { AppLayout } from "./layouts/dashboard/AppLayout";
import { ColegiadosDetalleView, ColegiadosView } from "./views/proyects/colegiados";

export default function Router() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					element={
						<AppLayout
							defaultLayout={[265, 440, 655]}
							defaultCollapsed={false}
						/>
					}
				>
					<Route path="/" element={<DashboardView />} />
					<Route path="/empresa" element={<EmpresaView />} />
					<Route path="/colegiados" element={<ColegiadosView />} />
					<Route path="/colegiados/:id" element={<ColegiadosDetalleView />} />
					<Route path="/pagos" element={<EmpresaView />} />
					<Route path="/periodos" element={<EmpresaView />} />
					<Route path="/estados" element={<EmpresaView />} />
					<Route path="/articulos" element={<EmpresaView />} />
					<Route path="/noticias" element={<EmpresaView />} />
				</Route>
				<Route element={<AuthLayout />}>
					<Route path="/auth/login" element={<LoginView />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
