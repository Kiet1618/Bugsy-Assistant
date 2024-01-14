import {
	OpenAIClient,
	AzureKeyCredential,
	ChatRequestMessage,
} from "@azure/openai";

import axios from "axios";
import FormData from "form-data";

const azureClient = new OpenAIClient(
	process.env.REACT_APP_OPENAI_URL,
	new AzureKeyCredential(process.env.REACT_APP_OPENAI_KEY)
);

export const models = ["GPT35TURBO", "GPT35TURBO16K", "ADA"];

export const sendMessage = async (message, finetune, pdf) => {
	const model = pdf ? models[1] : models[0];

	const azurePrompt = [
		{
			role: "system",
			content: finetune
				? "Reply with markdown format: " + finetune
				: "Reply with markdown format: You are assistant, your name is Bugsy",
		},
		{ role: "user", content: message },
	];

	try {
		const result = await azureClient.getChatCompletions(model, azurePrompt);
		return result.choices[0].message?.content || "Sorry, something went wrong.";
	} catch (error) {
		console.log(error);
		return "Sorry, something went wrong.";
	}
};

export const pdf2text = async (data) => {
	const options = {
		method: "POST",
		url: "https://pdf-to-text-converter.p.rapidapi.com/api/pdf-to-text/convert",
		headers: {
			"X-RapidAPI-Key": process.env.REACT_APP_PDF2TEXT_API_KEY,
			"X-RapidAPI-Host": "pdf-to-text-converter.p.rapidapi.com",
			"Content-Type": "multipart/form-data",
		},
		data: data,
	};

	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error(error);
	}
};

export const image2text = async (data) => {
	const options = {
		method: "POST",
		url: "https://ocr-image-to-text-multilingual.p.rapidapi.com/imagetotext",
		headers: {
			"X-RapidAPI-Key": process.env.REACT_APP_PDF2TEXT_API_KEY,
			"X-RapidAPI-Host": "ocr-image-to-text-multilingual.p.rapidapi.com",
			"Content-Type": "multipart/form-data",
		},
		data: data,
	};

	try {
		const response = await axios.request(options);
		return response.data.text;
	} catch (error) {
		console.error(error);
	}
};
