import "@/styles/globals.css";
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { WagmiProvider } from "wagmi";

import { config } from "@/lib/config";
import Head from "next/head";
import RootLayout from "@/components/Layout";

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
            <Head>
              + <title>Base Sepolia Faucet</title>+{" "}
              <meta
                name="description"
                content="Get Sepolia and Base Sepolia tokens from the faucet"
              />
              <meta name="author" content="champion" />
              <link rel="author" href="https://0x13.dev" />
              <meta
                name="image"
                content="https://res.cloudinary.com/godfimihan/image/upload/v1712948328/Base_Sepola_elloin.jpg"
              />
              <meta
                name="keywords"
                content="sepolia, base sepolia, faucet, test tokens, base network, eth, test eth, free eth, testnet, testnet tokens"
              />
              <meta name="application-name" content="Base Sepolia Faucet" />
              <meta name="creator" content="champion" />
              <meta property="og:title" content="Base Sepolia Faucet" />
              <meta
                property="og:description"
                content="Get Base Sepolia and Sepolia tokens from the faucet"
              />
              <meta
                property="og:url"
                content="https://base-sepolia-faucet.vercel.app"
              />
              <meta property="og:site_name" content="Base Sepolia Faucet" />
              <meta property="og:locale" content="en_US" />
              <meta
                property="og:image "
                content="https://res.cloudinary.com/godfimihan/image/upload/v1712948328/Base_Sepola_elloin.jpg"
              />
              <meta property="og:image:width" content="1200" />
              <meta property="og:image:height" content="630" />
              <meta property="og:image:alt" content="Base Sepolia Faucet" />
              <meta property="og:type" content="website" />+{" "}
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:creator" content="@F1m1han" />
              <meta
                name="twitter:description"
                content="Get Base Sepolia and Sepolia tokens from the faucet"
              />
              <meta
                name="twitter:image"
                content="https://res.cloudinary.com/godfimihan/image/upload/v1712948328/Base_Sepola_elloin.jpg"
              ></meta>
            </Head>
            <Component {...pageProps} />
          </RootLayout>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
