import { getUser } from "./thirdweb-auth/[...thirdweb]";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Get the user off the request
  const user = await getUser(req);

  // Check if the user is authenticated
  if (!user) {
    return res.status(401).json({
      message: "Not authorized to sign.",
    });
  }

  // Return a protected resource to the authenticated user
  return res.status(200).json({
    message: `This is a secret for ${user.address}.`,
  });
};
