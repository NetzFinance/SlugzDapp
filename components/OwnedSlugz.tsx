import { Image, SimpleGrid, Spinner, Text, VStack } from "@chakra-ui/react";
import {
  SmartContract,
  ThirdwebNftMedia,
  useOwnedNFTs,
  useTransferNFT,
} from "@thirdweb-dev/react";
import { BaseContract } from "ethers";
import Link from "next/link";
import { useRouter } from "next/router";

export default function OwnedSlugz({
  address,
  contract,
}: {
  address: string | undefined;
  contract: SmartContract<BaseContract> | undefined;
}) {
  const router = useRouter();
  const {
    data: ownedNfts,
    refetch: refetchOwnedNfts,
    isInitialLoading: isLoadingOwnedNfts,
  } = useOwnedNFTs(contract, address);

  return (
    <>
      {!isLoadingOwnedNfts ? (
        ownedNfts && ownedNfts.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 3, lg: 5 }} spacing={10}>
            {ownedNfts.map((nft) => (
              <VStack key={nft?.metadata?.id}>
                {nft.metadata.image &&
                nft.metadata.image?.startsWith("ipfs://") ? (
                  <ThirdwebNftMedia
                    metadata={nft?.metadata}
                    height="50px"
                    width="50px"
                  />
                ) : (
                  <Image
                    src={nft?.metadata?.image!}
                    alt={nft?.metadata?.name?.toString()}
                    h="50px"
                    w="50px"
                    objectFit="cover"
                  />
                )}

                <Text textAlign={"center"}>{nft?.metadata?.name}</Text>
                <Text textAlign={"center"}>ID: {nft?.metadata?.id}</Text>
                {nft?.metadata?.image?.toString()}
              </VStack>
            ))}{" "}
          </SimpleGrid>
        ) : (
          <Text textAlign={"center"}>
            You own no nft's from this collection, mint some now from{" "}
            <Link onClick={() => router.push("/Mint")} href="">
              here
            </Link>
          </Text>
        )
      ) : (
        <>
          <Text textAlign={"center"}>Loading your nfts...</Text>
          <Spinner color="white" />
        </>
      )}
    </>
  );
}
