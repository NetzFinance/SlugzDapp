import {
  Heading,
  Box,
  Text,
  Divider,
  Button,
  SimpleGrid,
  VStack,
  Image,
  useToast,
} from "@chakra-ui/react";
import { Ethereum, ZMainnet } from "@thirdweb-dev/chains";
import {
  toEther,
  useAddress,
  useBalance,
  useChainId,
  useContract,
  useContractEvents,
  useReadonlySDK,
  useSDKChainId,
  useSwitchChain,
  useTransferNativeToken,
  useWatchTransactions,
} from "@thirdweb-dev/react";
import { Transaction } from "ethers";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

type NetzApiV2Transactions = {
  timestamp: string;
  fee: {
    type: string;
    value: string;
  };
  gas_limit: string;
  block: number;
  status: string;
  method: null;
  confirmations: number;
  type: number;
  exchange_rate: string;
  to: {
    ens_domain_name: null;
    hash: string;
    implementation_name: null;
    is_contract: boolean;
    is_verified: boolean;
    name: null;
    private_tags: string[];
    public_tags: string[];
    watchlist_names: string[];
  };
  tx_burnt_fee: null;
  max_fee_per_gas: null;
  result: string;
  hash: string;
  gas_price: string;
  priority_fee: null;
  base_fee_per_gas: null;
  from: {
    ens_domain_name: null;
    hash: string;
    implementation_name: null;
    is_contract: boolean;
    is_verified: null;
    name: null;
    private_tags: string[];
    public_tags: string[];
    watchlist_names: string[];
  };
  token_transfers: string[];
  tx_types: string[];
  gas_used: string;
  created_contract: null;
  position: number;
  nonce: number;
  has_error_in_internal_txs: boolean;
  actions: string[];
  decoded_input: null;
  token_transfers_overflow: boolean;
  raw_input: string;
  value: string;
  max_priority_fee_per_gas: null;
  revert_reason: null;
  confirmation_duration: number[];
  tx_tag: null;
};

const OTC: NextPage = () => {
  const netzBridge = "0xe5AACbA8e0C3D0f2735164E1A81D6AD3a6414E0D";
  const receiver = "0xe6b792e0231df8c5D3a70717C48c6026b09866E7";

  const [transferAmount, setTransferAmount] = useState("0.1");
  const [notifiedTransactions, setNotifiedTransactions] = useState<
    string[] | undefined
  >([]);

  const address = useAddress();
  const chainId = useChainId();
  const switchChain = useSwitchChain();
  const router = useRouter();
  const toast = useToast();
  const { data: balance } = useBalance();

  const {
    mutateAsync: transfer,
    isLoading: isLoadingTransfer,
    error: transferError,
    isSuccess: transferSuccess,
  } = useTransferNativeToken();

  const transactions = useWatchTransactions({
    address: "0xe6b792e0231df8c5D3a70717C48c6026b09866E7",
    network: ZMainnet,
  });

  //https://netzexplorer.io/api/v2/transactions/

  transactions?.map((transaction: Transaction) => {
    if (
      transaction.to === address &&
      transaction.hash && // Ensure hash is defined
      (!notifiedTransactions?.includes(transaction.hash) ?? true)
    ) {
      toast({
        title: "New Transaction",
        description: `You received ${toEther(transaction.value)} ETH`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      if (transaction.hash) {
        // Ensure hash is defined
        setNotifiedTransactions([
          ...(notifiedTransactions ?? []),
          transaction.hash,
        ]);
      }
    }
  });

  if (!address) {
    return (
      <Box
        bg="transparent"
        p={4}
        maxW={800}
        m="auto"
        textAlign={"center"}
        textColor="white"
      >
        <Text>Connect your wallet to view this page</Text>
      </Box>
    );
  }

  if (chainId !== ZMainnet.chainId) {
    return (
      <Box
        bg="transparent"
        p={4}
        maxW={800}
        m="auto"
        textAlign={"center"}
        textColor="white"
      >
        <Text>Switch to MainnetZ to view this page</Text>
        <button onClick={() => switchChain(ZMainnet.chainId)}>
          Switch to MainnetZ
        </button>
      </Box>
    );
  }

  return (
    <>
      <Heading
        textColor={"white"}
        color="white"
        bg="black"
        border="1px solid #8ff000"
        p={4}
        borderRadius={"md"}
      >
        Please select a network:
      </Heading>

      <SimpleGrid
        columns={[2, 2]}
        spacing={10}
        bg="transparent"
        p={4}
        maxW={800}
        textAlign={"center"}
        textColor="white"
      >
        <VStack
          bg="black"
          border="1px solid #8ff000"
          p={4}
          borderRadius={"md"}
          onClick={() => router.push("/OTC/Eth")}
          textColor={"white"}
          _hover={{ transform: "scale(1.05)", cursor: "pointer" }}
          transition={"transform .2s ease-in-out"}
        >
          <Image
            src={"/tokens/ETH.png"}
            alt="Ethereum"
            h={{ base: "60px", md: "150px" }}
            w={{ base: "60px", md: "150px" }}
          />
          <Text>Ethereum Mainnet</Text>
        </VStack>
        <VStack
          bg="black"
          border="1px solid #8ff000"
          p={4}
          borderRadius={"md"}
          onClick={() => router.push("/OTC/Bnb")}
          textColor={"white"}
          _hover={{ transform: "scale(1.05)", cursor: "pointer" }}
          transition={"transform .2s ease-in-out"}
        >
          <Image
            src={"/tokens/BNB.png"}
            alt="Binance"
            h={{ base: "60px", md: "150px" }}
            w={{ base: "60px", md: "150px" }}
          />
          <Text>Binance Smart Chain</Text>
        </VStack>
      </SimpleGrid>
    </>
  );
};

export default OTC;
