import axios from 'axios';
const API_URL = `${import.meta.env.VITE_API_URL}/api/messages`;

export const getPrivateMessages = async (roomId) => {
	const res = await axios.get(`${API_URL}/private/${roomId}`);
	return res.data;
};

export const sendPrivateMessage = async ({
	roomId,
	sender,
	receiver,
	text,
}) => {
	const res = await axios.post(`${API_URL}/private`, {
		roomId,
		sender,
		receiver,
		text,
	});
	return res.data;
};
