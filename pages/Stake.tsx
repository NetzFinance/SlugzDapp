import {
  Box,
  Button,
  Divider,
  HStack,
  Heading,
  Input,
  SlideFade,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import {
  toWei,
  useAddress,
  useBalance,
  useContract,
  useContractRead,
  useSDK,
} from "@thirdweb-dev/react";
import { NextPage } from "next";
import { useState } from "react";

import ERC20_ABI from "../abis/ERC20.json";

import { ethers } from "ethers";
import STAKING_ABI from "../abis/TokenStaking.json";
import AddressCheck from "../components/Navigation/NoAddress";
import { formatNumber } from "../utils/Formatters/FormatNumber";
import useGeckoGetSLUGZ from "../utils/Hooks/useGeckoGetSLUGZ";
import { fadeIn } from "../utils/Ui/Animations";

interface Data {
  id: string;
  type: string;
  attributes: {
    address: string;
    name: string;
    symbol: string;
    image_url: string;
    coingecko_coin_id: null | string;
    decimals: number;
    total_supply: string;
    price_usd: string;
    fdv_usd: string;
    total_reserve_in_usd: string;
    volume_usd: {
      h24: string;
    };
    market_cap_usd: null | string;
  };
  relationships: {
    top_pools: {
      data: Array<{
        id: string;
        type: string;
      }>;
    };
  };
}

interface TokenInfoProps {
  data: Data;
}

const Stake: NextPage = () => {
  const address = useAddress();

  if (!address) {
    return <AddressCheck />;
  }

  const [amount, setAmount] = useState("");

  const [withdrawing, isWithdrawing] = useState(false);
  const [staking, isStaking] = useState(false);
  const [claiming, isClaiming] = useState(false);

  const netzFi = "0x19b376c4493dca3902b90f726ee79c2dbcf8532a";
  const stakingCa = "0x8a712503C8Cf297cfD2173a0dc537c3E10a55bD5";

  const toast = useToast();

  const sdk = useSDK();

  const { data: NETZFIData } = useGeckoGetSLUGZ();

  const { contract: stakingContract } = useContract(
    stakingCa, //"0xc4CB51150B8F7A0Ce483E966ec2b9e644e62A383",
    STAKING_ABI,
  );

  const { data: balanceOf, refetch: refetchBalanceOf } = useContractRead(
    stakingContract,
    "balanceOf",
    [address || ""],
  );

  const { data: totalSupply, refetch: refetchTotalSupply } = useContractRead(
    stakingContract,
    "totalSupply",
    [],
  );

  const { data: earned, refetch: refetchEarned } = useContractRead(
    stakingContract,
    "earned",
    [address || ""],
  );
  const { data: stakingToken } = useContractRead(
    stakingContract,
    "stakingToken",
    [],
  );

  const { contract: stakingTokenContract } = useContract(
    stakingToken,
    ERC20_ABI,
  );

  const { data: finishAt, refetch: refetchFinishAt } = useContractRead(
    stakingContract,
    "finishAt",
  );
  const { data: chargeClaim, refetch: refetchChargeClaim } = useContractRead(
    stakingContract,
    "chargeClaim",
  );

  const { data: allowance, refetch: refetchAllowance } = useContractRead(
    stakingTokenContract,
    "allowance",
    [address, stakingCa],
  );

  const { data: balance, refetch: refetchBal } = useBalance();
  const { data: NETZFIBalance, refetch: refetchNetzfiBal } = useBalance(netzFi);

  const { data: viewBalance, refetch: refetchViewBalance } = useContractRead(
    stakingContract,
    "viewBalance",
    [netzFi],
  );
  const { data: totalRewards, refetch: refetchTotalRewards } = useContractRead(
    stakingContract,
    "totalRewards",
    [],
  );

  //formatting

  const formattedAllowance =
    (allowance && ethers.utils.formatUnits(allowance, 18)) || 0;

  const formattedDate =
    (finishAt && new Date(finishAt * 1000).toLocaleString()) || Date.now();

  const formattedEarned =
    (earned &&
      Number(ethers.utils.formatUnits(earned, 18)).toFixed(2).toString()) ||
    0;

  const formattedBalance =
    (balanceOf &&
      Number(ethers.utils.formatUnits(balanceOf, 18)).toFixed(2).toString()) ||
    0;

  const NETZFIUsd =
    NETZFIData && typeof NETZFIData !== "string"
      ? NETZFIData.attributes.price_usd
      : 0;

  const totalRewardsUsd =
    (totalRewards &&
      NETZFIUsd &&
      Number(ethers.utils.formatUnits(totalRewards, 18)) * Number(NETZFIUsd)) ||
    0;

  const totalStakedUsd =
    (totalSupply &&
      NETZFIUsd &&
      Number(Number(ethers.utils.formatUnits(totalSupply, 18))) *
        Number(NETZFIUsd)) ||
    0;
  const apy =
    (totalRewardsUsd &&
      totalStakedUsd &&
      (totalRewardsUsd / totalStakedUsd) * 100) ||
    0;
  //functions

  async function stake() {
    if (address) {
      isStaking(true);
      try {
        const netzFiBalance = NETZFIBalance && NETZFIBalance?.displayValue;
        const balanceNative = balance && balance?.value?.toString();

        if (
          balanceNative &&
          parseFloat(chargeClaim) > parseFloat(balanceNative)
        ) {
          toast({
            title: "Staking Error",
            description: "Insufficient $NETZ Balance to pay fee",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          isStaking(false);
          return;
        }

        if (netzFiBalance && parseFloat(amount) > parseFloat(netzFiBalance)) {
          toast({
            title: "Staking Error",
            description: "Insufficient $SLUGZ Balance",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          isStaking(false);
          return;
        }

        const allowance = await stakingTokenContract?.call("allowance", [
          address,
          stakingCa,
        ]);

        if (allowance && Number(NETZFIBalance?.value) > parseFloat(allowance)) {
          const approve = await stakingTokenContract?.call("approve", [
            stakingCa,
            NETZFIBalance?.value,
          ]);
        }

        const stake = await stakingContract?.call(
          "stake",
          [NETZFIBalance?.value],
          {
            value: chargeClaim,
          },
        );
        toast({
          title: "Staking Succesful",
          description: `Your stake of ${amount} $SLUGZ has been completed.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        isStaking(false);
        refetcher();
      } catch (error) {
        isStaking(false);
        toast({
          title: "Staking",
          description: `Staking Failed, please screenshot this and report to staff for help. ${error}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  }

  async function withdraw() {
    if (address) {
      isWithdrawing(true);
      try {
        const balanceNative = balance && balance?.value?.toString();
        if (
          balanceNative &&
          parseFloat(chargeClaim) > parseFloat(balanceNative)
        ) {
          toast({
            title: "Withdraw Error",
            description: "Insufficient $NETZ Balance to pay fee",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          isWithdrawing(false);
          return;
        }

        const balanceOfUser = balanceOf && Number(balanceOf);
        if (balanceOfUser && parseFloat(amount) > balanceOfUser) {
          toast({
            title: "Withdraw Error",
            description: `You do not have ${amount} $SLUGZ Tokens To Withdraw`,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          isWithdrawing(false);
          return;
        }

        const withdraw = await stakingContract?.call(
          "withdraw",
          [balanceOfUser],
          { value: chargeClaim },
        );
        toast({
          title: "Withdraw Successful",
          description:
            "Withdraw completed and staked tokens have been returned to your balance",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        isWithdrawing(false);
        refetcher();
      } catch (error) {
        isWithdrawing(false);
        toast({
          title: "Withdraw Error",
          description: `Withdraw Failed, please screenshot this and report to staff for help. ${error}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  }

  async function claim() {
    if (address) {
      isClaiming(true);
      try {
        const earnedRewards = earned && earned?.toString();
        if (earnedRewards && parseFloat(earnedRewards) === 0) {
          toast({
            title: "Claim Error",
            description:
              "You have no rewards to claim, please try again later or stake $SLUGZ now to start earning",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          isClaiming(false);
          return;
        }

        const claim = await stakingContract?.call("getReward", [], {
          value: chargeClaim,
        });
        toast({
          title: "Claim Succesful",
          description: "Claim Successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        isClaiming(false);
        refetcher();
      } catch (error) {
        isClaiming(false);
        toast({
          title: "Claim Error",
          description: `Claim Failed, please screenshot this and report to staff for help. ${error}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  }

  function refetcher() {
    refetchBalanceOf();
    refetchEarned();
    refetchFinishAt();
    refetchChargeClaim();
    refetchAllowance();
    refetchBal();
    refetchNetzfiBal();
    refetchViewBalance();
    refetchTotalRewards();
    refetchTotalSupply();
  }
  if (!address) {
    return <AddressCheck />;
  }
  return (
    <SlideFade in={true} offsetY="40px">
      <Box
        bg="transparent"
        alignContent={"center"}
        justifyContent={"center"}
        textAlign={"center"}
      >
        <Heading textColor={"white"} textAlign={"center"}>
          $SLUGZ Stake Stats
        </Heading>
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
          <Text
            textColor={"white"}
            bg="#000000"
            p={2}
            borderRadius={"md"}
            w="100%"
          >
            Total Rewards
          </Text>
          <Text
            textColor={"black"}
            bg="#FFFFFF"
            p={2}
            borderRadius={"md"}
            w="100%"
          >
            {totalRewards
              ? Number(
                  ethers.utils.formatUnits(totalRewards?.toString(), 18),
                ).toLocaleString()
              : "0"}{" "}
          </Text>
          <Text
            textColor={"black"}
            bg="#FFFFFF"
            p={2}
            borderRadius={"md"}
            w="100%"
          >
            ${totalRewardsUsd ? Number(totalRewardsUsd).toLocaleString() : "0"}{" "}
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
          <Text
            textColor={"white"}
            bg="#000000"
            p={2}
            borderRadius={"md"}
            w="100%"
          >
            All Staked tokens
          </Text>
          <Text
            textColor={"black"}
            bg="#FFFFFF"
            p={2}
            borderRadius={"md"}
            w="100%"
          >
            {totalSupply
              ? Number(
                  Number(ethers.utils.formatUnits(totalSupply, 18)),
                ).toLocaleString()
              : "0"}
          </Text>
          <Text
            textColor={"black"}
            bg="#FFFFFF"
            p={2}
            borderRadius={"md"}
            w="100%"
          >
            ${totalStakedUsd ? totalStakedUsd?.toLocaleString() : "0"}
          </Text>
        </HStack>{" "}
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
        >
          <Text
            textColor={"white"}
            bg="#000000"
            p={2}
            borderRadius={"md"}
            w="100%"
          >
            Staked $SLUGZ
          </Text>
          <Text
            textColor={"black"}
            bg="#FFFFFF"
            p={2}
            borderRadius={"md"}
            w="100%"
          >
            {formattedBalance ? formattedBalance : "0"}
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
          <Text
            textColor={"white"}
            bg="#000000"
            p={2}
            borderRadius={"md"}
            w="100%"
          >
            $SLUGZ Rewards
          </Text>
          <Text
            textColor={"black"}
            bg="#FFFFFF"
            p={2}
            borderRadius={"md"}
            w="100%"
          >
            {formattedEarned ? formattedEarned : "0"}
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
          <Text
            textColor={"white"}
            bg="#000000"
            p={2}
            borderRadius={"md"}
            w="100%"
          >
            Total APR%
          </Text>
          <Text
            textColor={"black"}
            bg="#FFFFFF"
            p={2}
            borderRadius={"md"}
            w="100%"
          >
            {apy ? `${apy?.toFixed(0)} %` : "0"}
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
          <Text
            textColor={"white"}
            bg="#000000"
            p={2}
            borderRadius={"md"}
            w="100%"
          >
            Ends
          </Text>
          <Text
            textColor={"black"}
            bg="#FFFFFF"
            p={2}
            borderRadius={"md"}
            w="100%"
          >
            {finishAt ? formattedDate : "0"}
          </Text>
        </HStack>
        <Divider border="2px solid white" mb={4} />
        <HStack
          maxW={600}
          w="100%"
          m="auto"
          justifyContent={"space-between"}
          p={4}
          bg="#000000"
          borderRadius={"md"}
        >
          <Text textColor={"white"}>
            Your $NETZ:{" "}
            {balance
              ? balance && parseFloat(balance.displayValue).toFixed(2)
              : "0"}
          </Text>

          <Text textColor={"white"}>
            Your $SLUGZ:{" "}
            {NETZFIBalance
              ? NETZFIBalance &&
                parseFloat(NETZFIBalance.displayValue).toFixed(2)
              : "0"}
          </Text>
        </HStack>
        <Input
          mt={4}
          textColor={"black"}
          placeholder="Amount To Stake"
          maxW={600}
          bg="#FFFFFF"
          textAlign={"center"}
          _placeholder={{ textColor: "black" }}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button
          _hover={{
            bg: "transparent",
            opacity: 0.9,
            transform: "scale(1.02)",
            cursor: "pointer",
            color: "white",
          }}
          transition={"all 0.1s ease-in-out"}
          maxW={600}
          textColor={"black"}
          bg="#8ff000"
          w="100%"
          mt={4}
          border="1px solid white"
          p={2}
          borderRadius={"md"}
          onClick={async () => {
            if (address) {
              isStaking(true);
              try {
                const netzFiBalance =
                  NETZFIBalance && NETZFIBalance?.displayValue;
                const balanceNative = balance && balance?.value?.toString();

                if (
                  balanceNative &&
                  parseFloat(chargeClaim) > parseFloat(balanceNative)
                ) {
                  toast({
                    title: "Staking Error",
                    description: "Insufficient $NETZ Balance to pay fee",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  });
                  isStaking(false);
                  return;
                }

                if (
                  netzFiBalance &&
                  parseFloat(amount) > parseFloat(netzFiBalance)
                ) {
                  toast({
                    title: "Staking Error",
                    description: "Insufficient $SLUGZ Balance",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  });
                  isStaking(false);
                  return;
                }

                const allowance = await stakingTokenContract?.call(
                  "allowance",
                  [address, stakingCa],
                );

                if (allowance && parseFloat(amount) > parseFloat(allowance)) {
                  const approve = await stakingTokenContract?.call("approve", [
                    stakingCa,
                    ethers.utils.parseUnits(amount, 18),
                  ]);
                }

                const stake = await stakingContract?.call(
                  "stake",
                  [ethers.utils.parseUnits(amount, 18)],
                  {
                    value: chargeClaim,
                  },
                );
                toast({
                  title: "Staking Succesful",
                  description: `Your stake of ${amount} $SLUGZ has been completed.`,
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
                isStaking(false);
                refetcher();
              } catch (error) {
                isStaking(false);
                toast({
                  title: "Staking",
                  description: `Staking Failed, please screenshot this and report to staff for help. ${error}`,
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                });
              }
            }
          }}
          isLoading={staking}
          loadingText="Staking"
        >
          Stake {amount} $SLUGZ
        </Button>
        <Button
          _hover={{
            bg: "transparent",
            opacity: 0.9,
            transform: "scale(1.02)",
            cursor: "pointer",
            color: "white",
          }}
          transition={"all 0.1s ease-in-out"}
          textColor={"black"}
          bg="#8ff000"
          w="100%"
          maxW={600}
          mt={4}
          border="1px solid white"
          onClick={async () => {
            if (address) {
              isWithdrawing(true);
              try {
                const netzFiBalance = balanceOf && balanceOf;
                const balanceNative = balance && balance?.value?.toString();

                if (
                  balanceNative &&
                  parseFloat(chargeClaim) > parseFloat(balanceNative)
                ) {
                  toast({
                    title: "Withdraw Error",
                    description: "Insufficient $NETZ Balance to pay fee",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  });
                  isStaking(false);
                  return;
                }

                const withdraw = await stakingContract?.call(
                  "withdraw",
                  [ethers.utils.parseUnits(amount, 18)],
                  {
                    value: chargeClaim,
                  },
                );
                toast({
                  title: "Withdraw Succesful",
                  description: `Your Withdraw of ${amount} $SLUGZ has been completed.`,
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
                isWithdrawing(false);
                refetcher();
              } catch (error) {
                isWithdrawing(false);
                toast({
                  title: "Withdraw Error",
                  description: `Withdraw Failed, please screenshot this and report to staff for help. ${error}`,
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                });
              }
            }
          }}
          isLoading={withdrawing}
          loadingText="Withdrawing"
        >
          Withdraw {amount} $SLUGZ
        </Button>
        <Button
          _hover={{
            bg: "transparent",
            opacity: 0.9,
            transform: "scale(1.02)",
            cursor: "pointer",
            color: "white",
          }}
          transition={"all 0.1s ease-in-out"}
          textColor={"black"}
          bg="#8ff000"
          w="100%"
          maxW={600}
          mt={4}
          border="1px solid white"
          onClick={stake}
          borderRadius={"xl"}
          isLoading={staking}
          loadingText="Staking"
          p={2}
        >
          Stake All Tokens
        </Button>
        {formattedBalance > 0 && (
          <Button
            _hover={{
              bg: "transparent",
              opacity: 0.9,
              transform: "scale(1.02)",
              cursor: "pointer",
              color: "white",
            }}
            transition={"all 0.1s ease-in-out"}
            onClick={withdraw}
            borderRadius={"xl"}
            isLoading={withdrawing}
            loadingText="Withdrawing"
            textColor={"black"}
            bg="#8ff000"
            w="100%"
            maxW={600}
            mt={4}
            border="1px solid white"
            p={2}
          >
            Withdraw All My Tokens
          </Button>
        )}
        <Button
          _hover={{
            bg: "transparent",
            opacity: 0.9,
            transform: "scale(1.02)",
            cursor: "pointer",
            color: "white",
          }}
          transition={"all 0.1s ease-in-out"}
          textColor={"black"}
          bg="#8ff000"
          w="100%"
          maxW={600}
          mt={4}
          border="1px solid white"
          onClick={claim}
          borderRadius={"xl"}
          isLoading={claiming}
          loadingText="Claiming"
          p={2}
        >
          Claim Rewards
        </Button>
      </Box>
    </SlideFade>
  );
};

export default Stake;
