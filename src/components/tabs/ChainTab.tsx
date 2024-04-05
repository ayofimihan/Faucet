import { Label } from "@radix-ui/react-label";

import ReCAPTCHA from "react-google-recaptcha";
import { TbGasStationOff, TbGasStation } from "react-icons/tb";
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
import {
  Address,
  ContractFunctionExecutionError,
  Hash,
  TransactionExecutionError,
  TransactionReceipt,
} from "viem";
import Image from "next/image";
import { useEnsName } from "wagmi";

type props = {
  chainName: string;
  faucetABI: any;
  contractAddress: Address;
  functionName: string;
  selectedAmount: string;
  setSelectedAmount: React.Dispatch<React.SetStateAction<string>>;
};

const ChainTab = ({
  chainName,
  faucetABI,
  contractAddress,
  functionName,
  selectedAmount,
  setSelectedAmount,
}: props) => {
  const errTxnRejected = "User rejected the request.";
  const errRateLimit = "Too many requests";
  const { chain } = useAccount();
  const connectedChain = chain?.name;

  const { address } = useAccount();

  const balance = useBalance({
    address: address,
  });

  const {
    data: drip,
    writeContract,
    status: dripStatus,
  } = useWriteContract({
    mutation: {
      onError: (error: any) => {
        console.log(error, "error chaintab mutation");
        if (error instanceof TransactionExecutionError) {
          if (error.shortMessage.includes(errTxnRejected)) {
            toast("User rejected the request", {
              description: "Please try again",
            });
          }
          if (error.shortMessage.includes(errRateLimit)) {
            toast("Too many requests", {
              description: "Try again in 24 hours",
            });
          }
        }
        if (error instanceof ContractFunctionExecutionError) {
          if (error.shortMessage.includes("You can only withdraw once a day")) {
            toast("You have already withdrawn today.", {
              description: "Try again in 24 hours",
            });
          }
          if (error.shortMessage.includes("Not enough funds in the contract")) {
            toast("Not enough funds in the contract", {
              description: "Try again in a few hours",
              style: { backgroundColor: "#fca5a5" },
            });
          }
        }
        setIsSendLoading(false);
      },
      onSuccess: (hash: any) => {
        if (hash) {
          setIsSendLoading(false);
          toast("Your eth is on the way!", {
            description: (
              <p>
                track txn :{" "}
                {chainName === "Sepolia" ? (
                  <a href={`https://${chainName}.etherscan.io/tx/${hash}`}>
                    https://sepolia.etherscan.io/tx/{hash}
                  </a>
                ) : (
                  <a href={`https://sepolia.basescan.org/tx/${hash}`}>
                    {" "}
                    https://sepolia.basescan.org/tx/{hash}
                  </a>
                )}
              </p>
            ),
          });
        }
      },
    },
  });

  const [captcha, setCaptcha] = React.useState<string | null>("");
  const [isSendLoading, setIsSendLoading] = React.useState(false);

  const formattedBalance = Number(balance.data?.formatted);
  console.log(formattedBalance);

  const sendEtherMutation = useMutation({
    mutationFn: sendEther,
    onSuccess: (data) => {
      setIsSendLoading(false);
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

      error.response.data.message.includes("insufficient funds for transfer")
        ? toast("Insuffiecient funds for transfer", {
            description: "Sorry Faucet empty, come back later",
          })
        : error.response.data.message.includes("Too many requests")
        ? toast("Too many requests", {
            style: { backgroundColor: "red" },
            closeButton: true,
            description: "Try again in 24 hours",
          })
        : toast("Unknown error occured, try again", {
            description: "Try again",
          });
    },
  });

  //this is the function that makes the api call to send ether without approving a transaction.
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsSendLoading(true);
    sendEtherMutation.mutate({
      address: address,
      amount: selectedAmount,
      chain: connectedChain,
    });
  };

  //this is the function that makes the contract call.
  const handleDrip = async () => {
    setIsSendLoading(true);
    try {
      console.log(chainName);
      console.log(connectedChain);
      if (chainName === connectedChain) {
        writeContract({
          abi: faucetABI,
          address: contractAddress,
          functionName: functionName,
          args: [
            selectedAmount === "0.02"
              ? "20000000000000000"
              : "50000000000000000",
          ],
        });
      } else {
        toast(`⚠️You are currently connected to ${connectedChain} network`, {
          description: `Please connect to ${chainName} network to continue`,
          style: { backgroundColor: "yellow" },
        });
        setIsSendLoading(false);
      }
    } catch (error: unknown) {}
  };

  const ens = useEnsName({ address: address });
  console.log(ens);

  return (
    <TabsContent value={chainName.split(" ").join("").toLowerCase()}>
      <Card className="flex justify-center items-center flex-col w-[600px]">
        <CardHeader className="flex items-center justify-center">
          <CardTitle className="text-2xl font-bold flex align-center items-center ">
            <span>
              {" "}
              {chainName === "Sepolia" ? (
                <Image
                  src={"/eth-sepolia.png"}
                  alt="Sepolia logo"
                  width={20}
                  height={20}
                />
              ) : (
                <Image
                  src={"/Base_Symbol_Blue.png"}
                  alt="Base black logo"
                  width={20}
                  height={20}
                />
              )}
            </span>
            <>&nbsp;</>
            {chainName === "baseSepolia" ? "Base Sepolia" : chainName} Faucet.
          </CardTitle>
          <CardDescription className="text-md">
            Dripping 0.05 {chainName === "Sepolia" ? chainName : "bsETH"} per
            day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col justify-center items-center space-y-1.5">
                <Label htmlFor="name">Connected Address/ENS</Label>
                <p className="text-red-500 text-sm">
                  {address ? (
                    <span className="text-green-400">{address}</span>
                  ) : (
                    "Connect your wallet"
                  )}
                </p>
              </div>
              <div className="flex flex-col justify-center items-center space-y-1.5">
                <Label htmlFor="amount">Request Amount</Label>

                <RadioGroup
                  value={selectedAmount}
                  className="flex"
                  onValueChange={(value) => setSelectedAmount(value)}
                >
                  <div
                    className={`flex items-center space-x-2 border p-3 rounded-lg ${
                      selectedAmount === "0.02"
                        ? "border-rose-500 bg-rose-100"
                        : ""
                    }`}
                  >
                    <RadioGroupItem value="0.02" id="one" className="hidden" />
                    <Label htmlFor="one" className="cursor-pointer">
                      0.02 ETH
                    </Label>
                  </div>
                  <div
                    className={`flex items-center space-x-2 border p-3 rounded-lg ${
                      selectedAmount === "0.05"
                        ? "border-rose-500 bg-rose-100"
                        : ""
                    }`}
                  >
                    <RadioGroupItem value="0.05" id="two" className="hidden" />
                    <Label htmlFor="two" className="cursor-pointer">
                      0.05 ETH
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
            onClick={formattedBalance >= 0.01 ? handleDrip : handleSubmit}
            disabled={captcha && address ? false : true}
          >
            {isSendLoading ? (
              <Spinner.spinner className=" h-4 w-4 animate-spin" />
            ) : formattedBalance < 0.01 ? (
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
