import type { NextApiRequest, NextApiResponse } from "next";
import { getUser } from "../thirdweb-auth/[...thirdweb]";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Cronos, ZMainnet } from "@thirdweb-dev/chains";

type TokenBalanceResponse = {
  address: string;
  balance: string;
  decimals: number;
  symbol: string;
  name: string;
};

export default async function Tokens(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const user = await getUser(req);

  if (!user) {
    return res.status(401).json({ error: "Wallet not authorized!" });
  }

  const { contractAddresses } = req.body;

  const sdk = ThirdwebSDK?.fromPrivateKey(
    process.env.PRIVATE_KEY! as string,
    ZMainnet,
    {
      clientId: process.env.TW_CLIENT_ID! as string,
      secretKey: process.env.TW_SECRET_KEY! as string,
    },
  );

  try {
    let balancePromises = contractAddresses.map(async (address: string) => {
      const contract = await sdk?.getContract(address!, "token");
      const balance = await contract?.erc20.balanceOf(user.address);
      return {
        address,
        balance: balance.displayValue,
        decimals: balance.decimals,
        symbol: balance.symbol,
        name: balance.name,
      };
    });

    let balances = await Promise.all(balancePromises);
    console.log(balances);

    res.status(200).json({ balances });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}
