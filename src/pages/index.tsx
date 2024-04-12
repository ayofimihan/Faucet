import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChainTab from "@/components/tabs/ChainTab";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { IoCopyOutline } from "react-icons/io5";
import { toast } from "sonner";
import FaucetABI from "../abi/FaucetABI.json";
import SepoliaABI from "../abi/SepoliaABI.json";
import { CustomButton } from "@/components/ui/CustomConnectButton";
import { useChainModal } from "@rainbow-me/rainbowkit";
import { useSwitchChain } from "wagmi";
import Footer from "@/components/ui/Footer";

export default function Home() {
  const [sepoliaSelectedAmount, setSepoliaSelectedAmount] =
    React.useState("0.02");
  const [baseSepoliaSelectedAmount, setBaseSepoliaSelectedAmount] =
    React.useState("0.02");

  const vault = "0x1DF58063bb451760F69B25AE656De91468432A0f";
  const copyFunction = () => {
    navigator.clipboard.writeText(vault);
    toast("Address copied to clipboard", {
      description: "Thanks!",
    });
  };

  const { chains, switchChain } = useSwitchChain();
  console.log(chains);

  return (
    <main className="sm:h-screen flex items-center flex-col gap-6 justify-center my-3 sm:my-0">
      {" "}
      <CustomButton />
      <Tabs
        defaultValue="basesepolia"
        className="flex flex-col justify-center items-center w-full"
      >
        <TabsList className="grid grid-cols-2 rounded-3xl ">
          <TabsTrigger
            value="basesepolia"
            onClick={() => switchChain({ chainId: 84532 })}
          >
            Base Sepolia
          </TabsTrigger>
          <TabsTrigger
            value="sepolia"
            onClick={() => switchChain({ chainId: 11155111 })}
          >
            Sepolia
          </TabsTrigger>
        </TabsList>
        <ChainTab
          chainName="Base Sepolia"
          faucetABI={SepoliaABI}
          contractAddress="0x5684c785bC826005E8F0f97D3A1bf4F50dBc1b4A"
          functionName="dripbase"
          selectedAmount={baseSepoliaSelectedAmount}
          setSelectedAmount={setBaseSepoliaSelectedAmount}
        />
        <ChainTab
          chainName="Sepolia"
          faucetABI={FaucetABI}
          contractAddress="0xDD0725cb9b7b381d81EC025aeecCD27D2F37F22B"
          functionName="drip"
          selectedAmount={sepoliaSelectedAmount}
          setSelectedAmount={setSepoliaSelectedAmount}
        />
      </Tabs>
      <div className="border shadow-sq border-black p-1 sm:min-w-[424.1px]">
        <h1 className="text-bold tracking-tight">Faucet Address</h1>
        <p className="text-xs sm:text-sm mb-1">
          Support our faucet. Donate to keep us running.
        </p>
        <div className="flex align-center items-center justify-between border border-dashed rounded-md">
          <div className="text-xs">{vault}</div>
          <Button variant={"ghost"} onClick={copyFunction}>
            <IoCopyOutline />
          </Button>
        </div>
      </div>
      <Footer/>
    
    </main>
  );
}
