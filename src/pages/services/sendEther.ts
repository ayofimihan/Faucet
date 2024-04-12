import axios from "axios";
import { Address } from "viem";

interface SendEther {
  address: Address;
  amount: string;
  chain: string;
}

export const sendEther = async (data: SendEther) => {
  try {
    console.log(data, "data in the service");
    const response = await axios.post("/api/sendEth", data);
    return response.data;
  } catch (error) {
    console.error("this is the error from services", error);
    throw error;
  }
};
