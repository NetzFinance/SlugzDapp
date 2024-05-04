import type { NextApiRequest, NextApiResponse } from "next";
import { getUser } from "../thirdweb-auth/[...thirdweb]";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Cronos, ZMainnet } from "@thirdweb-dev/chains";
import { NFT } from "@thirdweb-dev/react";
import ERC721_ABI from "../../../abis/ERC721.json";
type NftBalanceResponse = {
  ownedNfts: NFT[];
  contractAddress: string;
  totalNfts: number;
};

const sdk = ThirdwebSDK?.fromPrivateKey(
  process.env.PRIVATE_KEY! as string,
  ZMainnet,
  {
    clientId: process.env.TW_CLIENT_ID! as string,
    secretKey: process.env.TW_SECRET_KEY! as string,
  },
);

export default async function Nfts(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUser(req);

  if (!user) {
    return res.status(401).json({ error: "Wallet not authorized!" });
  }

  const { contractAddresses } = req.body;

  try {
    const ownedNftsBalances = contractAddresses.map(async (address: string) => {
      const contract = await sdk?.getContract(address!, ERC721_ABI);
      const ownedNfts = await contract?.erc721.getOwned(user.address);
      const totalNfts = await contract?.erc721.balanceOf(user.address);
      return {
        ownedNfts: ownedNfts,
        contractAddress: address,
        totalNfts: Number(totalNfts),
      };
    });

    const ownedNfts = await Promise.all(ownedNftsBalances);
    console.log(ownedNfts);

    res.status(200).json({ ownedNfts });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}
