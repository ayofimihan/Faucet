// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address, amount } = req.body;
  const PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;
  const client = createWalletClient({
    chain: sepolia,
    transport: http(),
  });

  const account = privateKeyToAccount(`0x${PRIVATE_KEY}`);

  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(1, "300 s"),
    analytics: true,
  });

  const { success } = await ratelimit.limit(address);
  // if (!success) {
  //   console.log("Too many requests");
  // return res.status(429).json({ success: false, message: "Too many requests" });
  // }

  try {
    const hash = await client.sendTransaction({
      account,
      to: address,
      value: parseEther(amount),
    });

    console.log("this is the hash", hash);

    return res.status(200).json({ success: true, hash });
  } catch (error: any) {
    console.log(error.details);
    return res.status(500).json({ success: false, message: error.details });
  }
}

export default handler;
