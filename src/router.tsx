import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { AppLayout } from "./layouts/dashboard/AppLayout";
import { DashboardView } from "./views/DashboardView";
import { AuthLayout } from "./layouts/login/AuthLayout";
import { LoginView } from "./views/auth/LoginView";
import { EmpresaView } from "./views/proyects/empresa/EmpresaView";
// import { AppLayout2 } from "./layouts/dashboard/AppLayout2";
import { AppLayout } from "./layouts/dashboard/AppLayout";
import { Colegiados, ColegiadosView } from "./views/proyects/colegiados";
import { Pagos, PagosLista } from "./views/proyects/pagos";
import { WebLista } from "./views/proyects/web/WebLista";
import { NewWeb } from "./views/proyects/web/NewWeb";

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
					<Route path="/colegiados/:id" element={<Colegiados />} />
					<Route path="/pagos" element={<PagosLista />} />
					<Route path="/pagos/:id" element={<Pagos />} />
					<Route path="/periodos" element={<EmpresaView />} />
					<Route path="/periodos/:id" element={<EmpresaView />} />
					<Route path="/estados" element={<EmpresaView />} />
					<Route path="/estados/:id" element={<EmpresaView />} />
					<Route path="/web" element={<WebLista />} />
					<Route path="/web/:id" element={<NewWeb />} />
				</Route>
				<Route element={<AuthLayout />}>
					<Route path="/auth/login" element={<LoginView />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
