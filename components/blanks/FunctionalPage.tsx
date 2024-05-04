import { Heading, VStack, Text, useToast } from "@chakra-ui/react";
import { ConnectWallet, useAddress, useSDK } from "@thirdweb-dev/react";

export default function Home() {
  const address = useAddress();
  const sdk = useSDK();
  const toast = useToast();

  return (
    <div>
      <Heading>Steakhouse Template</Heading>
      <VStack>
        <Text>Welcome to Steakhouse</Text>
        <Text>Connect your wallet to get started</Text>
        <ConnectWallet />
      </VStack>
    </div>
  );
}
