import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllSessions } from "../storage/local";

const Sidebar = ({ reload }) => {
	const [sessions, setSessions] = useState(null);

	const location = useLocation();

	useEffect(() => {
		const fetchData = async () => {
			const data = await getAllSessions();
			setSessions(data);
		};
		fetchData();
	}, [reload]);

	const navigate = useNavigate();
	const joinSession = (id) => {
		navigate(`/chat/${id}`);
	};

	const getIdFromPath = (path) => {
		const id = path.split("/").pop();
		return Number(id);
	};

	return (
		<div className="w-full h-full bg-primary-700">
			<div className="flex flex-col justify-center mx-auto space-y-5 px-3 py-5">
				{location.pathname === "/chat/new" ? (
					<button className="border bg-secondary-700 text-white rounded-md p-2">
						New Session
					</button>
				) : (
					<button
						className="border border-secondary-700 hover:bg-secondary-700 hover:text-white rounded-md p-2 text-secondary-700"
						onClick={() => navigate("/chat/new")}
					>
						New Session
					</button>
				)}

				{sessions === null ? (
					<p>Loading...</p>
				) : (
					[...sessions].reverse().map((session) => {
						if (getIdFromPath(location.pathname) === session.id) {
							return (
								<button
									className="text-left underline underline-offset-2 text-white"
									onClick={() => joinSession(session.id)}
								>
									{session.list[0].request}
								</button>
							);
						} else {
							return (
								<button
									className="text-left hover:underline text-secondary-700"
									onClick={() => joinSession(session.id)}
								>
									{session.list[0].request}
								</button>
							);
						}
					})
				)}
				<button
					className="absolute bottom-5 border border-secondary-700 hover:bg-secondary-700 hover:text-white rounded-md p-2 text-secondary-700"
					onClick={() => navigate("/")}
				>
					← Home
				</button>
			</div>
		</div>
	);
};

export default Sidebar;
