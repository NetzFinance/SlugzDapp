import {
  Box,
  SlideFade,
  Stack,
  Text,
  VStack,
  Image,
  keyframes,
  useBreakpointValue,
  useMediaQuery,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useEffect, useState } from "react";

const animationKeyframes = keyframes`
  0% { transform: scale(1) rotate(0); border-radius: 20%; }
  25% { transform: scale(2) rotate(0); border-radius: 20%; }
  50% { transform: scale(2) rotate(270deg); border-radius: 50%; }
  75% { transform: scale(1) rotate(270deg); border-radius: 50%; }
  100% { transform: scale(1) rotate(0); border-radius: 20%; }
`;

const text = "Netz-Fi";
const delayStep = 0.2; // delay between each letter's animation in seconds

const Home: NextPage = () => {
  const isBase = useBreakpointValue({ base: "flex", md: "none" });
  const [isSmallerThan768] = useMediaQuery("(max-width: 768px)");

  return (
    <VStack maxW="100%">
      <SlideFade in={true} offsetY="40px">
        <Image
          src={
            isSmallerThan768 ? "/banners/index_mob.svg" : "/banners/index.svg"
          }
          maxW="1000px"
          maxH="1000px"
          w="100%"
          h="100%"
          justifyContent={"center"}
          alignItems={"center"}
        />
      </SlideFade>
    </VStack>
  );
};

export default Home;
