import { http, createConfig } from "wagmi";
import { baseSepolia, sepolia } from "wagmi/chains";

export const config = createConfig({
  chains: [baseSepolia, sepolia],
  transports: {
    [baseSepolia.id]: http(),
    [sepolia.id]: http(),
  },
});
