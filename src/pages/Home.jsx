//TODO add footer
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Card from "../components/Card";
import manageTokens from "../services/tokenManager";
import InfoCard from "../components/InfoCard";
import Edit from "./Edit";
import Add from "./Add";
import Upload from "./Upload";
import Footer from "../components/Footer";

const Home = () => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const history = useNavigate();
	const [activeTab, setActiveTab] = useState("search");
	const [isValid, setValid] = useState(false);
	const [color, setColor] = useState("bg-slate-400");
	const [userData, setUserData] = useState([]);
	const [loanData, setLoanData] = useState([]);
	const [adharInputValue, setAdharInputValue] = useState("");
	const [searchStatus, setSearchStatus] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [shouldRefetchData, setShouldRefetchData] = useState(false);
	const [addModel, setAddModel] = useState(false);

	//function to search the user using their id
	const searchUsers = async (id, status) => {
		try {
			const accessToken = await manageTokens();

			if (status === 0) {
				const response = await axios.get(
					`${backendUrl}/search/user=${id}`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);
				setSearchStatus(true);
				setUserData([response.data]);
			} else if (status === 1) {
				const response = await axios.get(
					`${backendUrl}/search/edit/user=${id}`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);
				setSearchStatus(true);
				setUserData([response.data]);
			}
		} catch (error) {
			setSearchStatus(true); //display 'user not found'
			console.error("Error fetching data:", error);
		}
	};

	const getDetails = async (loanAcNo) => {
		try {
			const accessToken = await manageTokens();

			const response = await axios.get(
				`${backendUrl}/search/user/info=${loanAcNo}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			console.log(response.data);
			setLoanData([response.data]);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const getUserInfo = async (id) => {
		try {
			const accessToken = await manageTokens();

			const response = await axios.get(
				`${backendUrl}/create/new/loan=${id}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			console.log(response.data);
			setLoanData([response.data]);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};
	//animate button color
	useEffect(() => {
		if (color === "bg-gradient-diagonal") {
			const timeoutId = setTimeout(() => {
				setColor("bg-slate-400");
			}, 200);

			return () => clearTimeout(timeoutId);
		}
	}, [color]);

	// //log response data
	// useEffect(() => {
	// 	console.log(userData);
	// }, [userData]);

	//perform tab change
	const handleTabChange = (tab) => {
		setUserData([]);
		setSearchStatus(false);
		setValid(false);
		setActiveTab(tab);
	};

	const handleAdharSearchInput = (event) => {
		setUserData([]);
		setSearchStatus(false);
		const value = event.target.value;
		const cleanValue = value.replace(/[^0-9]/g, "");
		let formattedValue = cleanValue.replace(
			/(\d{4})(\d{0,4})(\d{0,4})/,
			(match, p1, p2, p3) => {
				let formatted = p1;
				if (p2) {
					formatted += `-${p2}`;
				}
				if (p3) {
					formatted += `-${p3}`;
				}
				return formatted;
			}
		);
		event.target.value = formattedValue;
		setAdharInputValue(formattedValue);
		if (cleanValue.length === 12) {
			setValid(true);
		} else {
			setValid(false);
		}
	};

	//perform search
	const handleAdharSubmit = async (e) => {
		e.preventDefault();
		setColor("bg-gradient-diagonal");
		const id = adharInputValue.replace(/-/g, "");
		await searchUsers(id, 0);
	};

	//search for edit
	const handleAdminSearch = async () => {
		setColor("bg-gradient-diagonal");
		const id = adharInputValue.replace(/-/g, "");
		await searchUsers(id, 1);
	};

	const openEditor = async (loanAcNo) => {
		await getDetails(loanAcNo);
		setIsModalOpen(true);
	};

	const openAddModel = async () => {
		const id = adharInputValue.replace(/-/g, "");
		await getUserInfo(id);
		setIsModalOpen(true);
	};

	const closeEditor = () => {
		setIsModalOpen(false);
		setShouldRefetchData(true);
	};
	const addNewLoan = () => {
		setAddModel(true);
	};

	const closeAddModel = () => {
		setAddModel(false);
		setShouldRefetchData(true);
	};

	useEffect(() => {
		if (shouldRefetchData) {
			handleAdminSearch();
			setShouldRefetchData(false);
		}
	}, [shouldRefetchData]);

	const handleUpload = () => {
		history("/upload");
	};

	return (
		
		
		<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
  <NavBar />
  <div style={{ flex: 1,backgroundColor: 'white',marginBottom: '90px' }}>
		<div>
			<div >
			<div className="flex mb-4">
      <button
        className={`flex-1 py-2 px-4 text-white lg:text-xl font-bold hover:scale-95 focus:outline-none transition-transform duration-300 cursor-pointer ${
          activeTab === "search"
            ? "bg-gradient-diagonal"
            : "bg-gray-200"
        }`}
        onClick={() => handleTabChange("search")}
      >
        Search
      </button>
      <button
        className={`flex-1 py-2 px-4 text-white lg:text-xl font-bold hover:scale-95 focus:outline-none transition-transform duration-300 cursor-pointer ${
          activeTab === "edit"
            ? "bg-gradient-diagonal"
            : "bg-gray-200"
        }`}
        onClick={() => handleTabChange("edit")}
      >
        Modify
      </button>
      <button
        className={`flex-1 py-2 px-4 text-white lg:text-xl font-bold hover:scale-95 focus:outline-none transition-transform duration-300 cursor-pointer ${
          activeTab === "upload"
            ? "bg-gradient-diagonal"
            : "bg-gray-200 text-black"
        }`}
        onClick={() => handleTabChange("upload")}
      >
        Import
      </button>
    </div>
	
				<div className="rounded-lg w-full justify-center items-center flex">
					{activeTab === "search" && (
						<div className="lg:w-3/4  md:w-3/4 w-10/12 mt-6">
							<label
								htmlFor="adharSearch"
								className="px-1 block text-black font-medium"
							>
								Enter the Aadhar No:
							</label>
							<div className="mt-2 w-10/12">
								<input
									type="text"
									onChange={handleAdharSearchInput}
									inputMode="numeric"
									id="adharSearch"
									autoComplete="off"
									maxLength={14}
									className="w-full p-4 rounded-2xl border-2 text-primary text-sm bg-white border-purple-200 focus:outline-none focus:border-purple-400"
									placeholder="Search..."
									onSubmit={() => handleAdharSubmit()}
								/>

								{isValid && (
									<button
										type="submit"
										onClick={handleAdharSubmit}
										className="my-6 bg-gradient-diagonal text-white py-3 px-10 font-semibold rounded-2xl hover:scale-95 focus:outline-none transition-transform duration-300"
									>
										Search
									</button>
								)}
							</div>

							{searchStatus ? (
								userData && userData.length > 0 ? (
									<div>
									<div className="px-1 block text-black font-medium my-4">
										Details 
										</div>
										<InfoCard
											Name={userData[0].Name}
											FatherName={userData[0].FathNam}
											id={userData[0].CustID}
										/>

										<div className="overflow-y-auto lg:max-h-[300px] md:max-h-[300px] max-h-[320px]">
											{userData[0].LoanReg.map(
												(loan, index) => (
													<Card
														key={index}
														loanType={
															loan.LoanType
														}
														amount={
															loan.LoanAmt
														}
														startDateStr={
															loan.LoanDate
														}
														EMI={loan.EmiRate}
														loanBalance={
															loan.LoanBaL
														}
														endDateStr={
															loan.LoanDueDate
														}
														dueAmt={loan.DueAmt}
														dueFromDateStr={
															loan.DueFromDt
														}
														remarks={
															loan.LoanMark
														}
													/>
												)
											)}
										</div>
									</div>
								) : (
									<div className="items-center justify-center  w-full flex mt-8">
										<p className="text-black">
											User not found
										</p>
									</div>
								)
							) : null}
						</div>
					)}
					{activeTab === "edit" && (
						<div className="lg:w-3/4  md:w-3/4 w-10/12 mt-6">
							<label
								htmlFor="adharSearch"
								className="px-1 block text-black font-medium"
							>
								Enter the Aadhar No:
							</label>
							<div className="mt-2 w-10/12">
								<input
									type="text"
									onChange={handleAdharSearchInput}
									inputMode="numeric"
									id="adharSearch"
									autoComplete="off"
									maxLength={14}
									className="w-full p-4 rounded-2xl border-2 text-primary text-sm bg-white border-purple-200 focus:outline-none focus:border-purple-400"
									placeholder="Search..."
									onSubmit={() => handleAdminSearch()}
								/>

								{isValid && (
									<button
										type="submit"
										onClick={handleAdminSearch}
										className="my-6 bg-gradient-diagonal text-white py-3 px-10 font-semibold rounded-2xl hover:scale-95 focus:outline-none transition-transform duration-300"
									>
										Search
									</button>
								)}
								
							</div>
							
							
							{searchStatus ? (
								userData && userData.length > 0 ? (
									
									<div>
							
								
							
										<InfoCard
											Name={userData[0].Name}
											FatherName={userData[0].FathNam}
											id={userData[0].CustID}
										/>
										<div className="overflow-y-auto lg:max-h-[300px] md:max-h-[300px] max-h-[320px]">
{userData[0].LoanReg.map(
												(loan, index) => (
													<Card
														key={index}
														loanType={
															loan.LoanType
														}
														amount={
															loan.LoanAmt
														}
														startDateStr={
															loan.LoanDate
														}
														EMI={loan.EmiRate}
														loanBalance={
															loan.LoanBaL
														}
														endDateStr={
															loan.LoanDueDate
														}
														dueAmt={loan.DueAmt}
														dueFromDateStr={
															loan.DueFromDt
														}
														remarks={
															loan.LoanMark
														}
														onClick={() =>
															openEditor(
																loan.LoanAcNo
															)
														}
													/>
												)
											)}
											{isModalOpen && (
												<Edit
													isOpen={isModalOpen}
													onClose={closeEditor}
													loanData={loanData}
												/>
											)}
										</div>
										<div className="flex justify-center">
											<button
												type="submit"
												onClick={openAddModel}
												className="my-6 bg-gradient-diagonal text-white py-3 px-10 font-semibold rounded-2xl hover:scale-95 focus:outline-none transition-transform duration-300"
											>
												Add new loan
											</button>
										</div>
										{isModalOpen && (
											<Edit
												isOpen={isModalOpen}
												onClose={closeEditor}
												loanData={loanData}
											/>
										)}
									</div>
								) : (
									<div className="items-center justify-center  w-full flex mt-8">
										{addModel && (
											<Add
												isOpen={addModel}
												onClose={closeAddModel}
												adhar={adharInputValue}
											/>
										)}
										<button
											type="submit"
											onClick={addNewLoan}
											className="my-6 bg-gradient-diagonal text-white py-3 px-10 font-semibold rounded-2xl hover:scale-95 focus:outline-none transition-transform duration-300"
										>
											Add new loan
										</button>
									</div>
								)
							) : null}
						</div>
					)}
					{activeTab === "upload" && (
						<div className="w-full">
							<Upload />
						</div>
					)}
					
				</div>
				
			</div>
			</div>
			
		</div>
		
		<Footer />
		
	</div>
	
);
};

export default Home;