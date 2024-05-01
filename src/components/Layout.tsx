import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
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
  authors: [{ name: "Champion", url: "https://github.com/ayofimihan" }],
  openGraph: {
    title: "Base Sepolia Faucet",
    description: "Get Base Sepolia and Sepolia tokens from the faucet",
    url: "https://base-sepolia-faucet.vercel.app",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/godfimihan/image/upload/v1712948328/Base_Sepola_elloin.jpg",
        width: 1200,
        height: 630,
      },
    ],
    siteName: "Base Sepolia Faucet",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@f1m1han",
    site: "https://base-sepolia-faucet.vercel.app",
    title: "Base Sepolia Faucet",
    description: "Get Base Sepolia and Sepolia tokens from the faucet",
    images: [
      {
        url: "https://res.cloudinary.com/godfimihan/image/upload/v1712948328/Base_Sepola_elloin.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#DAFEE7]">
      <main className={`${spaceGrotesk.className} `}>{children}</main>
      <Toaster />
    </div>
  );
}
