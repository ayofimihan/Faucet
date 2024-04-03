import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sepolia/Base Sepolia Faucet",
  description: "Get Sepolia and Base Sepolia tokens from the faucet",
  keywords: [
    "sepolia",
    "base sepolia",
    "faucet",
    "test tokens",
    "base network",
    "eth",
    "test eth",
    "free eth",
    "testnet",
    "testnet tokens",
  ],
  applicationName: "Base Sepolia Faucet",
  authors: [{ name: "Champion", url: "https://githib.com/ayofimihan" }],
  openGraph: {
    title: "Base Sepolia Faucet",
    description: "Get Sepolia and Base Sepolia tokens from the faucet",
    url: "https://sepolia-faucet.vercel.app",
    type: "website",
    images: [
      {
        url: "https://sepolia-faucet.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Base Sepolia Faucet",
      },
    ],
    siteName: "Base Sepolia Faucet",
  },
  twitter: {
    card: "summary_large_image",
    site: "https://sepolia-faucet.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <main className={`${spaceGrotesk.className} bg-slate-100`}>
        {children}
      </main>
      <Toaster />
    </div>
  );
}
