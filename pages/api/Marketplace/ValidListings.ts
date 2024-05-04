import { Cronos, ZMainnet } from "@thirdweb-dev/chains";
import { DirectListingV3, ThirdwebSDK } from "@thirdweb-dev/sdk";
import { NextApiRequest, NextApiResponse } from "next";

export default async function ValidListings(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const sdk = ThirdwebSDK?.fromPrivateKey(
    process.env.PRIVATE_KEY! as string,
    ZMainnet,
    {
      clientId: process.env.TW_CLIENT_ID! as string,
      secretKey: process.env.TW_SECRET_KEY! as string,
    },
  );

  const contract = await sdk?.getContract(
    "0x6bcd19DEBcc4BCE91feB6c2948Af298d01D30546",
    "marketplace-v3",
  );

  const ValidListings: DirectListingV3[] =
    await contract.directListings.getAllValid();

  if (!ValidListings) {
    return res.status(401).json({ error: "No listings found!" });
  }
  res.status(200).json({ ValidListings });
}
