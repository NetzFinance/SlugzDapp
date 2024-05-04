import {
  ConnectEmbed,
  ConnectWallet,
  shortenAddress,
  useAddress,
} from "@thirdweb-dev/react";
import { NextPage } from "next";

import { useEffect, useState } from "react";
import {
  SimpleGrid,
  VStack,
  Text,
  Box,
  Button,
  Container,
  HStack,
  Heading,
  Stack,
  Image,
} from "@chakra-ui/react";
import {
  FaCoins,
  FaDiscord,
  FaImage,
  FaQuestion,
  FaRetweet,
} from "react-icons/fa";
import { GiBarn } from "react-icons/gi";
import Link from "next/link";

const companiesImages = [
  "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&auto=format&fit=crop&w=334&q=80",
  "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&auto=format&fit=crop&w=334&q=80",
  "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&auto=format&fit=crop&w=334&q=80",
  "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&auto=format&fit=crop&w=334&q=80",
  "https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&auto=format&fit=crop&w=334&q=80",
  "https://images.unsplash.com/photo-1611162617263-4ec3060a058e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&auto=format&fit=crop&w=334&q=80",
];

const icons = [
  { icon: <FaImage size={20} color="white" />, name: "Mint" },
  { icon: <FaCoins size={20} color="white" />, name: "Stake" },
];

const Custom404: NextPage = () => {
  const address = useAddress();
  const [addresses, setAddresses] = useState<string[]>([]);

  return (
    <Container maxW="7xl" p={4}>
      <Stack
        direction="column"
        spacing={6}
        alignItems="center"
        mt={8}
        mb={16}
        textColor="white"
      >
        <Heading
          as="h1"
          fontSize="4xl"
          fontWeight="bold"
          textAlign="center"
          maxW="600px"
          textColor="white"
        >
          Unfortunately this page <br /> is not accessible.
        </Heading>
        <Text maxW="500px" fontSize="lg" textAlign="center" textColor="white">
          Have you tried one of our other pages instead? Browse our
          documentation or more features across the site from one of our quick
          links below
        </Text>
      </Stack>
      <Stack spacing={5} alignItems="center" mb={8}>
        <HStack
          spacing={{ base: 0, md: 10 }}
          justifyContent="center"
          maxW={{ base: "500px", md: "100%" }}
          flexWrap="wrap"
        >
          {icons.map((icon, index) => (
            <VStack key={index} spacing={2}>
              <Box
                as={Link}
                href={`/${icon.name}`}
                p={6}
                rounded="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="transparent"
                textColor="white"
                _hover={{
                  bgGradient: "transparent",
                  opacity: 0.9,
                  transform: "scale(1.1)",
                  cursor: "pointer",
                }}
                transition={"all 0.1s ease-in-out"}
              >
                {icon.icon}
              </Box>
              <Text fontSize="lg" color="gray.200">
                {icon.name}
              </Text>
            </VStack>
          ))}
        </HStack>
        <Text maxW="500px" fontSize="md" textAlign="center" textColor="white">
          Not sure what youre looking for? Hit the feeling lucky button to visit
          a random page from our site.
        </Text>
      </Stack>
    </Container>
  );
};

export default Custom404;
