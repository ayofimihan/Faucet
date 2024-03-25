import "@/styles/globals.css";
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
  midnightTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { createConfig, http, WagmiProvider } from "wagmi";
import { baseSepolia, goerli, mainnet, sepolia } from "wagmi/chains";
import RootLayout from "@/components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  const config = createConfig({
    chains: [sepolia, baseSepolia],
    transports: {
      [sepolia.id]: http(),
      [baseSepolia.id]: http(),
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
          {/* Your App */}
          <RootLayout>
            <Component {...pageProps} />
          </RootLayout>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
