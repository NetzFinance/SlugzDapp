import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  HStack,
  Heading,
  Icon,
  Image,
  Spinner,
  Text,
  VStack,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import {
  ConnectWallet,
  SmartContract,
  ThirdwebSDK,
  toEther,
  toWei,
  useBalance,
  useContractRead,
} from "@thirdweb-dev/react";
import { BaseContract } from "ethers";
import { useState } from "react";
import { FaWallet } from "react-icons/fa";
import GOOSE_ABI from "../abis/Oosygoosy.json";
import AddChainButton from "../utils/Wallet/AddChain";

export default function NftMintBox({
  address,
  contract,
  sdk,
}: {
  address: string | undefined;
  contract: SmartContract<BaseContract> | undefined;
  sdk: ThirdwebSDK | undefined;
}) {
  const toast = useToast();

  const [minting, setMinting] = useState(false);
  const [amount, setAmount] = useState(1);

  const {
    data: cost,
    refetch: refetchCost,
    isInitialLoading: isLoadingCost,
  } = useContractRead(contract, "mintPrice");

  const {
    data: totalSupply,
    refetch: refetchTotalSupply,
    isInitialLoading: isLoadingTotalSupply,
  } = useContractRead(contract, "totalSupply");

  const {
    data: maxSupply,
    refetch: refetchMaxSupply,
    isInitialLoading: isLoadingMaxSupply,
  } = useContractRead(contract, "currentMaxSupply");
  const {
    data: balance,
    refetch: refetchBalance,
    isInitialLoading: isLoadingBalance,
  } = useBalance();

  const { onCopy, hasCopied } = useClipboard(
    "0x6246afB4ed86888CF728A7ea4436EC6C1c6545f6",
  );

  async function mint() {
    if (address && balance) {
      setMinting(true);
      if (Number(balance?.displayValue) <= Number(toEther(cost))) {
        toast({
          title: "Error",
          description: "Insufficient balance",
          status: "error",
          duration: 9000,
          isClosable: true,
          icon: <Icon as={Image} src={"/banners/tinyslug.svg"} h={8} w={8} />,
        });
        setMinting(false);
        return;
      }
      try {
        const slay = await sdk?.getContract(
          "0x1c99DFA385b47378262f3801404b2004058755c4",
          GOOSE_ABI,
        );

        const formattedAmount = toWei(Number(toEther(cost)) * amount);

        const mint = await slay?.call("safeMint", [amount], {
          value: formattedAmount,
        });
        if (mint) {
          toast({
            title: "Success",
            description: "Your NFT has been minted",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        }
        setMinting(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "there was an error minting your NFT",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        console.log(error);
        setMinting(false);
      }
    }
  }

  return (
    <VStack
      bg="#000000"
      p={4}
      gap={4}
      justifyContent={"center"}
      borderRadius="md"
      maxW="600"
    >
      <VStack minW="100%" w="100%">
        <Heading as="h1" size="2xl" textAlign={"center"}>
          OG Mint
        </Heading>
        {isLoadingTotalSupply || isLoadingMaxSupply ? (
          <>
            <Text>Loading...</Text>
            <Spinner />
          </>
        ) : (
          <Box
            mt="1"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated
          >
            {totalSupply?.toString()} / {maxSupply?.toString()}
          </Box>
        )}
        <Image src="/banners/pack.gif" h="275" w="175" />
        <Button
          mt="1"
          bg="#8fff00"
          borderRadius={"md"}
          border="1px solid #8fff00"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          onClick={onCopy}
          textColor="black"
          minW="100%"
          w="100%"
          maxW="600"
        >
          <Text
            textAlign={"center"}
            textColor="black"
            w="100%"
            _hover={{ cursor: "Pointer" }}
          >
            {hasCopied
              ? "Copied!"
              : "0x6246afB4ed86888CF728A7ea4436EC6C1c6545f6"}
          </Text>
        </Button>
        <Divider border="2px solid white" />

        {address ? (
          <>
            <ButtonGroup maxW={600} w="100%">
              <Button
                bg="#8fff00"
                borderRadius={"md"}
                border="1px solid #8fff00"
                transition={"all  0.2s ease-in-out"}
                onClick={() => setAmount(amount > 2 ? amount - 1 : 1)}
                textColor={"black"}
              >
                -
              </Button>
              <Button
                borderRadius={"md"}
                transition={"all  0.2s ease-in-out"}
                bg="white"
                border="1px solid #8fff00"
                onClick={mint}
                isLoading={minting}
                loadingText="Minting"
                textColor={"black"}
                fontSize={{ base: "small", md: "md" }}
                w="100%"
                justifyContent={"space-between"}
              >
                <HStack w="100%">
                  <Text> [ </Text>
                  <Text>{amount}X</Text>
                  <Icon
                    as={Image}
                    justifyContent={"center"}
                    alignContent={"center"}
                    src="/banners/tinyslug_black.svg"
                  />
                  <Text>]</Text>
                </HStack>
                <Text>{Number(toEther(cost || 500)) * amount} $NETZ</Text>
              </Button>
              <Button
                borderRadius={"md"}
                border="1px solid #8fff00"
                transition={"all  0.2s ease-in-out"}
                bg="#8fff00"
                onClick={() => {
                  if (amount === 10) {
                    toast({
                      title: "Error",
                      description: "You can only mint 10 NFTs at a time",
                      status: "error",
                      duration: 9000,
                      isClosable: true,
                      icon: (
                        <Icon
                          as={Image}
                          src={"/banners/tinyslug.svg"}
                          h={8}
                          w={8}
                        />
                      ),
                    });
                    return;
                  }
                  setAmount(amount < 10 ? amount + 1 : 10);
                }}
                textColor={"black"}
              >
                +
              </Button>
            </ButtonGroup>
            <Button
              borderRadius={"md"}
              transition={"all  0.2s ease-in-out"}
              bg="#8fff00"
              border="1px solid #8fff00"
              textColor={"black"}
              onClick={mint}
              isLoading={minting}
              loadingText="Minting"
              maxW={600}
              w="100%"
            >
              GIMME THE NFTS [MINT]
            </Button>
            <Divider border="2px solid white" />
            <AddChainButton />
          </>
        ) : (
          <>
            <Text>Please Connect A Wallet To Mint</Text>
            <Button
              as={ConnectWallet}
              bg="transparent"
              rounded="md"
              textColor="white"
              textAlign={"center"}
              justifyContent={"Center"}
              _hover={{
                bg: "transparent",
                textColor: "#8FFF00",
                color: "#8FFF00",
              }}
              rightIcon={
                <Icon
                  as={FaWallet}
                  color="white"
                  _hover={{
                    bg: "transparent",
                    textColor: "#8FFF00",
                    color: "#8FFF00",
                  }}
                />
              }
              modalTitle="You do the oozin, we do the goozin"
              showThirdwebBranding={false}
              modalTitleIconUrl="/banners/tinyslug.svg"
              termsOfServiceUrl="https://your-terms-of-service-url.com"
              privacyPolicyUrl="https://your-privacy-policy-url.com"
              welcomeScreen={() => {
                return (
                  <Image src="/banners/oozyconnect.png" w="100%" h="100%" />
                );
              }}
              display={{ base: "none", md: "block" }}
              onConnect={() => {
                toast({
                  title: "Oozer has logged in",
                  description: "Welcome to the Oozy Goozy Web3 Hub!",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
              }}
              auth={{
                loginOptional: false,
                onLogin: (token: string) => {
                  toast({
                    title: "Oozer has logged in",
                    description: "Welcome to the Oozy Goozy Web3 Hub!",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                  });
                },

                onLogout: () => {
                  // Add your logout logic here
                  toast({
                    title: "Oozer has logged out",
                    description: "Oozer has logged out",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                  });
                },
              }}
              detailsBtn={() => {
                return (
                  <Button
                    size="md"
                    textColor="white"
                    rounded="md"
                    m="auto"
                    bg="transparent"
                    display={{ base: "none", md: "block" }}
                    rightIcon={
                      <Icon
                        as={FaWallet}
                        _hover={{
                          bg: "transparent",
                          textColor: "#8FFF00",
                          color: "#8FFF00",
                        }}
                      />
                    }
                    _hover={{
                      bg: "transparent",
                      textColor: "#8FFF00",
                      color: "#8FFF00",
                    }}
                  >
                    connected
                  </Button>
                );
              }}
            >
              Sign in
            </Button>
          </>
        )}
      </VStack>
    </VStack>
  );
}
