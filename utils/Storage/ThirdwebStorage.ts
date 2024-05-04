import { IpfsUploader, ThirdwebStorage } from "@thirdweb-dev/storage";

export const storage = new ThirdwebStorage({
  uploader: new IpfsUploader(),
  gatewayUrls: {
    "ipfs://": [
      "https://gateway.ipfscdn.io/ipfs/",
      "https://cloudflare-ipfs.com/ipfs/",
      "https://ipfs.io/ipfs/",
    ],
  },
});
