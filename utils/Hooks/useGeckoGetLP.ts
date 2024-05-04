import { useState, useEffect } from "react";
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
const useGeckoGetNETZFI = () => {
  const [data, setData] = useState<Data | null | string>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
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
        setLoading(true);
        const response = await fetch(
          "https://pro-api.coingecko.com/api/v3/onchain/networks/mainnetz/tokens/0x330d9DA993aA167F41D6c066A8064C006B9a0052",
          options,
        );

        const data = await response.json();
        setData(data?.data || null || "error fetching data");
      } catch (error) {
        console.error(error);
        setData("error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    setLoading(false);
  }, []);

  return { data, loading };
};

export default useGeckoGetNETZFI;
