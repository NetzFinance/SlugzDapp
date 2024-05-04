import { Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

// NavLink Component
export interface NavLinkProps {
  name: string;
  path: string;
  onClose: () => void;
}

export const NavLink = ({ name, path, onClose }: NavLinkProps) => {
  const router = useRouter();
  const link = {
    bg: "gray.200",
    color: "blue.500",
  };

  return (
    <Button
      px={3}
      py={1}
      lineHeight="inherit"
      rounded="md"
      w="100%"
      border="1px solid white"
      onClick={() => {
        onClose();
        router.push(path);
      }}
      fontSize={["md", "md", "15px"]}
      textColor={"brand.steak1"}
      _hover={{
        textDecoration: "none",
        bg: link.bg,
        color: link.color,
        cursor: "pointer",
        transform: "scale(1.1)",
      }}
      _active={{
        textDecoration: "none",
        bg: link.bg,
        color: link.color,
        cursor: "pointer",
        transform: "scale(1)",
      }}
    >
      <Text
        p="2"
        _hover={{
          textDecoration: "none",
          color: link.color,
          cursor: "pointer",
        }}
      >
        {name}
      </Text>
    </Button>
  );
};
