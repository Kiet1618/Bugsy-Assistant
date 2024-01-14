function getWindow() {
	if (typeof window !== "undefined") return window;
}

const win = getWindow();

export const storeSessions = async (data) => {
	const dataJson = JSON.stringify(data);
	win.localStorage.setItem("sessions", dataJson);
};

export const getAllSessions = async () => {
	const data = win.localStorage.getItem("sessions");
	return JSON.parse(data) || [];
};

export const getSession = async (id) => {
	const data = win.localStorage.getItem("sessions");
	const parsedData = JSON.parse(data);
	const session = parsedData.find((item) => item.id === Number(id));
	return session;
};

export const pushSession = async (data) => {
	const sessions = await getAllSessions();
	const id = sessions[sessions.length - 1]?.id + 1 || 1;
	const newSession = { id, list: [data] };
	await storeSessions([...sessions, newSession]);
	return id;
};

export const pushMessage = async (id, data) => {
	const sessions = await getAllSessions();
	const newSessions = sessions.map((item) => {
		if (item.id === Number(id)) {
			const newItem = {
				...item,
				list: [...item.list, data],
			};
			return newItem;
		}
		return item;
	});
	await storeSessions(newSessions);
	return newSessions.find((item) => item.id === Number(id));
};
