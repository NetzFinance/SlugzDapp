import { ChakraProvider, Flex, Icon, VStack, Image } from "@chakra-ui/react";
import { Binance, Cronos, Ethereum, ZMainnet } from "@thirdweb-dev/chains";
import {
  ThirdwebProvider,
  coinbaseWallet,
  cryptoDefiWallet,
  metamaskWallet,
  trustWallet,
  walletConnect,
} from "@thirdweb-dev/react";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { usePathname, useRouter } from "next/navigation";
import Footer from "../components/Navigation/Footer";
import Navbar from "../components/Navigation/Nav";
import { theme } from "../consts/Theme";
import "../styles/globals.css";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  let activeChain;

  if (
    pathname === "/OTC/Eth" ||
    pathname.toLowerCase() === "otc/eth" ||
    pathname === "/Elite/Eth" ||
    pathname.toLowerCase() === "/elite/eth"
  ) {
    activeChain = Ethereum;
  } else if (
    pathname === "/OTC/Bnb" ||
    pathname.toLowerCase() === "/otc/bnb" ||
    pathname === "/Elite/Bnb" ||
    pathname.toLowerCase() === "/elite/bnb"
  ) {
    activeChain = Binance;
  } else if (
    pathname === "/OTC/Steak" ||
    pathname.toLowerCase() === "/otc/steak" ||
    pathname === "/OTC/Reye" ||
    pathname.toLowerCase() === "/otc/reye" ||
    pathname === "/OTC/Cro" ||
    pathname.toLowerCase() === "/otc/cro"
  ) {
    activeChain = Cronos;
  } else {
    activeChain = ZMainnet;
  }

  return (
    <ThirdwebProvider
      clientId={"3cbbd7617a8d926352e558b3fd4849ba"}
      secretKey={
        "MPO5IeZRH_JQv23pwrYpKRFq7Ip221pWqoEYUXSqT6EGpHPzi2dNL6CUb7jD6LwrW5euLlVlJpd1vEH4duWM-A"
      }
      autoSwitch={true}
      dAppMeta={{
        name: "Oozy Goozy Website and Dapp on Mainnetz",
        description: "Oozy Goozy Mint Live Now!",
        logoUrl: "/logo.png",
        url: "",
        isDarkMode: false,
      }}
      activeChain={activeChain}
      sdkOptions={{
        clientId: "3cbbd7617a8d926352e558b3fd4849ba",
        secretKey:
          "MPO5IeZRH_JQv23pwrYpKRFq7Ip221pWqoEYUXSqT6EGpHPzi2dNL6CUb7jD6LwrW5euLlVlJpd1vEH4duWM-A",
      }}
      supportedChains={[ZMainnet]}
      supportedWallets={[
        metamaskWallet(),
        trustWallet(),
        walletConnect(),
        coinbaseWallet(),
        cryptoDefiWallet(),
      ]}
    >
      <Head>
        <title>Oozy Goozy</title>
        <meta name="description" content="$SLUGZ Token is LIVE now!" />

        <meta
          name="description"
          content="Mint an OOZY GOOZY Slug NFT Today! Only 500 NETZ from /Mint"
        />
        <meta name="og:image" content="/logo.png" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <SessionProvider session={pageProps.session}>
        <ChakraProvider
          toastOptions={{
            defaultOptions: {
              duration: 9000,
              isClosable: true,
              position: "bottom-left",
              containerStyle: { fontFamily: "Squada One" },
              icon: (
                <Icon as={Image} src={"/banners/tinyslug.svg"} h={8} w={8} />
              ),
            },
          }}
          theme={theme}
        >
          <Flex
            direction="column"
            minH="100vh"
            bg="#747474"
            textColor="white"
            w="100%"
          >
            <Navbar />

            <VStack flex="1" p={2} spacing={4}>
              <Component {...pageProps} />
            </VStack>

            <Footer />
          </Flex>
        </ChakraProvider>
      </SessionProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
