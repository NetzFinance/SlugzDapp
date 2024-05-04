import { CryptoDefiWallet, WalletConfig } from "@thirdweb-dev/react";
const Cro = {
  chainId: 25,
  rpc: ["https://rpc.vvs.finance/", "https://rpc.crodex.app/"],
  nativeCurrency: {
    decimals: 18,
    name: "Cronos",
    symbol: "CRO",
  },
  shortName: "CRO",
  slug: "Cronos",
  testnet: false,
  chain: "Cronos Mainnet",
  name: "Cronos Mainnet", // Name of the network
};

const wallet = new CryptoDefiWallet({
  dappMetadata: {
    name: "The Cronos Steakhouse",
    description: "The Cronos Steakhouse Dapp",
    url: "https://test.cronossteakhouse.com",
    isDarkMode: true,
    logoUrl: "/tokenlogos/cro.png",
  },
  chains: [Cro],
  clientId: "3cbbd7617a8d926352e558b3fd4849ba",
  qrcode: true,
});

export const defiWalletConfig: WalletConfig<CryptoDefiWallet> = {
  id: "crypto-defi-wallet",
  meta: {
    iconURL: "/tokenlogos/cro.png",
    name: "Crypto.com Defi Wallet",
  },
  create: () => wallet,
  isInstalled: () => true, // Custom logic to check if the wallet is installed
  recommended: true, // Use as a default wallet
};
