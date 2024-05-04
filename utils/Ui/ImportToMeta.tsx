import { Button } from "@chakra-ui/react";

interface Item {
  address: string;
  symbol: string;
  decimals: number;
}

interface MetaButtonProps {
  item: Item;
  image: string;
}

export const MetaButton: React.FC<MetaButtonProps> = ({ item, image }) => {
  const tokenImageHelper = (address: string) => {
    // your logic here
  };

  return (
    <Button
      onClick={() => {
        window?.ethereum
          .request({
            method: "wallet_watchAsset",
            params: {
              type: "ERC20",
              options: {
                address: item.address,
                symbol: item.symbol,
                decimals: item.decimals, // replace with the actual number of decimals
                image: tokenImageHelper(item.address),
              },
            },
          })
          .then((success: any) => {
            if (success) {
              console.log("Successfully added asset.");
            } else {
              throw new Error("Something went wrong.");
            }
          })
          .catch(console.error);
      }}
    >
      Import to MetaMask
    </Button>
  );
};
