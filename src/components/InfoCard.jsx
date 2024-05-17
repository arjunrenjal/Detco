import PropTypes from "prop-types";

const InfoCard = ({ FatherName, Name, id }) => {
	return (
		<div
			className="w-full p-4 rounded-2xl border-2 text-primary text-sm bg-white focus:outline-none focus:border-purple-400"
		>
			<div className="py-1">
				<div>
					<span className="font-medium text-black">ID:</span>
					<span className="text-black px-2">{id}</span>
				</div>
				<div>
					<span className="font-medium text-black">Name:</span>
					<span className="text-black px-2">{Name}</span>
				</div>
				<div>
					<span className="font-medium text-black">Father Name:</span>
					<span className="text-black px-2">{FatherName}</span>
				</div>
			</div>
		</div>
	);
};

InfoCard.propTypes = {
	id: PropTypes.number.isRequired,
	FatherName: PropTypes.string.isRequired,
	Name: PropTypes.string.isRequired,
};

export default InfoCard;
