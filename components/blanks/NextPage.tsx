import { Box } from "@chakra-ui/react";
import { NextPage } from "next";

interface HomeProps {
  title?: string;
}

const Home: NextPage<HomeProps> = ({ title }) => {
  return (
    <Box>
      <h1>{title}</h1>
    </Box>
  );
};

export default Home;

export const getServerSideProps = async () => {
  return {
    props: {
      title: "Home",
    },
  };
};
