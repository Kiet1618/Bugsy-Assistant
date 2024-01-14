import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatSession from "./views/ChatSession";
import Landing from "./views/Landing";

import Wrapper from "./components/Wrapper";
import NewChat from "./views/NewChat";

function App() {
	const [reload, setReload] = useState(false);

	const refresh = () => {
		setReload(!reload);
	};

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Landing />} />
				<Route
					path="/chat/:id"
					element={<Wrapper reload={reload} children={<ChatSession />} />}
				/>
				<Route
					path="/chat/new"
					element={
						<Wrapper reload={reload} children={<NewChat refresh={refresh} />} />
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
