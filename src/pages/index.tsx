import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ChainTab from "@/components/tabs/ChainTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { IoCopyOutline } from "react-icons/io5";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import FaucetABI from "../abi/FaucetABI.json";
import SepoliaABI from "../abi/SepoliaABI.json";
import { CustomButton } from "@/components/ui/CustomConnectButton";
import { useChainModal } from "@rainbow-me/rainbowkit";
import { useSwitchChain } from "wagmi";

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

  const { openChainModal } = useChainModal();
  const { chains, switchChain } = useSwitchChain();
  console.log(chains);

  return (
    <main className="h-screen flex justify-center items-center flex-col gap-8">
      {" "}
      <CustomButton />
      <Tabs
        defaultValue="basesepolia"
        className="flex flex-col justify-center items-center"
      >
        <TabsList className="grid w-[200px] grid-cols-2 rounded-3xl ">
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
          chainName="baseSepolia"
          faucetABI={SepoliaABI}
          contractAddress="0x0fC2Ad3A50a75E917d4DB721D447A948333769BC"
          functionName="drip"
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
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle> Faucet Address</CardTitle>
          <CardDescription>
            Support our faucet. Donate to keep us running.
          </CardDescription>
          <div className="flex align-center items-center justify-between border border-dashed rounded-md">
            <div>{vault}</div>

            <Button variant={"ghost"} onClick={copyFunction}>
              <IoCopyOutline />
            </Button>
          </div>
        </CardHeader>
      </Card>
    </main>
  );
}
