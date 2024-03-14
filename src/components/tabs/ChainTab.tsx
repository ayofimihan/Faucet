import { Label } from "@radix-ui/react-label";

import ReCAPTCHA from "react-google-recaptcha";
import { TbGasStationOff, TbGasStation } from "react-icons/tb";
import { writeContract } from "viem/actions";
import { Spinner } from "../Spinner";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { TabsContent } from "../ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAccount, useBalance, useWriteContract } from "wagmi";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { sendEther } from "@/pages/services/sendEther";
import { toast } from "sonner";
import { Address } from "viem";

type props = {
  chainName: string;
  faucetABI: any;
  contractAddress: Address;
  functionName: string;
};

const ChainTab = ({
  chainName,
  faucetABI,
  contractAddress,
  functionName,
}: props) => {
  const { address } = useAccount();
  const balance = useBalance({
    address: address,
  });
  const { data: drip, writeContract, status } = useWriteContract();

  const [selectedAmount, setSelectedAmount] = React.useState("option-one");
  const [captcha, setCaptcha] = React.useState<string | null>("");
  const [isSendLoading, setIsSendLoading] = React.useState(false);

  const formattedBalance = balance.data?.formatted;

  const sendEtherMutation = useMutation({
    mutationFn: sendEther,
    onSuccess: (data) => {
      setIsSendLoading(false);
      console.log(data, "data from mutation");
      toast("Your ETH is on the way!", {
        description: (
          <p>
            track txn :{" "}
            <a href={`https://${chainName}.etherscan.io/tx/${data?.hash}`}>
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

  const handleDrip = () => {
    setIsSendLoading(true);
    const hash = writeContract({
      abi: faucetABI,
      address: contractAddress,
      functionName: functionName,
      args: [
        selectedAmount === "0.1" ? "100000000000000000" : "200000000000000000",
      ],
    });
    console.log("this is the hash", hash);
    setIsSendLoading(false);
  };

  return (
    <TabsContent value={chainName.toLowerCase()}>
      <Card className="flex justify-center items-center flex-col w-[600px]">
        <CardHeader className="flex items-center justify-center">
          <CardTitle className="text-2xl">
            Testnet {chainName} ETH Faucet for Ethereum Developers
          </CardTitle>
          <CardDescription className="text-md">
            Fast and reliable. 0.1 {chainName} ETH/day/address. blz don't drain
            the faucet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col justify-center items-center space-y-1.5">
                <Label htmlFor="name">Connected Address/ENS</Label>
                <p className="text-red-500 text-sm">
                  {address ? (
                    <p className="text-green-400">{address}</p>
                  ) : (
                    "Connect your wallet"
                  )}
                </p>
              </div>
              <div className="flex flex-col justify-center items-center space-y-1.5">
                <Label htmlFor="amount">Request Amount</Label>

                <RadioGroup
                  defaultValue="0.1"
                  className="flex"
                  onValueChange={(value) => setSelectedAmount(value)}
                >
                  <div
                    className={`flex items-center space-x-2 border p-3 rounded-lg ${
                      selectedAmount === "0.1"
                        ? "border-rose-500 bg-rose-100"
                        : ""
                    }`}
                  >
                    <RadioGroupItem value="0.1" id="one" className="hidden" />
                    <Label htmlFor="one" className="cursor-pointer">
                      0.1 ETH
                    </Label>
                  </div>
                  <div
                    className={`flex items-center space-x-2 border p-3 rounded-lg ${
                      selectedAmount === "0.2"
                        ? "border-rose-500 bg-rose-100"
                        : ""
                    }`}
                  >
                    <RadioGroupItem value="0.2" id="two" className="hidden" />
                    <Label htmlFor="two" className="cursor-pointer">
                      0.2 ETH
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </form>
        </CardContent>
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          className="flex justify-center mb-5"
          onChange={setCaptcha}
        />
        <CardFooter className="flex justify-between">
          <Button
            onClick={formattedBalance !== "0" ? handleDrip : handleSubmit}
            disabled={captcha && address ? false : true}
          >
            {isSendLoading ? (
              <Spinner.spinner className=" h-4 w-4 animate-spin" />
            ) : formattedBalance === "0" ? (
              <TbGasStationOff size={30} className="p-1" />
            ) : (
              <TbGasStation size={30} className="p-1" />
            )}
          </Button>
        </CardFooter>
      </Card>
    </TabsContent>
  );
};

export default ChainTab;
