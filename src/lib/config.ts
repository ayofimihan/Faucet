import { http } from "wagmi";
import { baseSepolia, sepolia } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";


const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

export const config = getDefaultConfig({
  appName: "faucet",
  projectId: projectId!,
  chains: [sepolia, baseSepolia],
  transports: {
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
  },
});
