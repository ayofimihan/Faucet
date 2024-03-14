import "@/styles/globals.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { createConfig, http, WagmiProvider } from "wagmi";
import { goerli, mainnet, sepolia } from "wagmi/chains";
import RootLayout from "@/components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  // const config = getDefaultConfig({
  //   appName: "My RainbowKit App",
  //   projectId: "YOUR_PROJECT_ID",
  //   chains: [sepolia],
  //   ssr: true,
  // });

  const config = createConfig({
    chains: [sepolia, goerli],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [goerli.id]: http(),
    },
  });
  const queryClient = new QueryClient();
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {/* Your App */}
          <RootLayout>
            <Component {...pageProps} />
          </RootLayout>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
