import "@/styles/globals.css";
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { createConfig, http, WagmiProvider } from "wagmi";
import { baseSepolia, sepolia, mainnet } from "wagmi/chains";
import RootLayout from "@/components/Layout";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
} from "@rainbow-me/rainbowkit/wallets";

export default function App({ Component, pageProps }: AppProps) {
  const connectors = connectorsForWallets(
    [
      {
        groupName: "Popular",
        wallets: [metaMaskWallet, rainbowWallet, coinbaseWallet],
      },
    ],
    {
      appName: "Base Sepolia Faucet",
      projectId: "c7483d888e40df6aa24382feda8b20ae",
      appUrl: "https://localhost:3000",
      appIcon: "https://localhost:3000/favicon.ico",
      appDescription: "A faucet for Sepolia and Base Sepolia tokens",
    }
  );
  const config = createConfig({
    connectors,
    chains: [baseSepolia, sepolia],
    transports: {
      [baseSepolia.id]: http(),
      [sepolia.id]: http(),
    },
  });

  const queryClient = new QueryClient();
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={{
            lightMode: lightTheme({
              ...lightTheme.accentColors.blue,
            }),
            darkMode: darkTheme(),
          }}
        >
          <RootLayout>
            <Component {...pageProps} />
          </RootLayout>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
