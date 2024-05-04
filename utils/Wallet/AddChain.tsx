import { Button, useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import { FC } from "react";

const AddChainButton: FC = () => {
  const toast = useToast();
  const onClick = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    const params: Array<{
      chainId: string;
      chainName: string;
      nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
      };
      rpcUrls: string[];
      blockExplorerUrls: string[];
    }> = [
      {
        chainId: ethers.utils.hexValue(2016),
        chainName: "MainetZ",
        nativeCurrency: {
          name: "NETZ",
          symbol: "NETZ",
          decimals: 18,
        },
        rpcUrls: ["https://mainnet-rpc.mainnetz.io"],
        blockExplorerUrls: [
          "https://explorer.mainnetz.io/",
          "https://netzexplorer.io/",
        ],
      },
    ];
    try {
      await window?.ethereum?.request({
        method: "wallet_addEthereumChain",
        params,
      });
      toast({
        title: "Chain Added",
        description: "MainetZ has been added to MetaMask",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "There was an error adding MainetZ to MetaMask",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Button
      textColor={"black"}
      _hover={{
        bgGradient: "transparent",
        opacity: 0.9,
        transform: "scale(1.02)",
        cursor: "pointer",
        color: "white",
      }}
      transition={"all 0.1s ease-in-out"}
      bg="#8fff00"
      onClick={onClick}
      w="100%"
    >
      Add MainnetZ to MetaMask
    </Button>
  );
};

export default AddChainButton;
