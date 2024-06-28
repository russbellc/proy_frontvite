import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
	return (
		<>
			<div>AuthLayout</div>
            {/* injectar el contenido de los componentes Outlet*/}
			<Outlet />
		</>
	);
};
