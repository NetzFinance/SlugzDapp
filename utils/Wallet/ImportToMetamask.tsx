function ImportButton({
  address,
  symbol,
  decimals,
  image,
}: {
  address?: string;
  symbol?: string;
  decimals?: number;
  image?: string;
}) {
  return (
    <button
      onClick={async () => {
        if (window?.ethereum) {
          try {
            //window.ethereum.autoRefreshOnNetworkChange = false;
            const wasAdded = await window?.ethereum.request({
              method: "wallet_watchAsset",
              params: {
                type: "ERC20", // Initially only supports ERC20, but eventually more!
                options: {
                  address,
                  symbol,
                  decimals,
                  image,
                },
              },
            });
          } catch (error) {
            console.log(error);
          }
        } else {
          console.error(
            "Non-Ethereum browser detected. You should consider trying MetaMask!",
          );
        }
      }}
      style={{
        backgroundColor: "transparent",
        border: "1px solid white",
        cursor: "pointer",
        fontSize: "16px",
        padding: "0.5rem",
        margin: "0",
        color: "white",
      }}
    >
      Import to MetaMask
    </button>
  );
}

export default ImportButton;
