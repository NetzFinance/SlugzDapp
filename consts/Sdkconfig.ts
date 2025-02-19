export const sdkConfig = {
  readonlySettings: {
    rpcUrl: "<rpc-url>", // force read calls to go through your own RPC url
    chainId: 25, // reduce RPC calls by specifying your chain ID
  },
  gasSettings: {
    maxPriceInGwei: 123, // Maximum gas price for transactions (default 300 gwei)
    speed: "fastest", // the tx speed setting: 'standard'|'fast|'fastest' (default: 'fastest')
  },
  gasless: {
    // By specifying a gasless configuration - all transactions will get forwarded to enable gasless transactions
    openzeppelin: {
      relayerUrl: "<open-zeppelin-relayer-url>", // your OZ Defender relayer URL
      relayerForwarderAddress: "<open-zeppelin-forwarder-address>", // the OZ defender relayer address (defaults to the standard one)
    },
    biconomy: {
      apiId: "biconomy-api-id", // your Biconomy API Id
      apiKey: "biconomy-api-key", // your Biconomy API Key
      deadlineSeconds: 123, // your Biconomy timeout preference
    },
  },
  infuraApiKey: "<infura-api-key>", // your Infura API key
  alchemyApiKey: "<alchemy-api-key>", // your Alchemy API key
};
