import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Inter } from "next/font/google";

import { Label } from "@/components/ui/label";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { IoCopyOutline } from "react-icons/io5";
import { TbGasStation, TbGasStationOff } from "react-icons/tb";
import {
  useAccount,
  useBalance,
  useBlockNumber,
  useEnsName,
  useReadContract,
  useSignMessage,
  useWriteContract,
} from "wagmi";
import { mainnet } from "wagmi/chains";
import FaucetABI from "../abi/FaucetABI.json";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { sendEther } from "./services/sendEther";
import { Spinner } from "@/components/Spinner";
import ChainTab from "@/components/tabs/ChainTab";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [selectedAmount, setSelectedAmount] = React.useState("option-one");
  const [isSendLoading, setIsSendLoading] = React.useState(false);
  console.log(isSendLoading);

  const { address } = useAccount();
  const { signMessage } = useSignMessage();
  const blockNumber = useBlockNumber();
  const { data: drip, writeContract, status } = useWriteContract();
  console.log(status);

  const read = useReadContract({
    abi: FaucetABI,
    address: "0x0f07b81Da2CdaD0135cF9ae98D6C4E14eDd35383",
    functionName: "getBalance",
  });

  console.log(read);
  console.log(blockNumber);
  const result = useEnsName({
    address: address,
    chainId: mainnet.id,
  });
  console.log(result);

  const [captcha, setCaptcha] = React.useState<string | null>("");
  console.log(captcha);
  console.log(address);
  const balance = useBalance({
    address: address,
  });
  const formattedBalance = balance.data?.formatted;
  console.log(formattedBalance);

  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const vault = "0x1DF58063bb451760F69B25AE656De91468432A0f";
  const copyFunction = () => {
    navigator.clipboard.writeText(vault);
    toast("Address copied to clipboard", {
      description: "Thanks!",
    });
  };

  const sendEtherMutation = useMutation({
    mutationFn: sendEther,
    onSuccess: (data) => {
      setIsSendLoading(false);
      console.log(data, "data from mutation");
      toast("Your ETH is on the way!", {
        description: (
          <p>
            track txn :{" "}
            <a href={`https://sepolia.etherscan.io/tx/${data?.hash}`}>
              https://sepolia.etherscan.io/tx/{data.hash}
            </a>{" "}
          </p>
        ),
      });
    },
    onError: (error: any) => {
      setIsSendLoading(false);
      console.error("Error sending ETH got here", error);
      toast("Error sending ETH", {
        description: error.response.data.message.includes(
          "insufficient funds for transfer"
        )
          ? "Sorry Faucet empty, come back later"
          : "Something went wrong.",
      });
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsSendLoading(true);
    sendEtherMutation.mutate({ address: address, amount: selectedAmount });
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
