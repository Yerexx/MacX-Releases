import type { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Changelog from "./pages/changelogs";
import Landing from "./pages/landing";

const App: FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Landing />} />
				<Route path="/changelog" element={<Changelog />} />
				<Route path="*" element={<Landing />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
