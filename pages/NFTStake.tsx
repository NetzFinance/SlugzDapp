import {
  ThirdwebNftMedia,
  toEther,
  toWei,
  useAddress,
  useBalance,
  useContract,
  useContractRead,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import { NextPage } from "next";
import AddressCheck from "../components/Navigation/NoAddress";
import ERC20_ABI from "../abis/ERC20.json";
import ERC721_ABI from "../abis/Oosygoosy.json";
import STAKING_ABI from "../abis/NFTStaking.json";
import {
  Box,
  VStack,
  Text,
  Image,
  SimpleGrid,
  Spinner,
  Button,
  Stack,
  Flex,
  useToast,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";

const NFTStake: NextPage = () => {
  const address = useAddress();
  const goozy = "0x1c99DFA385b47378262f3801404b2004058755c4";
  const slugz = "0x19b376c4493dca3902b90f726ee79c2dbcf8532a";

  if (!address) {
    return <AddressCheck />;
  }

  const [staking, setStaking] = useState(false);
  const [unstaking, setUnstaking] = useState(false);
  const [claiming, setClaiming] = useState(false);

  const toast = useToast();

  const { contract: nftStakingContract } = useContract(
    "0xF438656BA70d90aD71e09E46F36fa78c883e93ac",
    STAKING_ABI,
  );
  const { contract: nftContract } = useContract(goozy, ERC721_ABI);
  const { contract: tokenContract } = useContract(slugz, ERC20_ABI);

  const {
    data: ownedNfts,
    isInitialLoading: isLoadingOwnedNfts,
    refetch: refetchOwnedNfts,
  } = useOwnedNFTs(nftContract, address);

  const {
    data: tokenBalance,
    isInitialLoading: isLoadingTokenBalance,
    refetch: refetchTokenBalance,
  } = useBalance("0x19b376c4493dca3902b90f726ee79c2dbcf8532a");

  const {
    data: getUserStakedNFTsForCollection, //returns uint256[]
    isInitialLoading: isLoadingGetUserStakedNFTsForCollection,
    refetch: refetchGetUserStakedNFTsForCollection,
  } = useContractRead(nftStakingContract, "getUserStakedNFTsForCollection", [
    goozy,
    address,
  ]);

  const {
    data: chargeStake, //returns wei value
    isInitialLoading: isLoadiingChargeStake,
    refetch: refetchChargeStake,
  } = useContractRead(nftStakingContract, "chargeStake", []);

  const {
    data: totalStaked, //returns uint value
    isInitialLoading: isLoadingTotalStaked,
    refetch: refetchTotalStaked,
  } = useContractRead(nftStakingContract, "totalStaked", [goozy]);

  const {
    data: earned, //returns wei value
    isInitialLoading: isLoadingEarned,
    refetch: refetchEarned,
  } = useContractRead(nftStakingContract, "earned", [goozy, address]);
  const {
    data: rewardPerToken, //returns wei value
    isInitialLoading: isLoadingRewardPerToken,
    refetch: refetchRewardPerToken,
  } = useContractRead(nftStakingContract, "rewardPerToken", [goozy]);

  const {
    data: rewardRate, //returns wei value
    isInitialLoading: isLoadingRewardRate,
    refetch: refetchRewardRate,
  } = useContractRead(nftStakingContract, "rewardRate", []);

  const {
    data: lastUpdateTime, //returns uint value
    isInitialLoading: isLoadingLastUpdateTime,
    refetch: refetchLastUpdateTime,
  } = useContractRead(nftStakingContract, "lastUpdateTime", [address]);

  const {
    data: rewardPerTokenStored, //returns wei value
    isInitialLoading: isLoadingRewardPerTokenStored,
    refetch: refetchRewardPerTokenStored,
  } = useContractRead(nftStakingContract, "rewardPerTokenStored", [goozy]);

  const {
    data: rewards, //returns wei value
    isInitialLoading: isLoadingRewards,
    refetch: refetchRewards,
  } = useContractRead(nftStakingContract, "rewards", [goozy]);

  const {
    data: balanceOf, //returns wei value
    isInitialLoading: isLoadingBalanceOf,
    refetch: refetchBalanceOf,
  } = useContractRead(nftStakingContract, "balanceOf", [goozy, address]);

  function refetcher() {
    refetchOwnedNfts();
    refetchTokenBalance();
    refetchGetUserStakedNFTsForCollection();
    refetchChargeStake();
    refetchTotalStaked();
    refetchEarned();
    refetchRewardPerToken();
    refetchRewardRate();
    refetchLastUpdateTime();
    refetchRewardPerTokenStored();
    refetchRewards();
    refetchBalanceOf();
  }

  return (
    <VStack w="100%" justifyContent={"center"} alignContent={"center"}>
      <VStack
        m="auto"
        as={Flex}
        textAlign={"center"}
        w={{ base: "95%", lg: "60%" }}
        border={"2px solid #8ff000"}
        borderRadius={"md"}
        p={4}
        justifyContent={"space-between"}
        bg="black"
      >
        <Text>Owned NFTs: </Text>
        {!isLoadingOwnedNfts ? (
          ownedNfts && ownedNfts?.length < 1 ? (
            <Text>You hold no nfts</Text>
          ) : (
            <SimpleGrid
              columns={[2, 4, 5]}
              gap={4}
              spacing={4}
              maxH={{ base: 320, lg: 480 }}
              maxW={640}
              overflow={"scroll"}
              border={"2px solid #8ff000"}
              p={2}
              borderRadius={"md"}
            >
              {ownedNfts?.map((nft) => (
                <Box
                  key={nft.metadata.id}
                  textAlign={"center"}
                  justifyContent={"center"}
                  maxH={150}
                  maxW={150}
                  border="2px solid #8ff000"
                  p={2}
                  borderRadius={"md"}
                >
                  <ThirdwebNftMedia
                    metadata={nft.metadata}
                    height={"100px"}
                    width="100px"
                  />
                  <Text>{nft.metadata.id}</Text>
                </Box>
              ))}
            </SimpleGrid>
          )
        ) : (
          <>
            <Spinner color="white" />
            <Text>Loading your NFTs...</Text>
          </>
        )}
        <Button
          bg="black"
          textColor={"white"}
          _hover={{
            bg: "white",
            textColor: "black",
            transform: "scale(1.02)",
          }}
          _active={{
            bg: "white",
            textColor: "black",
            transform: "scale(0.98)",
          }}
          onClick={async () => {
            setStaking(true);
            if (!ownedNfts) {
              toast({
                title: "No NFTs",
                description: "You have no NFTs to stake",
                status: "error",
                duration: 9000,
                isClosable: true,
              });
              setStaking(false);
              return;
            }
            try {
              const allowance = await nftContract?.call("isApprovedForAll", [
                address,
                "0xF438656BA70d90aD71e09E46F36fa78c883e93ac",
              ]);

              if (!allowance) {
                await nftContract?.call("setApprovalForAll", [
                  "0xF438656BA70d90aD71e09E46F36fa78c883e93ac",
                  true,
                ]);
              }

              const stake = await nftStakingContract?.call(
                "stake",
                [goozy, ownedNfts?.map((nft) => nft.metadata.id)],
                {
                  value: toWei(Number(toEther(chargeStake)) * ownedNfts.length),
                },
              );
              toast({
                title: "Staked NFTs",
                description: "You have successfully staked your NFTs",
                status: "success",
                duration: 9000,
                isClosable: true,
              });
              refetcher();
              setStaking(false);
            } catch (error) {
              console.error(error);
              toast({
                title: "Error",
                description: "Something went wrong",
                status: "error",
                duration: 9000,
                isClosable: true,
              });
              setStaking(false);
            }
          }}
          w="85%"
          isLoading={staking}
          loadingText="Staking..."
          border="2px solid #8ff000"
        >
          Stake All NFTS
        </Button>
      </VStack>

      <VStack
        m="auto"
        as={Flex}
        textAlign={"center"}
        w={{ base: "95%", lg: "60%" }}
        border="1px solid #8ff000"
        borderRadius={"md"}
        p={4}
        justifyContent={"space-between"}
        bg="black"
      >
        <Text>Staked NFTs:</Text>
        {!isLoadingGetUserStakedNFTsForCollection ? (
          getUserStakedNFTsForCollection?.length < 1 ? (
            <Text
              textColor={"white"}
              border="1px solid #8ff000"
              borderRadius={"md"}
              p={4}
            >
              No Staked Nfts To Display
            </Text>
          ) : (
            <SimpleGrid
              columns={[2, 4, 5]}
              gap={4}
              spacing={4}
              maxH={{ base: 320, lg: 480 }}
              maxW={640}
              overflow={"scroll"}
              border={"2px solid #8ff000"}
              p={2}
              borderRadius={"md"}
            >
              {getUserStakedNFTsForCollection?.map((id: number) => (
                <Box
                  key={id}
                  textAlign={"center"}
                  justifyContent={"center"}
                  maxH={150}
                  maxW={150}
                  border="2px solid #8ff000"
                  p={2}
                  borderRadius={"md"}
                >
                  <Image
                    src={`https://bafybeic67snx2pqesha6xkryuhfzw7hlkvxm4avf5opqsuz2dwy6nacgzi.ipfs.nftstorage.link/${id}.jpg`}
                    alt="NFT"
                    height={"100px"}
                    width="100px"
                  />
                  <Text>{id?.toString()}</Text>
                </Box>
              ))}
            </SimpleGrid>
          )
        ) : (
          <>
            <Spinner color="white" />
            <Text>Loading your NFTs...</Text>
          </>
        )}
        <Button
          bg="black"
          textColor={"white"}
          _hover={{
            bg: "white",
            textColor: "black",
            transform: "scale(1.02)",
          }}
          _active={{
            bg: "white",
            textColor: "black",
            transform: "scale(0.98)",
          }}
          onClick={async () => {
            setUnstaking(true);
            try {
              const unstake = await nftStakingContract?.call(
                "withdraw",
                [goozy, getUserStakedNFTsForCollection],
                {
                  value: toWei(
                    Number(toEther(chargeStake)) *
                      getUserStakedNFTsForCollection.length,
                  ),
                },
              );
              toast({
                title: "Unstaked NFTs",
                description: "You have successfully unstaked your NFTs",
                status: "success",
              });

              refetcher();
              setUnstaking(false);
            } catch (error) {
              console.error(error);
              toast({
                title: "Error",
                description: "Something went wrong",
                status: "error",
              });
              setUnstaking(false);
            }
          }}
          w="85%"
          isLoading={unstaking}
          loadingText="Unstaking..."
          border="2px solid #8ff000"
        >
          Unstake All NFTS
        </Button>
      </VStack>

      <VStack
        m="auto"
        as={Flex}
        textAlign={"center"}
        w={{ base: "95%", lg: "60%" }}
        border="1px solid #8ff000"
        borderRadius={"md"}
        p={4}
        justifyContent={"space-between"}
        bg="black"
      >
        <HStack
          _hover={{
            bg: "transparent",
            opacity: 0.9,
            transform: "scale(1.02)",
            cursor: "pointer",
            color: "white",
          }}
          transition={"all 0.1s ease-in-out"}
          borderRadius={"xl"}
          justifyContent="center"
          alignItems="center"
          fontSize={{ base: "sm", md: "md", lg: "lg" }}
          opacity={0.9}
          bg="transparent"
          p={4}
          textColor={"white"}
          maxW={600}
          minW="100%"
        >
          {" "}
          <Text
            textColor={"white"}
            bg="#000000"
            p={2}
            borderRadius={"md"}
            w="100%"
            border="2px solid #8ff000"
          >
            Your Balance:
          </Text>
          <Text
            textColor={"black"}
            bg="#FFFFFF"
            p={2}
            borderRadius={"md"}
            w="100%"
            border="2px solid #8ff000"
          >
            {tokenBalance ? Number(tokenBalance?.displayValue).toFixed(4) : "0"}
          </Text>
        </HStack>
        <HStack
          _hover={{
            bg: "transparent",
            opacity: 0.9,
            transform: "scale(1.02)",
            cursor: "pointer",
            color: "white",
          }}
          transition={"all 0.1s ease-in-out"}
          borderRadius={"xl"}
          justifyContent="center"
          alignItems="center"
          fontSize={{ base: "sm", md: "md", lg: "lg" }}
          opacity={0.9}
          bg="transparent"
          p={4}
          textColor={"white"}
          maxW={600}
          minW="100%"
        >
          {" "}
          <Text
            textColor={"white"}
            bg="#000000"
            p={2}
            borderRadius={"md"}
            w="100%"
            border="2px solid #8ff000"
          >
            Your Earned Rewards:
          </Text>
          <Text
            textColor={"black"}
            bg="#FFFFFF"
            p={2}
            borderRadius={"md"}
            w="100%"
            border="2px solid #8ff000"
          >
            {earned ? Number(toEther(earned)).toFixed(4) : "0"}
          </Text>
        </HStack>

        <HStack
          _hover={{
            bg: "transparent",
            opacity: 0.9,
            transform: "scale(1.02)",
            cursor: "pointer",
            color: "white",
          }}
          transition={"all 0.1s ease-in-out"}
          borderRadius={"xl"}
          justifyContent="center"
          alignItems="center"
          fontSize={{ base: "sm", md: "md", lg: "lg" }}
          opacity={0.9}
          bg="transparent"
          p={4}
          textColor={"white"}
          maxW={600}
          minW="100%"
        >
          {" "}
          <Text
            textColor={"white"}
            bg="#000000"
            p={2}
            borderRadius={"md"}
            w="100%"
            border="2px solid #8ff000"
          >
            Your Total Staked NFTS:
          </Text>
          <Text
            textColor={"black"}
            bg="#FFFFFF"
            p={2}
            borderRadius={"md"}
            w="100%"
            border="2px solid #8ff000"
          >
            {balanceOf ? balanceOf?.toString() : "0"}
          </Text>
        </HStack>
        <Button
          bg="black"
          border="2px solid #8ff000"
          textColor={"white"}
          _hover={{
            bg: "white",
            textColor: "black",
            transform: "scale(1.02)",
          }}
          _active={{
            bg: "white",
            textColor: "black",
            transform: "scale(0.98)",
          }}
          onClick={async () => {
            setClaiming(true);
            try {
              const claim = await nftStakingContract?.call("claim", [goozy], {
                value: chargeStake,
              });
              toast({
                title: "Claimed Rewards",
                description: "You have successfully claimed your rewards",
                status: "success",
                duration: 9000,
                isClosable: true,
              });
              refetcher();
              setClaiming(false);
            } catch (error) {
              console.error(error);
              toast({
                title: "Error",
                description: "Something went wrong",
                status: "error",
                duration: 9000,
                isClosable: true,
              });
              setClaiming(false);
            }
          }}
          isLoading={claiming}
          loadingText="Claiming..."
          w="97%"
        >
          Claim Rewards
        </Button>
        <HStack
          _hover={{
            bg: "transparent",
            opacity: 0.9,
            transform: "scale(1.02)",
            cursor: "pointer",
            color: "white",
          }}
          transition={"all 0.1s ease-in-out"}
          borderRadius={"xl"}
          justifyContent="center"
          alignItems="center"
          fontSize={{ base: "sm", md: "md", lg: "lg" }}
          opacity={0.9}
          bg="transparent"
          p={4}
          textColor={"white"}
          maxW={600}
          minW="100%"
        >
          {" "}
          <Text
            textColor={"white"}
            bg="#000000"
            p={2}
            borderRadius={"md"}
            w="100%"
            border="2px solid #8ff000"
          >
            Total NFTS Staked:
          </Text>
          <Text
            textColor={"black"}
            bg="#FFFFFF"
            p={2}
            borderRadius={"md"}
            w="100%"
            justifyContent={"center"}
            alignContent={"center"}
            textAlign={"center"}
            border="2px solid #8ff000"
          >
            {chargeStake ? totalStaked?.toString() : "0"}
          </Text>
        </HStack>

        <HStack
          _hover={{
            bg: "transparent",
            opacity: 0.9,
            transform: "scale(1.02)",
            cursor: "pointer",
            color: "white",
          }}
          transition={"all 0.1s ease-in-out"}
          borderRadius={"xl"}
          justifyContent="center"
          alignItems="center"
          fontSize={{ base: "sm", md: "md", lg: "lg" }}
          opacity={0.9}
          bg="transparent"
          p={4}
          textColor={"white"}
          maxW={600}
          minW="100%"
        >
          {" "}
          <Text
            textColor={"white"}
            bg="#000000"
            p={2}
            borderRadius={"md"}
            w="100%"
            border="2px solid #8ff000"
          >
            Claim Fee:
          </Text>
          <Text
            textColor={"black"}
            bg="#FFFFFF"
            p={2}
            borderRadius={"md"}
            w="100%"
            border="2px solid #8ff000"
          >
            {chargeStake ? toEther(chargeStake?.toString()) : "0"} $NETZ
          </Text>
        </HStack>

        <HStack
          _hover={{
            bg: "transparent",
            opacity: 0.9,
            transform: "scale(1.02)",
            cursor: "pointer",
            color: "white",
          }}
          transition={"all 0.1s ease-in-out"}
          borderRadius={"xl"}
          justifyContent="center"
          alignItems="center"
          fontSize={{ base: "sm", md: "md", lg: "lg" }}
          opacity={0.9}
          bg="transparent"
          p={4}
          textColor={"white"}
          maxW={600}
          minW="100%"
        >
          {" "}
          <Text
            textColor={"white"}
            bg="#000000"
            p={2}
            borderRadius={"md"}
            w="100%"
            border="2px solid #8ff000"
          >
            Stake/Unstake Fee:
          </Text>
          <Text
            textColor={"black"}
            bg="#FFFFFF"
            p={2}
            borderRadius={"md"}
            w="100%"
            justifyContent={"center"}
            alignContent={"center"}
            textAlign={"center"}
            border="2px solid #8ff000"
          >
            {chargeStake ? toEther(chargeStake?.toString()) : "0"} $NETZ for
            every{" "}
            <Icon as={Image} src={"/banners/tinyslug_black.svg"} m="auto" />
          </Text>
        </HStack>
      </VStack>

      <p>Reward Per Token: {rewardPerToken?.toString()}</p>
      <p>Reward Rate: {rewardRate?.toString()}</p>
      <p>Rewards: {rewards?.toString()}</p>
    </VStack>
  );
};

export default NFTStake;
