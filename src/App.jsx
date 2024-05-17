import axios from "axios";
import { inject } from "@vercel/analytics";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/404";
import ServerError from "./pages/500";
import SignIn from "./auth/SignIn";
import ForgotPassword from "./auth/ForgotPassword";
import Edit from "./pages/Edit";
import Upload from "./pages/Upload";

function App() {
	inject();

	const [isServerUp, setIsServerUp] = useState(true);
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const checkServerStatus = async () => {
		try {
			await axios.get(`${backendUrl}`, { timeout: 5000 });
			setIsServerUp(true);
		} catch (error) {
			setIsServerUp(false);
		}
	};

	useEffect(() => {
		// checkServerStatus();
	});

	return (
		<BrowserRouter>
			<div>
				{isServerUp ? (
					<Routes>
						<Route path="/" element={<SignIn />} />
						<Route path="/home" element={<Home />} />
						<Route
							path="/auth/forgot-password"
							element={<ForgotPassword />}
						/>
						<Route path="/admin" element={<Edit />} />
						<Route path="/upload" element={<Upload />} />
						<Route path="/auth/reset-password/:id/:token" />
						<Route path="*" element={<NotFound />} />
					</Routes>
				) : (
					<ServerError />
				)}
			</div>
		</BrowserRouter>
	);
}

export default App;
