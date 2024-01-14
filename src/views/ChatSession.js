import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getSession, pushMessage, pushSession } from "../storage/local";
import { image2text, pdf2text, sendMessage } from "../helpers/chat";
import FormData from "form-data";

const ChatSession = () => {
	const { id } = useParams();
	const [chatHistory, setChatHistory] = useState(false);
	const [prompt, setPrompt] = useState("");
	const [sending, setSending] = useState(false);
	const [file, setFile] = useState(null);
	const [image, setImage] = useState(null);
	const [replyTo, setReplyTo] = useState("");

	useEffect(() => {
		const fetchData = async () => {
			const data = await getSession(id);
			setChatHistory(data);
		};

		fetchData();
	}, [id]);

	function handleChangePdf(event) {
		setImage(null);
		setReplyTo("");
		setFile(event.target.files[0]);
	}
	function handleChangeImage(event) {
		setFile(null);
		setReplyTo("");
		setImage(event.target.files[0]);
	}

	const send = async () => {
		setSending(true);
		let request = prompt;
		let uploaded_file = file;
		let uploaded_image = image;
		let reply = replyTo;
		setPrompt("");
		setFile(null);
		setImage(null);
		setReplyTo("");
		let temp = [...chatHistory.list, { request, response: "..." }];
		setChatHistory({ ...chatHistory, list: temp });

		let finetune;
		let pdf = false;
		if (uploaded_file) {
			let data = new FormData();
			data.append("file", uploaded_file);
			finetune = await pdf2text(data);
			pdf = true;
		} else if (uploaded_image) {
			let data = new FormData();
			data.append("language", "English");
			data.append("file", uploaded_image);
			finetune = await image2text(data);
		} else if (reply) {
			finetune = reply;
		}

		const response = await sendMessage(request, finetune, pdf);

		await pushMessage(id, { request, response }).then((res) => {
			setChatHistory(res);
		});
		setPrompt("");
		setSending(false);
	};

	return (
		<div className="h-screen w-full flex flex-col">
			<div className="relative top-0 w-full h-[80vh] container pt-20 ">
				<div className="flex h-full flex-col space-y-5 px-5 overflow-y-auto">
					{chatHistory &&
						chatHistory.list.map((item, index) => {
							return (
								<div key={index} className="grid w-full space-y-5">
									<div className="w-full flex justify-end">
										<div className="flex w-10/12 justify-end ">
											<div className="w-fit bg-primary-300 rounded-lg p-2 h-min justify-end">
												<Markdown rehypePlugins={[rehypeRaw, remarkGfm]}>
													{item.request}
												</Markdown>
											</div>
										</div>
									</div>
									<div className="w-full flex justify-start ">
										<div className="flex w-10/12 justify-start group place-items-center">
											<div className="w-fit bg-secondary-300 rounded-lg p-2 h-min justify-start group">
												<Markdown rehypePlugins={[rehypeRaw, remarkGfm]}>
													{item.response}
												</Markdown>
											</div>
											<div className="justify-end invisible group-hover:visible mx-3">
												<button
													className="text-sm text-gray-400 hover:text-gray-600"
													onClick={() => {
														setReplyTo(item.response);
														setFile(null);
														setImage(null);
													}}
												>
													Reply
												</button>
											</div>
										</div>
									</div>
								</div>
							);
						})}
				</div>
			</div>

			<div className="mt-3 bottom-10 h-[15vh] container w-full flex justify-center items-center">
				<div className="mt-auto w-full mx-5 flex justify-center items-center">
					<div className="w-full relative border-2 border-black rounded-md p-2 justify-between">
						<textarea
							type="text"
							className="w-full focus:outline-none"
							onInput={(e) => setPrompt(e.target.value)}
							value={prompt}
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
						<div className="flex">
							<div className="flex mt-5 justify-between w-full">
								<div className="flex place-items-center space-x-2">
									<button className="">
										<input
											type="file"
											onChange={handleChangePdf}
											accept=".pdf"
											id="custom-input"
											className="hidden"
										/>
										<label
											for="custom-input"
											className="block text-black mr-4 py-2 px-4
										rounded-md border-0 text-sm font-semibold bg-primary-300
								 		cursor-pointer"
										>
											{file ? file.name : "Upload pdf"}
										</label>
									</button>
									<button className="">
										<input
											type="file"
											onChange={handleChangeImage}
											accept=".png, .jpg, .jpeg"
											id="custom-input2"
											className="hidden"
										/>
										<label
											for="custom-input2"
											className="block text-black mr-4 py-2 px-4
										rounded-md border-0 text-sm font-semibold bg-secondary-700
								 		cursor-pointer"
										>
											{image ? image.name : "Upload image"}
										</label>
									</button>
									<p className="text-sm text-gray-400 w-fit">
										Reply to: {replyTo ? replyTo.slice(0, 50) + "..." : ""}
									</p>
								</div>
								<button
									className="px-3 py-1 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
									onClick={() => send()}
									disabled={prompt === "" || sending}
								>
									Ask
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatSession;
