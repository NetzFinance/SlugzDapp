import { useEffect, useState } from "react";

interface Transaction {
  buys: number;
  sells: number;
  buyers: number;
  sellers: number;
}

interface VolumeUSD {
  m5: string;
  h1: string;
  h6: string;
  h24: string;
}

interface PriceChangePercentage {
  m5: string;
  h1: string;
  h6: string;
  h24: string;
}

interface TokenData {
  id: string;
  type: string;
}

interface Relationships {
  base_token: {
    data: TokenData;
  };
  quote_token: {
    data: TokenData;
  };
  dex: any; // Replace 'any' with the actual type once you know it
}

interface Attributes {
  base_token_price_usd: string;
  base_token_price_native_currency: string;
  quote_token_price_usd: string;
  quote_token_price_native_currency: string;
  base_token_price_quote_token: string;
  quote_token_price_base_token: string;
  address: string;
  name: string;
  pool_created_at: string;
  fdv_usd: string;
  market_cap_usd: null | string;
  price_change_percentage: PriceChangePercentage;
  transactions: {
    m5: Transaction;
    m15: Transaction;
    m30: Transaction;
    h1: Transaction;
    h24: Transaction;
  };
  volume_usd: VolumeUSD;
  reserve_in_usd: string;
  relationships: Relationships;
}

interface PoolData {
  id: string;
  type: string;
  attributes: Attributes;
}

interface ApiResponse {
  data: PoolData[];
}

const useGeckoZodiac = () => {
  const [data, setData] = useState<ApiResponse | null | string>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const options = {
        method: "GET",
        headers: { "x-cg-pro-api-key": process.env.GECKO_API_KEY! as string },
      };
      try {
        const response = await fetch(
          "https://api.geckoterminal.com/api/v2/networks/mainnetz/dexes/zodiac-swap/pools?page=1",
          options,
        );
        const data = await response.json();
        setData(data || null || "error fetching data");
      } catch (error) {
        console.error(error);
        setData("error fetching data");
      }
    };

    fetchData();
    setLoading(false);
  }, []);

  return { data, loading };
};

export default useGeckoZodiac;
