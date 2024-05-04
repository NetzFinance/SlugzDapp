import {
  useDisclosure,
  VStack,
  Button,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Image,
  useToast,
  Stack,
  SlideFade,
} from "@chakra-ui/react";
import { useTheme } from "@emotion/react";
import {
  useAddress,
  useUser,
  useLogin,
  useConnect,
  useDisconnect,
  ConnectWallet,
  shortenAddress,
} from "@thirdweb-dev/react";
import { useSession, signOut, signIn } from "next-auth/react";
import { useState } from "react";
import { FaDiscord, FaWallet } from "react-icons/fa";

export default function SignIn() {
  const address = useAddress();
  const { data: session } = useSession();
  const { isLoggedIn } = useUser();
  const login = useLogin();
  const connect = useConnect();
  const disconnect = useDisconnect();
  const colourTheme = useTheme();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [roleResponse, setRoleResponse] = useState(null);
  const [grantingRoles, setGrantingRoles] = useState(false);

  async function grantRoles() {
    if (address && session) {
      setGrantingRoles(true);
      try {
        const res = await fetch("/api/Roles/Role", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setRoleResponse(data.message);
        toast({
          title: "Role Granted",
          description: data.message,
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
        setGrantingRoles(false);
      } catch (error) {
        console.error("An unexpected error happened:", error);
        toast({
          title: "Role Grant Failed",
          description: "An unexpected error happened",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
        setGrantingRoles(false);
      }
    }
  }

  if (session && address) {
    return (
      <VStack
        bg="transparent"
        boxShadow={"rgb(89, 76, 145) 0px 0px 7px 4px"}
        border="2px solid rgb(15, 3, 37)"
        p={4}
        borderRadius={"md"}
      >
        <Text textAlign={"center"} maxW={400}>
          Welcome, you are connected to the following discord account
          <br />
          <Text textAlign={"center"} fontSize={"xx-large"}>
            = {session?.user?.name} =
          </Text>
          Connected address: {shortenAddress(address)}
        </Text>
        <Stack
          w="100%"
          mb={6}
          textAlign={"center"}
          direction={{ base: "column", md: "column", lg: "row" }}
        >
          <Button
            textColor={"white"}
            bg="transparent"
            boxShadow={"rgb(89, 76, 145) 0px 0px 7px 4px"}
            border="2px solid rgb(15, 3, 37)"
            onClick={() => signOut()}
            _hover={{
              bg: "transparent",
              boxShadow: "rgb(89, 76, 145) 0px 0px 7px 4px",
              transform: "scale(1.05)",
            }}
          >
            <HStack textAlign={"center"}>
              <Text textColor={"white"}>Sign out of</Text>
              <FaDiscord color="#7289da" />
            </HStack>
          </Button>
          <Button
            textColor={"white"}
            bg="transparent"
            boxShadow={"rgb(89, 76, 145) 0px 0px 7px 4px"}
            border="2px solid rgb(15, 3, 37)"
            onClick={async () => await disconnect()}
            _hover={{
              bg: "transparent",
              boxShadow: "rgb(89, 76, 145) 0px 0px 7px 4px",
              transform: "scale(1.05)",
            }}
          >
            <HStack textAlign={"center"}>
              <Text textColor={"white"}>Log out of</Text>
              <FaWallet color="#7289da" />
            </HStack>
          </Button>
          <Button
            textColor={"white"}
            bg="transparent"
            boxShadow={"rgb(89, 76, 145) 0px 0px 7px 4px"}
            border="2px solid rgb(15, 3, 37)"
            onClick={() => grantRoles()}
            loadingText="Granting roles..."
            isLoading={grantingRoles}
            _hover={{
              bg: "transparent",
              boxShadow: "rgb(89, 76, 145) 0px 0px 7px 4px",
              transform: "scale(1.05)",
            }}
          >
            <HStack textAlign={"center"}>
              <Text textColor={"white"}>Grant Roles</Text>
              <FaWallet color="#7289da" />
            </HStack>
          </Button>
        </Stack>
        {roleResponse && (
          <SlideFade
            in={true}
            offsetY="20px"
            transition={{
              enter: { duration: 0.5 },
              exit: { duration: 0.5 },
            }}
          >
            <Text
              boxShadow={"rgb(89, 76, 145) 0px 0px 7px 4px"}
              p={2}
              borderRadius={"md"}
              border="2px solid rgb(15, 3, 37)"
              textColor={"white"}
            >
              {roleResponse}
            </Text>
          </SlideFade>
        )}
      </VStack>
    );
  }

  // 2. Connect Wallet
  if (!address) {
    return (
      <VStack>
        <Button
          as={ConnectWallet}
          bg="transparent"
          rounded="md"
          textColor="white"
          textAlign={"center"}
          justifyContent={"Center"}
          display={{ base: "none", md: "block" }}
          _hover={{
            bg: "transparent",
          }}
          rightIcon={<FaWallet color="white" />}
          showThirdwebBranding={false}
          modalTitleIconUrl="/2.svg"
          termsOfServiceUrl="https://your-terms-of-service-url.com"
          privacyPolicyUrl="https://your-privacy-policy-url.com"
          welcomeScreen={() => {
            return <Image src="/banners/oozyconnect.png" w="100%" h="100%" />;
          }}
          auth={{
            loginOptional: false,
            onLogin: (token: string) => {
              toast({
                title: "Welcome to Netz Finance.",
                description: "Thank you for completing the sign in process.",
                status: "success",
                duration: 9000,
                isClosable: true,
              });
            },

            onLogout: () => {
              toast({
                title: "Its sad to see you go..",
                description:
                  "You have been logged out succesfully and securely",
                status: "success",
                duration: 9000,
                isClosable: true,
              });
              // Add your logout logic here
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
                rightIcon={<FaWallet color="white" />}
                _hover={{
                  bg: "transparent",
                  boxShadow: "rgb(89, 76, 145) 0px 0px 7px 4px",
                  transform: "scale(1.05)",
                }}
              >
                connected
              </Button>
            );
          }}
        >
          Sign in
        </Button>
      </VStack>
    );
  }

  // 4. Connect with Discord (OAuth)
  if (!session) {
    return (
      <VStack
        bg="transparent"
        boxShadow={"rgb(89, 76, 145) 0px 0px 7px 4px"}
        border="2px solid rgb(15, 3, 37)"
        p={4}
        borderRadius={"md"}
      >
        <Text textAlign={"center"} maxW={400}>
          In order to verify your roles you must connect to discord via OAuth.
          <br />
          Please connect now and follow all the appropriate steps given.
        </Text>
        <Button
          textColor={"white"}
          bg="transparent"
          boxShadow={"rgb(89, 76, 145) 0px 0px 7px 4px"}
          border="2px solid rgb(15, 3, 37)"
          _hover={{
            bg: "transparent",
            boxShadow: "rgb(89, 76, 145) 0px 0px 7px 4px",
            transform: "scale(1.05)",
          }}
          onClick={() => signIn("discord")}
        >
          <HStack>
            <Text textColor={"white"}>Connect to</Text>
            <FaDiscord color="#7289da" />
          </HStack>
        </Button>
      </VStack>
    );
  }

  return null;
}
