import {
  Box,
  Button,
  Heading,
  Icon,
  Image,
  VisuallyHidden,
  chakra,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { ConnectWallet } from "@thirdweb-dev/react";
import { ReactNode } from "react";
import { FaWallet } from "react-icons/fa";

const SocialButton = ({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) => {
  return (
    <chakra.button
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
      rounded={"full"}
      w={8}
      h={8}
      mr={4}
      cursor={"pointer"}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      }}
      textColor={"white"}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export default function AddressCheck() {
  const toast = useToast();
  return (
    <Box
      w="100%"
      h="100%"
      minH={"100vh"}
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      textColor={"white"}
      fontSize={{ base: "sm", md: "md", lg: "lg" }}
      opacity={0.9}
      bg="transparent"
      p={4}
    >
      <Heading textColor={"white"} mb={4} textAlign={"center"}>
        Please connect your wallet
      </Heading>
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
        modalTitle="Please choose a Wallet"
        showThirdwebBranding={false}
        modalTitleIconUrl="/banners/tinyslug.svg"
        termsOfServiceUrl="https://your-terms-of-service-url.com"
        privacyPolicyUrl="https://your-privacy-policy-url.com"
        welcomeScreen={() => {
          return <Image src="/banners/oozyconnect.png" w="100%" h="100%" />;
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
    </Box>
  );
}
