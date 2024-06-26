import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { TbGasStation, TbGasStationOff } from "react-icons/tb";
import { toast } from "sonner";
import {
  Abi,
  Address,
  ContractFunctionExecutionError,
  TransactionExecutionError,
} from "viem";
import { useAccount, useBalance, useEnsName, useWriteContract } from "wagmi";
import { Spinner } from "../Spinner";
import { Button } from "../ui/button";
import { TabsContent } from "../ui/tabs";
import { sendEther } from "../../../services/sendEther";

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
        if (error instanceof TransactionExecutionError) {
          if (error.shortMessage.includes(errTxnRejected)) {
            toast.warning("User rejected the request", {
              description: "Please try again",
            });
          }
          if (error.shortMessage.includes(errRateLimit)) {
            toast.error("Too many requests", {
              description: "Try again in 24 hours",
            });
          }
        }
        if (error instanceof ContractFunctionExecutionError) {
          if (error.shortMessage.includes("You can only withdraw once a day")) {
            toast.error("You have already withdrawn today.", {
              description: "Wait 24 hours between requests",
            });
          }
          if (error.shortMessage.includes("Not enough funds in the contract")) {
            toast.error("Not enough funds in the faucet", {
              description: "Try again in a few hours",
            });
          }
        }
        setIsSendLoading(false);
      },
      onSuccess: (hash: string) => {
        if (hash) {
          setIsSendLoading(false);
          toast.success("Your eth is on the way!", {
            description: (
              <p>
                track txn :{" "}
                {chainName === "Sepolia" ? (
                  <a
                    href={`https://${chainName}.etherscan.io/tx/${hash}`}
                    target="_blank"
                  >
                    https://sepolia.etherscan.io/tx/{hash}
                  </a>
                ) : (
                  <a
                    href={`https://sepolia.basescan.org/tx/${hash}`}
                    target="_blank"
                  >
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

  const sendEtherMutation = useMutation({
    mutationFn: sendEther,
    onSuccess: (data) => {
      setIsSendLoading(false);
      toast.success("Your ETH is on the way!", {
        description: (
          <p>
            track txn :{" "}
            {chainName === "Sepolia" ? (
              <a
                href={`https://${chainName}.etherscan.io/tx/${data.hash}`}
                target="_blank"
              >
                https://sepolia.etherscan.io/tx/{data.hash}
              </a>
            ) : (
              <a
                href={`https://sepolia.basescan.org/tx/${data.hash}`}
                target="_blank"
              >
                {" "}
                https://sepolia.basescan.org/tx/{data.hash}
              </a>
            )}
          </p>
        ),
      });
    },
    onError: (error: any) => {
      setIsSendLoading(false);

      error.response.data.message.includes("insufficient funds for transfer")
        ? toast.error("Insuffiecient funds for transfer", {
            description: "Sorry Faucet empty, come back later",
          })
        : error.response.data.message.includes("Too many requests")
        ? toast.error("Too many requests", {
            closeButton: true,
            description: "Try again in 24 hours",
          })
        : toast.error("Unknown error occured, try again", {
            description: "Try again",
          });
    },
  });

  //this is the function that makes the api call to send ether without approving a transaction if connected account doesn't have enough balance to pay gas fees.
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsSendLoading(true);
    sendEtherMutation.mutate({
      address: address!,
      amount: selectedAmount,
      chain: connectedChain!,
    });
  };

  //this is the function that makes the contract call if you have enough balance to pay gas fees.
  const handleDrip = async () => {
    setIsSendLoading(true);
    try {
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
        toast.warning(
          `You are currently connected to ${connectedChain} network`,
          {
            description: `Please switch to ${chainName} network to continue`,
            style: { backgroundColor: "yellow" },
          }
        );
        setIsSendLoading(false);
      }
    } catch (error: unknown) {}
  };

  const ens = useEnsName({ address: address });

  return (
    <TabsContent value={chainName.split(" ").join("").toLowerCase()}>
      <div className="flex flex-col justify-center items-center border border-black shadow-sq  p-1 sm:p-8 sm:w-[424px]  ">
        <h1 className="text-2xl flex items-center justify-center">
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
        </h1>
        <p className="text-sm text-slate-600">
          Dripping 0.05 {chainName === "Sepolia" ? chainName : "bsETH"} per day
        </p>
        <div className="items-center flex flex-col mt-5 space-y-1">
          <p>Connected Address/ENS</p>{" "}
          <p className="text-red-500 text-xs sm:text-sm">
            {address ? (
              <div className="text-slate-400">{address}</div>
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
                selectedAmount === "0.02" ? "border-rose-500 bg-rose-100" : ""
              }`}
            >
              <RadioGroupItem value="0.02" id="one" className="hidden" />
              <Label htmlFor="one" className="cursor-pointer">
                0.02 ETH
              </Label>
            </div>
            <div
              className={`flex items-center space-x-2 border p-3 rounded-lg ${
                selectedAmount === "0.05" ? "border-rose-500 bg-rose-100" : ""
              }`}
            >
              <RadioGroupItem value="0.05" id="two" className="hidden" />
              <Label htmlFor="two" className="cursor-pointer">
                0.05 ETH
              </Label>
            </div>
          </RadioGroup>
        </div>
        <ReCAPTCHA
          sitekey={"6LdB244pAAAAAOyHN7PejeS3NjR151UNVciqA4Uz"}
          className="flex justify-center sm:mb-2 p-5"
          onChange={setCaptcha}
        />
        <Button
          onClick={formattedBalance >= 0.01 ? handleDrip : handleSubmit}
          disabled={captcha && address ? false : true}
          className="mb-2 sm:mb-0"
        >
          {isSendLoading ? (
            <Spinner.spinner className=" h-4 w-4 animate-spin" />
          ) : formattedBalance < 0.01 ? (
            <TbGasStationOff size={30} className="p-1" />
          ) : (
            <TbGasStation size={30} className="p-1" />
          )}
        </Button>
      </div>
    </TabsContent>
  );
};

export default ChainTab;
