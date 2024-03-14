import axios from "axios";

export const sendEther = async (data: any) => {
  try {
    const response = await axios.post("/api/sendEth", data);
    return response.data;
  } catch (error) {
    console.error("this is the error from services", error);
    throw error;
  }
};
