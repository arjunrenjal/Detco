import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import manageTokens from "../services/tokenManager";

const Edit = ({ isOpen, onClose, loanData }) => {
	const loan = loanData[0];
	const loanReg = loan && loan.LoanReg && loan.LoanReg[0];

	const status = loanReg ? 0 : 1;

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	const initialFormData = loanReg
		? {
				loanAccNo: loanReg.LoanAcNo,
				loanType: loanReg.LoanType,
				loanAmount: loanReg.LoanAmt,
				loanFromDate: formatDate(loanReg.LoanDate),
				emi: loanReg.EmiRate,
				loanBalance: loanReg.LoanBaL,
				lastDueDate: formatDate(loanReg.LoanDueDate),
				dueAmount: loanReg.DueAmt,
				dueFromDate: formatDate(loanReg.DueFromDt),
				loanStatus: loanReg.Rec_State,
				remark: loanReg.LoanMark,
		  }
		: {
				loanAccNo: "",
				loanType: "",
				loanAmount: "",
				loanFromDate: "",
				emi: "",
				loanBalance: "",
				lastDueDate: "",
				dueAmount: "",
				dueFromDate: "",
				loanStatus: "",
				remark: "",
		  };

	const loanAccNo = loanReg ? loanReg.LoanAcNo : "";

	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const [saving, setSaving] = useState(false);

	const [selectedOption, setSelectedOption] = useState(
		loanReg
			? {
					loanType: loanReg.LoanType,
					loanStatus: loanReg.Rec_State,
			  }
			: {
					loanType: "",
					loanStatus: 0,
			  }
	);
	const [editedFields, setEditedFields] = useState({});
	const [formData, setFormData] = useState(initialFormData);

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));
		setEditedFields((prevEditedFields) => ({
			...prevEditedFields,
			[name]: true,
		}));
	};

	const handleSelectChange = (e) => {
		const value = e.target.value;
		const name = e.target.name;

		setSelectedOption(value);

		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));

		setEditedFields((prevEditedFields) => ({
			...prevEditedFields,
			[name]: true,
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

	// const handleLoanAccNoChange = (e) => {
	// 	const value = e.target.value;
	// 	const cleanValue = value.replace(/[^0-9]/g, "");
	// 	e.target.value = cleanValue;
	// 	setFormData((prevFormData) => ({
	// 		...prevFormData,
	// 		loanAccNo: cleanValue,
	// 	}));
	// };

	const updateUserDetails = async (loanAcNo) => {
		try {
			const accessToken = await manageTokens();
			const parsedFormData = {
				...formData,
				loanFromDate: new Date(formData.loanFromDate).toISOString(),
				lastDueDate: new Date(formData.lastDueDate).toISOString(),
				dueFromDate: new Date(formData.dueFromDate).toISOString(),
				loanAmount: parseFloat(formData.loanAmount),
				emi: parseFloat(formData.emi),
				loanBalance: parseFloat(formData.loanBalance),
				dueAmount: parseFloat(formData.dueAmount),
				loanStatus: parseInt(formData.loanStatus),
			};

			const updateFields = {};
			for (const key in parsedFormData) {
				if (editedFields[key]) {
					updateFields[key] = parsedFormData[key];
				}
			}

			const response = await axios.put(
				`${backendUrl}/search/user/info=${loanAcNo}`,
				updateFields,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
				}
			);
			console.log(response.data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const addNewLoan = async (id) => {
		try {
			const accessToken = await manageTokens();
			const parsedFormData = {
				...formData,
				loanFromDate: new Date(formData.loanFromDate).toISOString(),
				lastDueDate: new Date(formData.lastDueDate).toISOString(),
				dueFromDate: new Date(formData.dueFromDate).toISOString(),
				loanAmount: parseFloat(formData.loanAmount),
				emi: parseFloat(formData.emi),
				loanBalance: parseFloat(formData.loanBalance),
				dueAmount: parseFloat(formData.dueAmount),
				loanStatus: parseInt(formData.loanStatus),
			};

			const updateFields = {};
			for (const key in parsedFormData) {
				if (editedFields[key]) {
					updateFields[key] = parsedFormData[key];
				}
			}

			const response = await axios.post(
				`${backendUrl}/create/new/loan=${id}`,
				updateFields,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
				}
			);
			console.log(response.data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);

		if (status === 0) {
			await updateUserDetails(loanAccNo);
		} else {
			await addNewLoan(loan.CustProop);
		}
		console.log("Form data on close:", formData);
		onClose();
	};

	return (
		<div
			className={`fixed inset-0 ${
				isOpen ? "flex" : "hidden"
			} items-center justify-center z-50`}
		>
			<div className="fixed inset-0 bg-black opacity-50"></div>
			<div className="bg-white mt-10 w-5/6 md:w-4/5 lg:w-6/12 h-[550px] md:h-[600px] lg:h-[600px] rounded-2xl relative">
				<div className="relative mb-8 lg:mb-4 md:mb-4 left-8 top-4 flex flex-col md:flex-row">
					
				</div>

				<button
					className="absolute top-4 right-4 font-semibold text-black hover:scale-95 focus:outline-none transition-transform duration-300"
					onClick={onClose}
				>
					Close
				</button>
				<div className="px-8 py-3 flex-1 mt-2 h-[500px] lg:h-[550px] md:h-[550px] overflow-y-auto">
					<form onSubmit={handleSubmit}>
						<div className="md:flex md:space-x-4">
							{/* Input field for 'Loan Acc No' */}
							<div className="mb-2 md:w-full">
								<label
									htmlFor="loanAccNo"
									className="block text-sm font-medium text-gray-700"
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
									contentEditable={false}
									placeholder="Loan Acc Number"
									className="w-full mt-1 p-4 rounded-2xl border-2 text-primary text-sm bg-white border-purple-200 focus:outline-none focus:border-purple-400"
								/>
							</div>
						</div>
						<div className="md:flex md:space-x-4">
							{/* Input field for 'Loan Type' */}
							<div className="mb-2  md:w-1/2">
								<label
									htmlFor="loanType"
									className="block text-sm font-medium text-gray-700"
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
									<option value="Personal">
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
									className="block text-sm font-medium text-gray-700"
								>
									Loan Amount
								</label>
								<input
									type="text"
									name="loanAmount"
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
									className="block text-sm font-medium text-gray-700"
								>
									Loan From Date
								</label>
								<input
									type="date"
									name="loanFromDate"
									required="required"
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
									className="block text-sm font-medium text-gray-700"
								>
									EMI
								</label>
								<input
									type="text"
									name="emi"
									required="required"
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
									className="block text-sm font-medium text-gray-700"
								>
									Current Balance
								</label>
								<input
									type="text"
									name="loanBalance"
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
									className="block text-sm font-medium text-gray-700"
								>
									Last Due Date
								</label>
								<input
									type="date"
									name="lastDueDate"
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
									className="block text-sm font-medium text-gray-700"
								>
									Due Amount
								</label>
								<input
									type="text"
									name="dueAmount"
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
									className="block text-sm font-medium text-gray-700"
								>
									Due From Date
								</label>
								<input
									type="date"
									name="dueFromDate"
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
									className="block text-sm font-medium text-gray-700"
								>
									Remark
								</label>
								<input
									type="text"
									name="remark"
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
									className="block text-sm font-medium text-gray-700"
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
Edit.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	loanData: PropTypes.array,
};

export default Edit;
