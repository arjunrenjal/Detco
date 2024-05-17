import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import NavBar from "../components/NavBar";
import axios from "axios";
import manageTokens from "../services/tokenManager";

const Upload = () => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const [file, setFile] = useState(null);
	const [fileName, setFileName] = useState("");
	const [uploadProgress, setUploadProgress] = useState({
		started: false,
		progress: 0,
	});
	const [message, setMessage] = useState("No file selected");

	const onDrop = useCallback((acceptedFile) => {
		const fileName = acceptedFile[0].name;
		if (
			fileName.endsWith(".xlsx") ||
			fileName.endsWith(".xls") ||
			fileName.endsWith(".csv")
		) {
			setFile(acceptedFile);
			setMessage("");
			setFileName(acceptedFile[0].name);
			console.log(acceptedFile);
		} else {
			setMessage("Invalid file type");
			setFileName("");
			setFile(null);
		}
	}, []);

	const bulkUpload = async () => {
		try {
			const accessToken = await manageTokens();
			const formData = new FormData();
			formData.append("file", file[0]);
			const response = await axios.post(
				`${backendUrl}/create/users`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${accessToken}`,
					},
					onUploadProgress: (progressEvent) => {
						console.log(progressEvent);
						setUploadProgress((prevState) => {
							return {
								...prevState,
								progress: progressEvent.progress * 100,
							};
						});
					},
				}
			);
			setUploadProgress({ started: false, progress: 0 });
			setFileName("");
			setFile(null);
			setMessage("");
			console.log(response.data);
		} catch (error) {
			setUploadProgress({ started: false, progress: 0 });
			setFileName("");
			setFile(null);
			setMessage("");
			console.error("Error fetching data:", error);
		}
	};

	const uploadFile = async () => {
		if (!file) {
			setMessage("No file selected");
			return;
		}
		setMessage("Uploading...");
		setUploadProgress((prevState) => {
			return { ...prevState, started: true };
		});
		await bulkUpload();
	};
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		maxFiles: 1,
		accept: {
			"application/vnd.ms-excel": [".xls", ".xlsx", ".csv"],
		},
	});

	return (
		<div>
		 <div className="mt-10 px-10 flex flex-col items-center">
  <p className="text-black">
    Upload your documents here. Click the link below to download a sample Excel file, or drag and drop your file into the designated area.
  </p>
  <a
    href="/path/to/sample-excel-file.xlsx"
    className="text-blue font-semibold underline hover:text-primary-dark focus:outline-none mt-4"
  >
    Download Sample Excel File
  </a>
</div>

		  <div className="justify-center items-center flex">
			<div
			  {...getRootProps()}
			  className={`cursor-pointer ${
				isDragActive ? "bg-gray-300" : "bg-gray-100"
			  } lg:w-[500px] md:w-[500px] w-[250px] lg:h-[250px] md:h-[250px] h-[250px] rounded-xl mt-4 flex justify-center items-center`}
			>
			  <input {...getInputProps()} />
			  <p className="text-gray-600 text-sm text-center">
				{isDragActive
				  ? "Drop the documents here"
				  : "Click to Upload or Drag and drop the document."}
			  </p>
			</div>
		  </div>
		  <div className="px-8 flex flex-col items-center justify-center">
  <p className="text-black text-start">{fileName}</p>
  <div className="mt-4">
    <button
      onClick={uploadFile}
      className="bg-gradient-diagonal text-white py-3 px-8 lg:px-10 font-semibold rounded-2xl hover:scale-95 focus:outline-none transition-transform duration-300"
    >
      Upload
    </button>
  </div>
</div>

		  <div className="flex justify-center items-center mt-4">
			{uploadProgress.started && (
			  <progress
				className="custom-progress"
				max={100}
				value={uploadProgress.progress}
			  ></progress>
			)}
		  </div>
		  <div className="flex justify-center items-center">
			{message && <span className="text-black">{message}</span>}
		  </div>
		</div>
	  );
			}
	  export default Upload;
	  