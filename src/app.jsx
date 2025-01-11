import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./styles/theme.css";
import "./app.css";
import "./styles/icons/style.css";

import { Menu } from "./components/Menu";

export default function App() {
	return (
		<Router
			root={(props) => (
				<MetaProvider>
					<Menu />
					<Title>SolidStart - Basic</Title>
					<Suspense>{props.children}</Suspense>
				</MetaProvider>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
