import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;

export const loginUser = async (username) => {
	try {
		const response = await axios.post(
			API_URL,
			{ username },
			{ withCredentials: true }
		);
		return response.data;
	} catch (error) {
		console.error('Login error:', error);
		throw error;
	}
};

export const getAllUsers = async () => {
	try {
		const res = await axios.get(API_URL, { withCredentials: true }); // << obavezno
		return res.data;
	} catch (err) {
		console.error('Error:', err);
		throw err;
	}
};
