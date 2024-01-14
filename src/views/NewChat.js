import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendMessage } from "../helpers/chat";
import { pushSession } from "../storage/local";

const NewChat = ({ refresh }) => {
	const { state } = useLocation();
	const [prompt, setPrompt] = useState(state?.question);
	const [sending, setSending] = useState(false);

	const navigate = useNavigate();
	const send = async () => {
		setSending(true);
		let request = prompt;
		setPrompt("");
		const response = await sendMessage(request);

		const newDialog = { request, response };

		const id = await pushSession(newDialog);
		setSending(false);
		refresh();
		navigate(`/chat/${id}`);
	};

	useEffect(() => {
		const fetchData = async () => {
			if (state?.question) {
				await send();
			}
		};
		fetchData();
	}, []);

	return (
		<div className="w-full flex flex-col justify-between h-full relative">
			<div className="w-full overflow-y-auto h-[90%]">
				<div className="flex h-full flex-col space-y-5 px-5"></div>
			</div>

			<div className="h-[10%] w-full flex justify-center items-center">
				<div className="mt-auto w-[80%] h-16 flex justify-center items-center">
					<div className="w-full relative border-2 border-black rounded-md p-2 justify-between">
						<input
							type="text"
							className="w-full focus:outline-none"
							onInput={(e) => setPrompt(e.target.value)}
							onKeyPress={async (e) => {
								let text = e.target.value;
								if (e.key === "Enter") {
									e.stopPropagation();
									e.preventDefault();
									setPrompt(text);
									await send();
								}
							}}
						/>
						{sending ? (
							<div className="absolute right-1 top-1 py-1 px-3 rounded-lg hover:bg-gray-100">
								Loading...
							</div>
						) : (
							<button
								className="absolute right-1 top-1 py-1 px-3 rounded-lg hover:bg-gray-100"
								onClick={() => send()}
							>
								Ask
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewChat;
