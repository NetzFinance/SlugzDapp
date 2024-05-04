import { Button, HStack, Text, VStack, useToast } from "@chakra-ui/react";
import {
  ConnectWallet,
  useAddress,
  useDisconnect,
  useLogin,
  useLogout,
  useUser,
} from "@thirdweb-dev/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { FaDiscord, FaHandshake, FaWallet } from "react-icons/fa";

export default function SignIn() {
  const address = useAddress();
  const { data: session } = useSession();
  const { isLoggedIn } = useUser();
  const { login, isLoading } = useLogin();
  const { logout, isLoading: isLoadingLogout } = useLogout();
  const toast = useToast();
  const disconnect = useDisconnect();

  async function requestGrantRole() {
    if (address) {
      try {
        const response = await fetch("/api/Mint", {
          method: "POST",
        });
        const data = await response.json();
        console.log(data);
        if (data.message) {
          toast({
            title: "Success",
            description: data.message,
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        } else if (data.error) {
          toast({
            title: "Error",
            description: data.error,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      } catch (e) {
        console.error(e);
        toast({
          title: "Error",
          description: "Role Not Granted",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  }

  if (session && address) {
    return (
      <VStack textAlign={"center"} maxW={400} m="auto" p={4} w="100%">
        <Button
          w="100%"
          textColor="black"
          bg="white"
          onClick={() => requestGrantRole()}
        >
          <HStack textAlign={"center"}>
            <Text textColor={"black"}>Grant Role</Text>
          </HStack>
        </Button>
        <Button w="100%" textColor="black" bg="white" onClick={() => signOut()}>
          <HStack textAlign={"center"}>
            <Text textColor={"black"}>Sign out of</Text>
            <FaDiscord color="#7289da" />
          </HStack>
        </Button>
        <Button w="100%" textColor="black" bg="white" onClick={() => logout()}>
          <HStack textAlign={"center"}>
            <Text textColor={"black"}>Unsign</Text>
            <FaHandshake color="#7289da" />
          </HStack>
        </Button>{" "}
        <Button
          w="100%"
          textColor="black"
          bg="white"
          onClick={async () => await disconnect()}
        >
          <HStack textAlign={"center"}>
            <Text textColor={"black"}>Log out of</Text>
            <FaWallet color="#7289da" />
          </HStack>
        </Button>
      </VStack>
    );
  }

  // 2. Connect Wallet
  if (!address) {
    return (
      <VStack>
        <ConnectWallet />
      </VStack>
    );
  }

  if (!isLoggedIn) {
    return (
      <VStack textAlign={"center"}>
        <Button
          variant="primary"
          onClick={async () => {
            await login();
          }}
        >
          <HStack>
            <Text textColor={"black"}>Sign message!</Text>
            <FaWallet color="#7289da" />
          </HStack>
        </Button>
      </VStack>
    );
  }

  // 4. Connect with Discord (OAuth)
  if (!session) {
    return (
      <VStack textAlign={"center"}>
        <Button textColor="black" bg="white" onClick={() => signIn("discord")}>
          <HStack>
            <Text textColor={"black"}>Connect to</Text>
            <FaDiscord color="#7289da" />
          </HStack>
        </Button>
      </VStack>
    );
  }

  return null;
}
