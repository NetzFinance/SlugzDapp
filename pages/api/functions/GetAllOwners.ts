import type { NextApiRequest, NextApiResponse } from "next";
import { getUser } from "../thirdweb-auth/[...thirdweb]";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import {
  Binance,
  Cronos,
  Ethereum,
  Polygon,
  ZMainnet,
} from "@thirdweb-dev/chains";

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

  const { contractAddresses, network } = req.body;

  let net;

  if (network === "ETH") {
    net = Ethereum;
  } else if (network === "CRO") {
    net = Cronos;
  } else if (network === "NETZ") {
    net = ZMainnet;
  } else if (network === "BNB") {
    net = Binance;
  } else if (network === "POLY") {
    net = Polygon;
  } else {
    net = ZMainnet;
  }

  const sdk = ThirdwebSDK?.fromPrivateKey(
    process.env.PRIVATE_KEY! as string,
    net,
    {
      clientId: process.env.TW_CLIENT_ID! as string,
      secretKey: process.env.TW_SECRET_KEY! as string,
    },
  );

  try {
    let ownerPromises = contractAddresses.map(async (address: string) => {
      const contract = await sdk?.getContract(address, "nft-drop");
      const balance = await contract?.erc721.getAllOwners();
      return { contractAddress: address, snapshot: balance };
    });

    let owners = await Promise.all(ownerPromises);
    res.status(200).json({ owners });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}
