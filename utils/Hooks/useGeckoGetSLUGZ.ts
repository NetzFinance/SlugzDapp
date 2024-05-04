import { useEffect, useState } from "react";
interface Data {
  id: string;
  type: string;
  attributes: {
    address: string;
    name: string;
    symbol: string;
    image_url: string;
    coingecko_coin_id: null | string;
    decimals: number;
    total_supply: string;
    price_usd: string;
    fdv_usd: string;
    total_reserve_in_usd: string;
    volume_usd: {
      h24: string;
    };
    market_cap_usd: null | string;
  };
  relationships: {
    top_pools: {
      data: Array<{
        id: string;
        type: string;
      }>;
    };
  };
}

interface TokenInfoProps {
  data: Data;
}
const useGeckoGetSLUGZ = () => {
  const [data, setData] = useState<Data | null | string>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trigger, setTrigger] = useState(0); // Add this line
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const options = {
        method: "GET",
        headers: {
          "x-cg-pro-api-key":
            (process.env.GECKO_API_KEY! as string) ||
            "CG-HUF6zYd2bGytXhU661iuqJrG",
        },
      };

      try {
        setIsLoading(true);
        const response = await fetch(
          "https://pro-api.coingecko.com/api/v3/onchain/networks/mainnetz/tokens/0xb30Cd83BF39CF94Af9d0Fdcc9a5F4c0c60dEBF18",
          options,
        );

        const data = await response.json();
        setData(data?.data || null || "error fetching data");
      } catch (error) {
        setData("error fetching data");
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error("An unknown error occurred."));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    setIsLoading(false);
  }, [trigger]);

  const refetch = () => {
    setTrigger((value) => value + 1); // Increment trigger to refetch data
  };
  return { data, isLoading, error, refetch };
};

export default useGeckoGetSLUGZ;
