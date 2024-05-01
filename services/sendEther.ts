import axios from "axios";
import { Address } from "viem";

export interface SendEther {
  address: Address;
  amount: string;
  chain: string;
}

export const sendEther = async (data: SendEther) => {
  try {
    const response = await axios.post("/api/sendEth", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
