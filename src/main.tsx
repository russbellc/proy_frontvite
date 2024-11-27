import React from "react";
import { SWRConfig } from "swr";
import ReactDOM from "react-dom/client";
import "./index.css";
import Router from "./router";
import { ThemeProvider } from "./components/theme-provider";
import { ApolloProvider } from "@apollo/client";
import client1 from "./client/client1";
import client2 from "./client/client2";
import { client3 } from "./client";
import { Toaster } from "./components/ui";

const fetcher = async (query: string, variables?: undefined) => {
	const requestHeaders = {
		authorization: "Bearer " + localStorage.getItem("token"),
	};
	return await client3.request(query, variables, requestHeaders);
};

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<ApolloProvider client={client1}>
					<ApolloProvider client={client2}>
						<SWRConfig
							value={{
								fetcher,
								refreshInterval: 500,
							}}
						>
							<Router />
							<Toaster />
						</SWRConfig>
					</ApolloProvider>
				</ApolloProvider>
			</ThemeProvider>
		</ThemeProvider>
	</React.StrictMode>
);
