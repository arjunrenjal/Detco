import axios from "axios";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const history = useNavigate();
	const formRef = useRef();

	const sendEmail = async (email) => {
		try {
			const response = await axios.post(
				`${backendUrl}/auth/forgot-password=${email}`
			);
			setLoading(false);
			if (response.data.state == true) {
				localStorage.clear();
				history("/", { replace: true });
				setTimeout(() => {
					window.alert("Password Reset link Sent!");
				}, 1000);
			} else {
				window.alert("Failed!");
				setForm({
					email: "",
				});
			}
		} catch (error) {
			setLoading(false);
			console.error("Error fetching data:", error);
		}
	};
	const [form, setForm] = useState({
		email: "",
	});

	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		await sendEmail(form.email);
	};

	return (
		<div className="bg-gradient-diagonal bg-cover bg-no-repeat bg-center min-h-screen flex justify-center items-center">
			<div className="bg-white w-5/6 md:w-3/5 lg:w-5/12 h-[500px] md:h-[550px] lg:h-[600px] flex justify-center rounded-3xl">
				<div className="mt-4 w-full mb-96 justify-center">
					<h1 className="p-4 text-4xl purple-text-gradient font-bold text-center ">
						Reset Password
					</h1>
					<form ref={formRef} onSubmit={handleSubmit}>
						<div className="lg:mt-16 mt-14 lg:px-16 md:px-16 px-4">
							<p className="text-tertiary px-2">
								Please enter your E-mail Id:
							</p>
							<input
								type="email"
								name="email"
								value={form.email}
								onChange={handleChange}
								placeholder="Email"
								className="w-full p-4 rounded-3xl border-2 text-primary bg-transperent-80 border-pink-100 focus:outline-none focus:border-purple-400"
							/>
						</div>

						<div className="mt-10 justify-center flex">
							<button
								type="submit"
								className="bg-gradient-diagonal text-white py-3 px-10 rounded-full hover:bg-primary-dark focus:outline-none shadow-lg shadow-secondary"
							>
								{loading ? "Sending..." : "Send"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
