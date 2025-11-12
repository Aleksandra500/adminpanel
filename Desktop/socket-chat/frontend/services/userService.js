import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/users`

export const loginUser = async (username) => {
  try {
    const response = await axios.post(API_URL, { username });
    return response.data; 
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};