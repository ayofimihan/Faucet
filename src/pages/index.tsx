import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Inter } from "next/font/google";

import ChainTab from "@/components/tabs/ChainTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { IoCopyOutline } from "react-icons/io5";
import { toast } from "sonner";
import { useAccount, useBalance, useEnsName, useSignMessage } from "wagmi";
import { mainnet } from "wagmi/chains";
import FaucetABI from "../abi/FaucetABI.json";

export default function Home() {
  const [isSendLoading, setIsSendLoading] = React.useState(false);
  console.log(isSendLoading);

  const { address } = useAccount();

  const result = useEnsName({
    address: address,
    chainId: mainnet.id,
  });
  console.log(result);

  const balance = useBalance({
    address: address,
  });
  const formattedBalance = balance.data?.formatted;
  console.log(formattedBalance);

  const vault = "0x1DF58063bb451760F69B25AE656De91468432A0f";
  const copyFunction = () => {
    navigator.clipboard.writeText(vault);
    toast("Address copied to clipboard", {
      description: "Thanks!",
    });
  };

  return (
    <main className="h-screen flex justify-center items-center flex-col gap-8">
      {" "}
      <ConnectButton showBalance={false} />
      <Tabs
        defaultValue="sepolia"
        className="flex flex-col justify-center items-center"
      >
        <TabsList className="grid w-[200px] grid-cols-2 rounded-3xl ">
          <TabsTrigger value="sepolia">Sepolia</TabsTrigger>
          <TabsTrigger value="goerli">Goerli</TabsTrigger>
        </TabsList>
        <ChainTab
          chainName="Sepolia"
          faucetABI={FaucetABI}
          contractAddress="0x0f07b81Da2CdaD0135cF9ae98D6C4E14eDd35383"
          functionName="drip"
        />
        <TabsContent value="goerli">
          <div className="text-xs">
            Goerli Deprecated.{" "}
            <a className="underline cursor-pointer hover:text-blue-300">
              read more
            </a>
          </div>
        </TabsContent>
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
