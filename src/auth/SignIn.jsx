// TODO Add Footer

import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isRefreshTokenExpired } from "../services/tokenManager";
import Footer from "../components/Footer";

const SignIn = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [loading, setLoading] = useState(false);
    const history = useNavigate();
    const formRef = useRef();

    useEffect(() => {
        const refreshToken = localStorage.getItem("refreshToken");
        const status = isRefreshTokenExpired(refreshToken);
        if (!status) {
            history("/home");
        } else {
            localStorage.clear();
        }
    }, [history]);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const userLogin = async (email, password) => {
        try {
            const response = await axios.post(
                `${backendUrl}/login/user=${email}`,
                {
                    password: password,
                }
            );

            if (response.data.auth === true) {
                localStorage.setItem("accessToken", response.data.accessToken);
                localStorage.setItem(
                    "refreshToken",
                    response.data.refreshToken
                );

                history("/home", { replace: true });
            } else {
                window.alert("Login Failed!");
                setForm({
                    email: "",
                    password: "",
                });
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Error fetching data:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await userLogin(form.email, form.password);
    };

    const forgotPassword = () => {
        history("/auth/forgot-password", { replace: false });
    };

    return (
        <div>
            <div className="bg-white bg-cover bg-no-repeat bg-center min-h-screen flex justify-center items-center">
                <div className="bg-white w-full md:w-3/5 lg:w-5/12 h-[500px] md:h-[550px] lg:h-[600px] flex justify-center rounded-2xl border border-purple-100">
                    <div className="mt-12 w-full mb-96 justify-center">
                        <h1 className="p-4 text-4xl text-center">
                            <span className="purple-text-gradient font-bold bg-clip-text text-transparent">Det</span>
                            <span className="text-black font-bold italic">Co.</span>
                        </h1>

                        <form ref={formRef} onSubmit={handleSubmit}>
                            <div className="lg:mt-10 mt-6 lg:px-8 md:px-8 px-4">
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="w-full p-3 lg:p-4 rounded-2xl border-2 text-primary text-sm bg-purple-50 border-purple-200 focus:outline-none focus:border-purple-400"
                                />
                            </div>
                            <div className="lg:mt-5 mt-3 lg:px-8 md:px-8 px-4">
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="w-full p-3 lg:p-4 rounded-2xl text-sm border-2 text-primary bg-purple-50 border-purple-200 focus:outline-none focus:border-purple-400"
                                />
                            </div>

                            <div className="mt-5 justify-between flex lg:px-8 md:px-8 px-4">
                                <p className="text-secondary text-sm text-start hover:scale-95 focus:outline-none transition-transform duration-300 cursor-pointer">
                                    Register
                                </p>
                                <p
                                    className="text-secondary text-sm text-end hover:scale-95 focus:outline-none transition-transform duration-300 cursor-pointer"
                                    onClick={forgotPassword}
                                >
                                    Forgot Password?
                                </p>
                            </div>

                            <div className="mt-10 justify-center flex lg:px-8 md:px-8 px-4">
                                <button
                                    type="submit"
                                    className="bg-gradient-diagonal text-white py-3 px-8 lg:px-10 font-semibold rounded-2xl hover:scale-95 focus:outline-none transition-transform duration-300"
                                >
                                    {loading ? "Logging in.." : "Login"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SignIn;
