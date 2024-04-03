// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia, sepolia } from "viem/chains";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address, amount, chain } = req.body;
  const PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;

  let client;
  if (chain === "Sepolia") {
    client = createWalletClient({
      chain: sepolia,
      transport: http(),
    });
  } else if (chain === "Base Sepolia") {
    client = createWalletClient({
      chain: baseSepolia,
      transport: http(),
    });
  }

  const account = privateKeyToAccount(`0x${PRIVATE_KEY}`);

  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(1, "86400 s"),
    analytics: true,
  });

  const { success } = await ratelimit.limit(address);

  try {
    const hash = await client!.sendTransaction({
      account,
      to: address,
      value: parseEther(amount),
    });

    if (!success) {
      return res
        .status(429)
        .json({ success: false, message: "Too many requests" });
    }

    return res.status(200).json({ success: true, hash });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.details });
  }
}

export default handler;
