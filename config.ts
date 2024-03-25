import { createPublicClient, createWalletClient, custom } from "viem";
import { http, createConfig } from "wagmi";
import { baseSepolia, sepolia } from "wagmi/chains";

export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});
