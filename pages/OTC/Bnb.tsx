import {
  Heading,
  Box,
  Text,
  Divider,
  Button,
  useToast,
  Input,
} from "@chakra-ui/react";
import { Binance, Ethereum, ZMainnet } from "@thirdweb-dev/chains";
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
import { useEffect, useState } from "react";

interface AddressData {
  block_number_balance_updated_at: number;
  coin_balance: string;
  creation_tx_hash: null;
  creator_address_hash: null;
  ens_domain_name: null;
  exchange_rate: string;
  has_beacon_chain_withdrawals: boolean;
  has_custom_methods_read: boolean;
  has_custom_methods_write: boolean;
  has_decompiled_code: boolean;
  has_logs: boolean;
  has_methods_read: boolean;
  has_methods_read_proxy: boolean;
  has_methods_write: boolean;
  has_methods_write_proxy: boolean;
  has_token_transfers: boolean;
  has_tokens: boolean;
  has_validated_blocks: boolean;
  hash: string;
  implementation_address: null;
  implementation_name: null;
  is_contract: boolean;
  is_verified: null;
  name: null;
  private_tags: any[];
  public_tags: any[];
  token: null;
  watchlist_address_id: null;
  watchlist_names: any[];
}

const Bnb: NextPage = () => {
  const netzBridge = "0xe5AACbA8e0C3D0f2735164E1A81D6AD3a6414E0D";
  const receiver = "0xe6b792e0231df8c5D3a70717C48c6026b09866E7";
  const [notifiedTransactions, setNotifiedTransactions] = useState<
    string[] | undefined
  >([]);
  const [transferAmount, setTransferAmount] = useState("0.1");
  const [transferring, setTransferring] = useState(false);
  const [netzPrice, setNetzPrice] = useState<number | null>(null);
  const [ethereumPrice, setEthereumPrice] = useState<number | null>(null);
  const address = useAddress();
  const chainId = useChainId();
  const switchChain = useSwitchChain();
  const router = useRouter();
  const toast = useToast();
  const { data: balance, refetch: refetchBalance } = useBalance();
  const [netzbalance, setBalance] = useState<string | null>(null);

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

  const received = useWatchTransactions({
    address: "0xe6b792e0231df8c5D3a70717C48c6026b09866E7",
    network: Binance,
  });

  async function getRemainingNetzBalanceFromOtc() {
    const response = await fetch(
      "https://netzexplorer.io/api/v2/addresses/0xe6b792e0231df8c5D3a70717C48c6026b09866E7",
    );

    const data: AddressData = await response.json();

    return data.coin_balance;
  }

  async function getEthereumPrice(): Promise<number | null> {
    try {
      const response = await fetch(
        "https://pro-api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd", //ids=ethereum
        {
          headers: { "X-Cg-Pro-Api-Key": "CG-HUF6zYd2bGytXhU661iuqJrG" },
        },
      );

      const data = await response.json();
      return data.binancecoin?.usd || null;
    } catch (error) {
      console.error(`Error fetching Ethereum price: ${error}`);
      return null;
    }
  }

  async function getNetzPrice(): Promise<number | null> {
    try {
      const response = await fetch(
        "https://pro-api.coingecko.com/api/v3/simple/price?ids=mainnetz&vs_currencies=usd",
        {
          headers: { "X-Cg-Pro-Api-Key": "CG-HUF6zYd2bGytXhU661iuqJrG" },
        },
      );

      const data = await response.json();
      return data.mainnetz?.usd || null;
    } catch (error) {
      console.error(`Error fetching Netz token price: ${error}`);
      return null;
    }
  }

  //https://netzexplorer.io/api/v2/transactions/
  useEffect(() => {
    transactions?.map((transaction: Transaction) => {
      if (
        transaction.to?.toLowerCase() === address?.toLowerCase() &&
        transaction.hash && // Ensure hash is defined
        (!notifiedTransactions?.includes(transaction.hash) ?? true)
      ) {
        toast({
          title: "New Transaction",
          description: `You received ${toEther(transaction.value)} $NETZ`,
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
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
  }, [transactions]);

  useEffect(() => {
    received?.map((transaction: Transaction) => {
      if (
        transaction.from?.toLowerCase() === address?.toLowerCase() &&
        transaction.hash && // Ensure hash is defined
        (!notifiedTransactions?.includes(transaction.hash) ?? true)
      ) {
        toast({
          title: "New Transaction",
          description: `OTC Bridge received ${toEther(transaction.value)} BNB`,
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
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
  }, [received]);

  async function fetchPrices() {
    const netzPrice = await getNetzPrice();
    const ethereumPrice = await getEthereumPrice();
    const netzBalance = await getRemainingNetzBalanceFromOtc();
    const remainingNetzBalanceFromOtc = toEther(netzBalance);
    setBalance(
      remainingNetzBalanceFromOtc ? remainingNetzBalanceFromOtc : null,
    );
    setEthereumPrice(ethereumPrice ? ethereumPrice : null);
    setNetzPrice(netzPrice ? netzPrice : null);
  }

  useEffect(() => {
    fetchPrices();
  }, []);

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

  if (chainId !== Binance.chainId) {
    return (
      <Box
        bg="transparent"
        p={4}
        maxW={800}
        m="auto"
        textAlign={"center"}
        textColor="white"
      >
        <Text>Switch to Binance Smart Chain to view this page</Text>
        <button onClick={() => switchChain(Binance.chainId)}>
          Switch to Binance
        </button>
      </Box>
    );
  }

  return (
    <>
      <Box
        bg="transparent"
        p={2}
        maxW={{ base: "100%", md: "800px" }}
        textAlign={"center"}
        textColor="white"
        minW="100%"
      >
        <Button
          boxShadow={"rgb(89, 76, 145) 0px 0px 7px 4px"}
          border="2px solid rgb(15, 3, 37)"
          _hover={{
            bg: "transparent",
            opacity: 0.9,
            transform: "scale(1.02)",
            cursor: "pointer",
            color: "white",
          }}
          bg="transparent"
          w="100%"
          borderRadius={"xl"}
          textColor={"white"}
          p={2}
          onClick={() => router.push("/OTC")}
          transition={"transform .2s ease-in-out"}
          mb={10}
        >
          Go back
        </Button>
        <Text textAlign={"center"} mb={10}>
          Your BNB Balance: {balance?.displayValue} {balance?.symbol}
        </Text>
        <Divider mb={10} />
        <Text textAlign={"center"} mb={10}>
          Netz Price: ${netzPrice}
        </Text>

        <Text textAlign={"center"} mb={10}>
          BNB Price: ${ethereumPrice}
        </Text>

        <Divider mb={10} />
        <Text textAlign={"center"} mb={10}>
          Remaining NETZ Avaialble to purchase:{" "}
          {netzbalance ? netzbalance : "0"} NETZ
        </Text>
        <Text textAlign={"center"} mb={10}>
          Remaining value in USD to purchase:{" "}
          {netzPrice && netzbalance
            ? Number(netzPrice) * Number(netzbalance)
            : 0}{" "}
          USD
        </Text>

        <Text textAlign={"center"} mb={10}>
          Remaining value in BNB to purchase:{" "}
          {netzPrice && netzbalance && ethereumPrice
            ? (Number(netzPrice) * Number(netzbalance)) / ethereumPrice
            : 0}{" "}
          BNB
        </Text>

        <Divider mb={10} />

        <Button
          boxShadow={"rgb(89, 76, 145) 0px 0px 7px 4px"}
          border="2px solid rgb(15, 3, 37)"
          _hover={{
            bg: "transparent",
            opacity: 0.9,
            transform: "scale(1.02)",
            cursor: "pointer",
            color: "white",
          }}
          mb={10}
          transition={"all 0.1s ease-in-out"}
          bg="transparent"
          w="100%"
          borderRadius={"xl"}
          loadingText="Transferring"
          textColor={"white"}
          p={2}
          onClick={fetchPrices}
        >
          Refresh Prices
        </Button>
        <Text textAlign={"center"} mb={10}>
          You will receive approximately{" "}
          {netzPrice && transferAmount && ethereumPrice
            ? (Number(transferAmount) * ethereumPrice) / netzPrice
            : 0}{" "}
          NETZ tokens
        </Text>

        <Divider mb={10} />
        <Text textAlign={"center"} mb={10}>
          Use the custom build official @MainnetZ OTC bridge to purchase $NETZ
          directly with BNB.
        </Text>
        <Text textAlign={"center"} mb={10}>
          Step 1: transfer your chosen input amount of BNB to the OTC bridge
          using the transfer button.
        </Text>
        <Text textAlign={"center"} mb={10}>
          Step 2: wait for the transaction to be confirmed and reciept of tokens
          to be confirmed.
        </Text>
        <Text textAlign={"center"} mb={10}>
          Step 3: receive your NETZ tokens in your wallet in seconds with a
          confirmation and you're done!
        </Text>
        <Input
          textColor={"white"}
          boxShadow={"rgb(89, 76, 145) 0px 0px 7px 4px"}
          border="2px solid rgb(15, 3, 37)"
          placeholder="Amount To Stake"
          bg="transparent"
          mb={10}
          w="100%"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
        />
        <Button
          boxShadow={"rgb(89, 76, 145) 0px 0px 7px 4px"}
          border="2px solid rgb(15, 3, 37)"
          _hover={{
            bg: "transparent",
            opacity: 0.9,
            transform: "scale(1.02)",
            cursor: "pointer",
            color: "white",
          }}
          mb={10}
          transition={"all 0.1s ease-in-out"}
          bg="transparent"
          w="100%"
          borderRadius={"xl"}
          loadingText="Transferring"
          textColor={"white"}
          p={2}
          isLoading={isLoadingTransfer || transferring}
          onClick={async () => {
            setTransferring(true);
            try {
              const tx = await transfer({
                to: receiver,
                amount: transferAmount,
              });

              toast({
                title: "Transfer Success",
                description: "Your transfer was successful",
                status: "success",
                duration: 9000,
                isClosable: true,
                position: "top",
              });
              fetchPrices();
              refetchBalance();
              setTransferring(false);
            } catch (error) {
              toast({
                title: "Transfer Error",
                description: "Your transfer was unsuccessful",
                status: "error",
                duration: 9000,
                isClosable: true,
                position: "top",
              });
              setTransferring(false);
            }
          }}
        >
          Transfer
        </Button>
      </Box>
    </>
  );
};

export default Bnb;
