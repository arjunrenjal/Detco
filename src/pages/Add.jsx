import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import manageTokens from "../services/tokenManager";

const Add = ({ isOpen, onClose, adhar }) => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const [saving, setSaving] = useState(false);
	const [isValid, setValid] = useState(false);
	const [formData, setFormData] = useState({
		adhar: adhar,
		loanAccNo: "",
		name: "",
		fatherName: "",
		loanType: "",
		loanAmount: "",
		loanFromDate: "",
		emi: "",
		loanBalance: "",
		lastDueDate: "",
		dueAmount: "",
		dueFromDate: "",
		remark: "-",
		loanStatus: "0",
	});
	const [selectedOption, setSelectedOption] = useState({
		loanStatus: "0",
		loanType: "",
	});

	const handleAdharSearchInput = (event) => {
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
		formData.adhar = formattedValue;
		if (cleanValue.length === 12) {
			setValid(true);
		} else {
			setValid(false);
		}
	};

	const handleLoanAccNoChange = (e) => {
		const value = e.target.value;
		const cleanValue = value.replace(/[^0-9]/g, "");
		e.target.value = cleanValue;
		setFormData((prevFormData) => ({
			...prevFormData,
			loanAccNo: cleanValue,
		}));
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));
	};

	const handleDateChange = (e) => {
		const { name, value } = e.target;

		if (name === "loanFromDate") {
			if (
				(!formData.dueFromDate || value < formData.dueFromDate) &&
				(!formData.lastDueDate || value < formData.lastDueDate)
			) {
				setFormData((prevFormData) => ({
					...prevFormData,
					loanFromDate: value,
				}));
			} else {
				setFormData((prevFormData) => ({
					...prevFormData,
					dueFromDate: "",
				}));
			}
		} else if (name === "dueFromDate") {
			if (
				(!formData.loanFromDate || value > formData.loanFromDate) &&
				(!formData.lastDueDate || value < formData.lastDueDate)
			) {
				setFormData((prevFormData) => ({
					...prevFormData,
					dueFromDate: value,
				}));
			} else {
				setFormData((prevFormData) => ({
					...prevFormData,
					dueFromDate: "",
				}));
			}
		} else if (name === "lastDueDate") {
			if (
				(!formData.loanFromDate || value > formData.loanFromDate) &&
				(!formData.dueFromDate || value > formData.dueFromDate)
			) {
				setFormData((prevFormData) => ({
					...prevFormData,
					lastDueDate: value,
				}));
			} else {
				setFormData((prevFormData) => ({
					...prevFormData,
					dueFromDate: "",
				}));
			}
		}
	};

	const handleSelectChange = (e) => {
		const value = e.target.value;
		const name = e.target.name;

		setSelectedOption(value);

		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));
	};

	const addUser = async () => {
		try {
			const accessToken = await manageTokens();
			const parsedFormData = {
				...formData,
				adhar: formData.adhar.replace(/-/g, ""),
				loanFromDate: new Date(formData.loanFromDate).toISOString(),
				lastDueDate: new Date(formData.lastDueDate).toISOString(),
				dueFromDate: new Date(formData.dueFromDate).toISOString(),
				loanAmount: parseFloat(formData.loanAmount),
				emi: parseFloat(formData.emi),
				loanBalance: parseFloat(formData.loanBalance),
				dueAmount: parseFloat(formData.dueAmount),
				loanStatus: parseInt(formData.loanStatus),
			};

			const response = await axios.post(
				`${backendUrl}/create/user`,
				parsedFormData,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			console.log(response.data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const handleSubmit = async (e) => {
		if (!isValid) {
			formData.adhar = formData.adhar.replace(/-/g, "");
			e.preventDefault();
			setSaving(true);
			await addUser();
			console.log("Form data on close:", formData);
			onClose();
		} else {
			e.preventDefault();
			alert("Please fill all the fields");
		}
	};
	return (
		<div
			className={`fixed inset-0 ${
				isOpen ? "flex" : "hidden"
			} items-center justify-center z-50`}
		>
			<div className="fixed inset-0 bg-black opacity-50"></div>
			<div className="bg-white mt-10 w-5/6 md:w-4/5 lg:w-6/12 h-[550px] md:h-[600px] lg:h-[650px] rounded-2xl relative">
				<button
					className="absolute top-4 right-4 font-semibold text-black hover:scale-95 focus:outline-none transition-transform duration-300"
					onClick={onClose}
				>
					close
				</button>
				<div className="px-8 py-4 flex-1 mt-10 h-[500px] lg:h-[550px] md:h-[550px] overflow-y-auto">
					<form onSubmit={handleSubmit}>
						<div className="md:flex md:space-x-4">
							{/* Input field for 'Adhar' */}
							<div className="mb-2 md:w-1/2">
								<label
									htmlFor="adhar"
									className="block text-sm font-medium text-black"
								>
									Aadhar Number
								</label>
								<input
									type="text"
									name="adhar"
									inputMode="numeric"
									required="required"
									autoComplete="off"
									maxLength={14}
									readOnly={true}
									value={formData.adhar}
									onChange={handleAdharSearchInput}
									placeholder="Adhar Number"
									className="w-full mt-1 p-4 rounded-2xl border-2 text-primary text-sm bg-white border-purple-200 focus:outline-none focus:border-purple-400"
								/>
							</div>
							{/* Input field for 'Loan Acc No' */}
							<div className="mb-2 md:w-1/2">
								<label
									htmlFor="loanAccNo"
									className="block text-sm font-medium text-black"
								>
									Loan Account Number
								</label>
								<input
									type="text"
									name="loanAccNo"
									required="required"
									maxLength={20}
									autoComplete="off"
									value={formData.loanAccNo}
									onChange={handleLoanAccNoChange}
									placeholder="Loan Acc Number"
									className="w-full mt-1 p-4 rounded-2xl border-2 text-primary text-sm bg-white border-purple-200 focus:outline-none focus:border-purple-400"
								/>
							</div>
						</div>
						<div className="md:flex md:space-x-4">
							{/* Input field for 'Name' */}
							<div className="mb-2 md:w-1/2">
								<label
									htmlFor="name"
									className="block text-sm font-medium text-black"
								>
									Name
								</label>
								<input
									type="text"
									name="name"
									required="required"
									autoComplete="off"
									value={formData.name}
									onChange={handleInputChange}
									placeholder="Name"
									className="w-full mt-1 p-4 rounded-2xl border-2 text-primary text-sm bg-white border-purple-200 focus:outline-none focus:border-purple-400"
								/>
							</div>
							{/* Input field for 'Father Name' */}
							<div className="mb-2 md:w-1/2">
								<label
									htmlFor="fatherName"
									className="block text-sm font-medium text-black"
								>
									Father Name
								</label>
								<input
									type="text"
									name="fatherName"
									required="required"
									autoComplete="off"
									value={formData.fatherName}
									onChange={handleInputChange}
									placeholder="Father Name"
									className="w-full mt-1 p-4 rounded-2xl border-2 text-primary text-sm bg-white border-purple-200 focus:outline-none focus:border-purple-400"
								/>
							</div>
						</div>

						<div className="md:flex md:space-x-4">
							{/* Input field for 'Loan Type' */}
							<div className="mb-2  md:w-1/2">
								<label
									htmlFor="loanType"
									className="block text-sm font-medium text-black"
								>
									Loan Type
								</label>
								<select
									id="loanType"
									name="loanType"
									required="required"
									value={selectedOption.loanType}
									onChange={handleSelectChange}
									className="w-full mt-1 p-4 rounded-2xl border-2 text-primary bg-white border-purple-200 focus:outline-none focus:border-purple-400 cursor-pointer"
								>
									<option value="">Select an option</option>
									<option value="personal">
										Demand/Personal
									</option>
									<option value="Home">Home</option>
									<option value="Mortgage">Mortgage</option>
									<option value="Pledge">Pledge</option>
									<option value="Surity">Surity</option>
									<option value="Vehicle">Vehicle</option>
								</select>
							</div>
							{/* Input field for 'Amount' */}
							<div className="mb-2 md:w-1/2">
								<label
									htmlFor="loanAmount"
									className="block text-sm font-medium text-black"
								>
									Loan Amount
								</label>
								<input
									type="text"
									name="loanAmount"
									autoComplete="off"
									required="required"
									value={formData.loanAmount}
									onChange={handleInputChange}
									placeholder="Loan Amount"
									className="w-full mt-1 p-4 rounded-2xl border-2 text-primary text-sm bg-white border-purple-200 focus:outline-none focus:border-purple-400"
								/>
							</div>
						</div>
						<div className="md:flex md:space-x-4">
							{/* Input field for 'Loan From Date' */}
							<div className="mb-2 md:w-1/2">
								<label
									htmlFor="loanFromDate"
									className="block text-sm font-medium text-black"
								>
									Loan From Date
								</label>
								<input
									type="date"
									name="loanFromDate"
									required="required"
									autoComplete="off"
									value={formData.loanFromDate}
									onChange={handleDateChange}
									placeholder="Loan From Date"
									className="w-full mt-1 p-4 rounded-2xl border-2 text-primary text-sm bg-white border-purple-200 focus:outline-none focus:border-purple-400"
								/>
							</div>
							{/* Input field for 'EMI' */}
							<div className="mb-2 md:w-1/2">
								<label
									htmlFor="emi"
									className="block text-sm font-medium text-black"
								>
									EMI
								</label>
								<input
									type="text"
									name="emi"
									required="required"
									autoComplete="off"
									value={formData.emi}
									onChange={handleInputChange}
									placeholder="EMI Amount"
									className="w-full mt-1 p-4 rounded-2xl border-2 text-primary text-sm bg-white border-purple-200 focus:outline-none focus:border-purple-400"
								/>
							</div>
						</div>
						<div className="md:flex md:space-x-4">
							{/* Input field for 'Loan Balance' */}
							<div className="mb-2 md:w-1/2">
								<label
									htmlFor="loanBalance"
									className="block text-sm font-medium text-black"
								>
									Current Balance
								</label>
								<input
									type="text"
									name="loanBalance"
									autoComplete="off"
									required="required"
									value={formData.loanBalance}
									onChange={handleInputChange}
									placeholder="Current Balance"
									className="w-full mt-1 p-4 rounded-2xl border-2 text-primary text-sm bg-white border-purple-200 focus:outline-none focus:border-purple-400"
								/>
							</div>
							{/* Input field for 'Last Due Date' */}
							<div className="mb-2 md:w-1/2">
								<label
									htmlFor="lastDueDate"
									className="block text-sm font-medium text-black"
								>
									Last Due Date
								</label>
								<input
									type="date"
									name="lastDueDate"
									autoComplete="off"
									required="required"
									value={formData.lastDueDate}
									onChange={handleDateChange}
									placeholder="Last Due Date"
									className="w-full mt-1 p-4 rounded-2xl border-2 text-primary text-sm bg-white border-purple-200 focus:outline-none focus:border-purple-400"
								/>
							</div>
						</div>
						<div className="md:flex md:space-x-4">
							{/* Input field for 'Due Amount' */}
							<div className="mb-2 md:w-1/2">
								<label
									htmlFor="dueAmount"
									className="block text-sm font-medium text-black"
								>
									Due Amount
								</label>
								<input
									type="text"
									name="dueAmount"
									autoComplete="off"
									required="required"
									value={formData.dueAmount}
									onChange={handleInputChange}
									placeholder="Due Amount"
									className="w-full mt-1 p-4 rounded-2xl border-2 text-primary text-sm bg-white border-purple-200 focus:outline-none focus:border-purple-400"
								/>
							</div>
							{/* Input field for 'Last Due Date' */}
							<div className="mb-2  md:w-1/2">
								<label
									htmlFor="dueFromDate"
									className="block text-sm font-medium text-black"
								>
									Due From Date
								</label>
								<input
									type="date"
									name="dueFromDate"
									autoComplete="off"
									required="required"
									value={formData.dueFromDate}
									onChange={handleDateChange}
									placeholder="Due From Date"
									className="w-full mt-1 p-4 rounded-2xl border-2 text-primary text-sm bg-white border-purple-200 focus:outline-none focus:border-purple-400"
								/>
							</div>
						</div>
						<div className="md:flex md:space-x-4">
							{/* Input field for 'Remark' */}
							<div className="mb-2 md:w-1/2">
								<label
									htmlFor="remark"
									className="block text-sm font-medium text-black"
								>
									Remark
								</label>
								<input
									type="text"
									name="remark"
									autoComplete="off"
									value={formData.remark}
									onChange={handleInputChange}
									placeholder="Remarks"
									className="w-full mt-1 p-4 rounded-2xl border-2 text-primary text-sm bg-white border-purple-200 focus:outline-none focus:border-purple-400"
								/>
							</div>
							{/* Input field for 'Loan Status' */}
							<div className="mb-2  md:w-1/2">
								<label
									htmlFor="loanStatus"
									className="block text-sm font-medium text-black"
								>
									Loan Status
								</label>
								<select
									id="loanStatus"
									name="loanStatus"
									required="required"
									value={selectedOption.loanStatus}
									onChange={handleSelectChange}
									className="w-full mt-1 p-4 rounded-2xl border-2 text-primary bg-white border-purple-200 focus:outline-none focus:border-purple-400 cursor-pointer"
								>
									<option value="">Select Loan Status</option>
									<option value="0">Active</option>
									<option value="1">Closed</option>
								</select>
							</div>
						</div>
						<div className="text-center">
							<button
								type="submit"
								className=" mt-5 bg-gradient-diagonal text-white py-3 px-8 lg:px-10 font-semibold rounded-2xl hover:scale-95 focus:outline-none transition-transform duration-300"
							>
								{saving ? "Saving" : "Save"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};
//props validation
Add.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	adhar: PropTypes.string.isRequired,
};
export default Add;
