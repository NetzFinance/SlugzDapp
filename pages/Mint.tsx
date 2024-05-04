import { useAddress, useContract, useSDK } from "@thirdweb-dev/react";
import { NextPage } from "next";
import GOOSE_ABI from "../abis/Oosygoosy.json";

import NftMintBox from "../components/NftMintBox";
import OwnedSlugz from "../components/OwnedSlugz";
import { SlideFade } from "@chakra-ui/react";

const Mint: NextPage = () => {
  const address = useAddress();
  const sdk = useSDK();
  const { contract } = useContract(
    "0x1c99DFA385b47378262f3801404b2004058755c4",
    GOOSE_ABI,
  );

  return (
    <>
      <SlideFade in={true} offsetY="40px">
        <NftMintBox
          address={address || undefined}
          contract={contract || undefined}
          sdk={sdk || undefined}
        />
      </SlideFade>
    </>
  );
};

export default Mint;
