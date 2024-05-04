import { useEffect, useState } from "react";

export type TokenData = {
  circulating_market_cap: string;
  icon_url: string;
  name: string;
  decimals: string;
  symbol: string;
  address: string;
  type: string;
  holders: string;
  exchange_rate: string;
  total_supply: string;
};

export const useTokenHolders = (address: string) => {
  const [data, setData] = useState<TokenData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [trigger, setTrigger] = useState(0); // Add this line

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://netzexplorer.io/api/v2/tokens/${address}`,
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
