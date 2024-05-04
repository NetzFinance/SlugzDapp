import {
  Button,
  Divider,
  Flex,
  Spinner,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import {
  toEther,
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import { NextPage } from "next";
import { useState } from "react";
import AddressCheck from "../components/Navigation/NoAddress";

const PRESALE_ABI = [
  { type: "constructor", stateMutability: "nonpayable", inputs: [] },
  {
    type: "event",
    name: "ClaimStartUpdated",
    inputs: [
      {
        type: "uint256",
        name: "prevValue",
        internalType: "uint256",
        indexed: false,
      },
      {
        type: "uint256",
        name: "newValue",
        internalType: "uint256",
        indexed: false,
      },
      {
        type: "uint256",
        name: "timestamp",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Initialized",
    inputs: [
      { type: "uint8", name: "version", internalType: "uint8", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        type: "address",
        name: "previousOwner",
        internalType: "address",
        indexed: true,
      },
      {
        type: "address",
        name: "newOwner",
        internalType: "address",
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Paused",
    inputs: [
      {
        type: "address",
        name: "account",
        internalType: "address",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TokensAdded",
    inputs: [
      {
        type: "address",
        name: "token",
        internalType: "address",
        indexed: true,
      },
      {
        type: "uint256",
        name: "noOfTokens",
        internalType: "uint256",
        indexed: false,
      },
      {
        type: "uint256",
        name: "timestamp",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TokensClaimed",
    inputs: [
      { type: "address", name: "user", internalType: "address", indexed: true },
      {
        type: "uint256",
        name: "amount",
        internalType: "uint256",
        indexed: false,
      },
      {
        type: "uint256",
        name: "timestamp",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Unpaused",
    inputs: [
      {
        type: "address",
        name: "account",
        internalType: "address",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "baseDecimals",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "blacklistUsers",
    inputs: [
      {
        type: "address[]",
        name: "_usersToBlacklist",
        internalType: "address[]",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [{ type: "bool", name: "", internalType: "bool" }],
    name: "changeClaimStart",
    inputs: [{ type: "uint256", name: "_claimStart", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [{ type: "bool", name: "", internalType: "bool" }],
    name: "claim",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "claimStart",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "claimTime",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      { type: "uint256", name: "claimableAmount", internalType: "uint256" },
    ],
    name: "getClaimableAmount",
    inputs: [{ type: "address", name: "_user", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "initialize",
    inputs: [
      { type: "uint256", name: "_claimTime", internalType: "uint256" },
      { type: "uint256", name: "_percent", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "bool", name: "", internalType: "bool" }],
    name: "isBlacklisted",
    inputs: [{ type: "address", name: "", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "bool", name: "", internalType: "bool" }],
    name: "isWhitelisted",
    inputs: [{ type: "address", name: "", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "owner",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "pause",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "bool", name: "", internalType: "bool" }],
    name: "paused",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "percent",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "removeFromBlacklist",
    inputs: [
      {
        type: "address[]",
        name: "_userToRemoveFromBlacklist",
        internalType: "address[]",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "removeFromWhitelist",
    inputs: [
      {
        type: "address[]",
        name: "_userToRemoveFromWhitelist",
        internalType: "address[]",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "renounceOwnership",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "saleToken",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setClaimTime",
    inputs: [{ type: "uint256", name: "_claimTime", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setClaimWhitelistStatus",
    inputs: [{ type: "bool", name: "_status", internalType: "bool" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setPercent",
    inputs: [{ type: "uint256", name: "_percent", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "payable",
    outputs: [{ type: "bool", name: "", internalType: "bool" }],
    name: "startClaim",
    inputs: [
      { type: "uint256", name: "_claimStart", internalType: "uint256" },
      { type: "uint256", name: "noOfTokens", internalType: "uint256" },
      { type: "address", name: "_saleToken", internalType: "address" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "transferOwnership",
    inputs: [{ type: "address", name: "newOwner", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "unpause",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "updateFromETHandBSC",
    inputs: [
      { type: "address[]", name: "_users", internalType: "address[]" },
      { type: "uint256[]", name: "_userDeposits", internalType: "uint256[]" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      { type: "uint256", name: "depositAmount", internalType: "uint256" },
      { type: "uint256", name: "initialClaim", internalType: "uint256" },
      { type: "uint256", name: "claimedAmount", internalType: "uint256" },
    ],
    name: "userDeposits",
    inputs: [{ type: "address", name: "", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "bool", name: "", internalType: "bool" }],
    name: "whitelistClaimOnly",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "whitelistUsers",
    inputs: [
      {
        type: "address[]",
        name: "_usersToWhitelist",
        internalType: "address[]",
      },
    ],
  },
  { type: "receive", stateMutability: "payable" },
];

const Presale: NextPage = () => {
  const address = useAddress();
  const toast = useToast();
  const [claiming, isClaiming] = useState(false);

  const { contract: presaleContract } = useContract(
    "0xdf9FEbb8A36686bbCFb73B2392Af2D6D85853060",
    PRESALE_ABI,
  );

  const { data: getClaimableAmount } = useContractRead(
    presaleContract,
    "getClaimableAmount",
    [address], // Insert address to check claimable amount
  );

  const { mutateAsync: claim } = useContractWrite(presaleContract, "claim");

  async function claimPresale() {
    if (address) {
      isClaiming(true);
      try {
        const tx = await claim({});
        toast({
          title: "Claiming Presale",
          description: "Transaction sent",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        isClaiming(false);
      } catch (error) {
        toast({
          title: "Claiming Presale",
          description: "Transaction failed",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        isClaiming(false);
      }
    }
  }

  if (!address) {
    return <AddressCheck />;
  }

  return (
    <>
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
        spacing={4}
      >
        <Text>Presale Claims</Text>
        <Divider />
        <Text>
          Address: {address ? address : "Connect your wallet to claim"}
        </Text>
        <Divider />
        <Text>
          If you took part in the $NETZ Presale from MainnetZ then you may claim
          your pending $NETZ here.
        </Text>
        <Divider />
        <Text>
          Claimable amount:{" "}
          {getClaimableAmount && getClaimableAmount > 0 ? (
            parseFloat(toEther(getClaimableAmount)).toFixed(2).toString() +
            `${""} $NETZ`
          ) : getClaimableAmount && getClaimableAmount === 0 ? (
            "You have nothing to claim"
          ) : !getClaimableAmount ? (
            "You have nothing to claim."
          ) : (
            <Spinner />
          )}
        </Text>
        <Divider />
        <Button
          border="2px solid #8ff000"
          borderRadius="md"
          onClick={() => claimPresale()}
          disabled={claiming}
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
          w="100%"
        >
          {claiming ? "Claiming..." : "Claim"}
        </Button>
      </VStack>
    </>
  );
};

export default Presale;
