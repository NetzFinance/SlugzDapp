import { useEffect, useState } from "react";

interface HoldersByInstance {
  items: Item[];
}

interface Item {
  address: Address;
  token: Token;
  token_id: string;
  value: string;
}

interface Address {
  ens_domain_name: null | string;
  hash: string;
  implementation_name: null | string;
  is_contract: boolean;
  is_verified: null | boolean;
  name: null | string;
  private_tags: string[];
  public_tags: string[];
  watchlist_names: string[];
}

interface Token {
  address: string;
  circulating_market_cap: null | string;
  decimals: null | string;
  exchange_rate: null | string;
  holders: string;
  icon_url: null | string;
  name: string;
  symbol: string;
  total_supply: null | string;
  type: string;
  volume_24h: null | string;
}

export const useGetPassHolders = (tokenId: number) => {
  const [data, setData] = useState<HoldersByInstance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [trigger, setTrigger] = useState(0); // Add this line

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer 10d84224-910a-496a-bd03-6a2ee457c9f1",
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://netzexplorer.io/api/v2/tokens/0xe3E7B020e38C6686C086AF5e5b9a41Cf8275Eb3F/instances/${tokenId}/holders
          `,
          options,
        );
        const data = await response.json();
        setData(data);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("An unknown error occurred."));
        }
        setIsLoading(false);
      }
    };

    fetchData();
  }, [trigger]);

  const refetch = () => {
    setTrigger((value) => value + 1); // Increment trigger to refetch data
  };

  return { data, isLoading, error, refetch };
};
