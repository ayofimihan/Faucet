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
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { config } from "@/lib/config";

export default function App({ Component, pageProps }: AppProps) {
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
