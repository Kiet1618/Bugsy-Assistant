import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSessions, getSession } from "../storage/local";

const Landing = () => {
	const [prompt, setPrompt] = useState("");
	const [sessions, setSessions] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			const data = await getAllSessions();
			setSessions(data);
		};
		fetchData();
	}, []);

	const navigate = useNavigate();
	const joinSession = (id) => {
		if (id) {
			navigate(`/chat/${id}`);
		} else {
			navigate(`/chat/new`, { state: { question: prompt } });
		}
	};

	return (
		<div className="h-screen w-screen flex justify-center">
			<div className="w-full flex flex-col my-auto mx-auto space-y-10">
				<div className="flex flex-col justify-center mx-auto w-1/2 space-y-5">
					<p className="text-center">Ask new question</p>
					<div className="relative border-2 border-black rounded-md p-2 justify-between">
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
									joinSession();
								}
							}}
						/>
						<button
							className="absolute right-1 top-1 py-1 px-3 rounded-lg hover:bg-gray-100"
							onClick={() => joinSession()}
						>
							Ask
						</button>
					</div>
				</div>
				<div className="flex flex-col justify-center mx-auto w-1/2 space-y-5">
					<p className="text-center">Continue previous sessions</p>
					<div className="flex flex-col space-y-2">
						{sessions === null ? (
							<p>Loading...</p>
						) : (
							sessions.map((session) => (
								<button
									className="hover:underline"
									onClick={() => joinSession(session.id)}
								>
									{session.list[0].request}
								</button>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Landing;
