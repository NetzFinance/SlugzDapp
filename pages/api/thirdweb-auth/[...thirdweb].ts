import { ThirdwebAuth } from "@thirdweb-dev/auth/next";
import { PrivateKeyWallet } from "@thirdweb-dev/auth/evm";
import { ZMainnet } from "@thirdweb-dev/chains";

export const { ThirdwebAuthHandler, getUser } = ThirdwebAuth({
  domain: "https://netz.finance/", //"http://localhost:3000", 
  wallet: new PrivateKeyWallet(process.env.PRIVATE_KEY! || ""),
  authOptions: {
    statement:
      "By connecting to this site you agree to our terms of services. As always Dyor and invest responsibly. We are not responsible in the event of any financial loss.",
    uri: "",
    resources: [""],
    chainId: ZMainnet.chainId.toString(),
    version: "1",
  },
});

export default ThirdwebAuthHandler();
