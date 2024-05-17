import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const setUrl = useNavigate();
	const [data, setData] = useState("");

	const getData = async () => {
		try {
			const response = await axios.get(`${backendUrl}/getData`);
			setData(response.data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	useEffect(() => {
		setUrl('404_error')
		getData();
	}, []);

	return (
		<div>
			<h1>404 - Page Not Found</h1>
			<p>
				Please visit:{" "}
				<a
					href={data}
					rel="noopener noreferrer"
					className="text-blue-400 underline"
				>
					{data}
				</a>
			</p>
		</div>
	);
};

export default NotFound;
