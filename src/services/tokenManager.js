import axios from "axios";

const isAccessTokenExpired = (accessToken) => {
	if (!accessToken) {
		return true;
	}
	try {
		const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
		const expirationTime = tokenPayload.exp;

		const currentTime = Math.floor(Date.now() / 1000);

		return expirationTime < currentTime;
	} catch (error) {
		console.error("Error decoding or parsing access token:", error);
		return true;
	}
};

const refreshToken = async () => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	try {
		const response = await axios.get(`${backendUrl}/refresh/token`, {
			headers: {
				refreshToken: localStorage.getItem("refreshToken"),
			},
		});

		const newAccessToken = response.data.accessToken;
		localStorage.setItem("accessToken", newAccessToken);

		return newAccessToken;
	} catch (error) {
		console.error("Error refreshing token:", error);
		return null;
	}
};

const signOut = () => {
	localStorage.removeItem("accessToken");
	localStorage.removeItem("refreshToken");
	window.location.href = "/";
};

const manageTokens = async () => {
	const accessToken = localStorage.getItem("accessToken");

	if (!accessToken || isAccessTokenExpired(accessToken)) {
		const newAccessToken = await refreshToken();

		if (newAccessToken) {
			localStorage.setItem("accessToken", newAccessToken);
			return newAccessToken;
		} else {
			signOut();
		}
	}
	return accessToken;
};

export const isRefreshTokenExpired = (refreshToken) => {
	if (!refreshToken) {
		return true;
	}
	try {
		const tokenPayload = JSON.parse(atob(refreshToken.split(".")[1]));
		const expirationTime = tokenPayload.exp;

		const currentTime = Math.floor(Date.now() / 1000);

		return expirationTime < currentTime;
	} catch (error) {
		console.error("Error decoding or parsing access token:", error);
		return true;
	}
};
export default manageTokens;
