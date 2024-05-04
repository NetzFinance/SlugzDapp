import { Cronos, ZMainnet } from "@thirdweb-dev/chains";
import { DirectListingV3, ThirdwebSDK } from "@thirdweb-dev/sdk";
import { NextApiRequest, NextApiResponse } from "next";

export default async function Listing(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.body;

  const sdk = ThirdwebSDK?.fromPrivateKey(
    process.env.PRIVATE_KEY! as string,
    ZMainnet,
    {
      clientId: process.env.TW_CLIENT_ID as string,
      secretKey: process.env.TW_SECRET_KEY as string,
    },
  );
  const contract = await sdk?.getContract(
    "0x6bcd19DEBcc4BCE91feB6c2948Af298d01D30546",
    "marketplace-v3",
  );

  const listing: DirectListingV3 = await contract.directListings.getListing(id);
  // Perform some logic with the parameters
  // ...

  if (!listing) {
    return res.status(401).json({ error: "No listings found!" });
  }
  res.status(200).json({ listing });
}
