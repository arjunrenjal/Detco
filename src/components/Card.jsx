import PropTypes from "prop-types";

const Card = ({
	loanType,
	amount,
	startDateStr,
	EMI,
	loanBalance,
	endDateStr,
	dueAmt,
	dueFromDateStr,
	remarks,
	onClick,
}) => {
	const formatStartDate = new Date(startDateStr);
	let day = formatStartDate.getDate();
	let month = formatStartDate.getMonth() + 1;
	let year = formatStartDate.getFullYear();
	// Format day, month, and year as "dd-mm-yyyy"
	const startDate = `${day < 10 ? "0" : ""}${day}-${
		month < 10 ? "0" : ""
	}${month}-${year}`;

	const formatEndDate = new Date(endDateStr);
	day = formatEndDate.getDate();
	month = formatEndDate.getMonth() + 1;
	year = formatEndDate.getFullYear();
	const endDate = `${day < 10 ? "0" : ""}${day}-${
		month < 10 ? "0" : ""
	}${month}-${year}`;

	const formatDueFromDate = new Date(dueFromDateStr);
	day = formatDueFromDate.getDate();
	month = formatDueFromDate.getMonth() + 1;
	year = formatDueFromDate.getFullYear();
	const dueFromDate = `${day < 10 ? "0" : ""}${day}-${
		month < 10 ? "0" : ""
	}${month}-${year}`;

	return (
		<div
			className="mt-5 w-full p-4 rounded-2xl border-2 text-primary text-sm "
			onClick={onClick}
		>
			<div className="space-y-1">
				<div className="flex justify-between">
					<span className="font-medium text-black">Loan Type:</span>
					<span className="text-black">{loanType}</span>
				</div>
				<div className="flex justify-between">
					<span className="font-medium text-black">Amount:</span>
					<span className="text-black">{amount} Rs</span>
				</div>
				<div className="flex justify-between">
					<span className="font-medium text-black">
						Loan From Date:
					</span>
					<span className="text-black">{startDate}</span>
				</div>
				<div className="flex justify-between">
					<span className="font-medium text-black">EMI:</span>
					<span className="text-black">{EMI} Rs</span>
				</div>
				<div className="flex justify-between">
					<span className="font-medium text-black">
						Current Balance:
					</span>
					<span className="text-black">{loanBalance} Rs</span>
				</div>
				<div className="flex justify-between">
					<span className="font-medium text-black">
						Last Due Date:
					</span>
					<span className="text-black">{endDate}</span>
				</div>
				<div className="flex justify-between">
					<span className="font-medium text-black">Due Amount:</span>
					<span className="text-black">{dueAmt} Rs</span>
				</div>
				<div className="flex justify-between">
					<span className="font-medium text-black">
						Due From Date:
					</span>
					<span className="text-black">{dueFromDate}</span>
				</div>
				<div className="flex justify-between">
					<span className="font-medium text-black">Remark:&nbsp;</span>
					<span className="text-black">{remarks}</span>
				</div>
				
			</div>
		
		</div>
	);
};

Card.propTypes = {
	loanType: PropTypes.string.isRequired,
	amount: PropTypes.number.isRequired,
	startDateStr: PropTypes.string.isRequired,
	EMI: PropTypes.number.isRequired,
	loanBalance: PropTypes.number.isRequired,
	endDateStr: PropTypes.string.isRequired,
	dueAmt: PropTypes.number.isRequired,
	dueFromDateStr: PropTypes.string.isRequired,
	remarks: PropTypes.string.isRequired,
	onClick: PropTypes.func,
};

export default Card;
