import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
// Here we have used react-icons package for the icons
import { ConnectWallet } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { AiOutlineClose } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { dropdownLinks } from "../../consts/DropdownLinks";
import { navLinks } from "../../consts/NavLinks";

import { FaWallet } from "react-icons/fa";

export default function Navbar({ projectName }: { projectName: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();

  const router = useRouter();

  return (
    <Box p={{ base: 2, md: 4 }} bg="transparent" justifyContent={"center"}>
      <Flex
        h={16}
        alignItems="center"
        justifyContent="space-between"
        mx="auto"
        borderBottom={"1px solid white"}
      >
        <HStack spacing={8} alignItems="center" justifyContent={"center"}>
          {navLinks.map((link, index) => (
            <NavLink key={index} {...link} onClose={onClose} />
          ))}
        </HStack>

        <Button
          as={ConnectWallet}
          bg="transparent"
          rounded="md"
          textColor="white"
          textAlign={"center"}
          justifyContent={"Center"}
          display={{ base: "none", md: "block" }}
          _hover={{
            bg: "transparent",
          }}
          rightIcon={<FaWallet color="white" />}
          showThirdwebBranding={false}
          modalTitleIconUrl="/2.svg"
          termsOfServiceUrl="https://your-terms-of-service-url.com"
          privacyPolicyUrl="https://your-privacy-policy-url.com"
          welcomeScreen={() => {
            return <Image src="/banners/oozyconnect.png" w="100%" h="100%" />;
          }}
          auth={{
            loginOptional: false,
            onLogin: (token: string) => {
              console.log("User has logged in.");
              // Add your login logic here
            },

            onLogout: () => {
              console.log("User has logged out.");
              // Add your logout logic here
            },
          }}
          detailsBtn={() => {
            return (
              <Button
                size="md"
                textColor="white"
                rounded="md"
                m="auto"
                bg="transparent"
                display={{ base: "none", md: "block" }}
                rightIcon={<FaWallet color="white" />}
                _hover={{
                  bg: "transparent",
                }}
              >
                connected
              </Button>
            );
          }}
        >
          Sign in
        </Button>

        <IconButton
          borderRadius={"md"}
          bg="transparent"
          size="md"
          color="white"
          icon={
            isOpen ? (
              <AiOutlineClose color="white" />
            ) : (
              <GiHamburgerMenu color="white" />
            )
          }
          aria-label="Open Menu"
          display={{ base: "inherit", md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />
      </Flex>
      {/* Mobile Screen Links */}
      {isOpen ? (
        <Box pb={4} display={{ base: "inherit", md: "none" }}>
          <Stack as="nav" spacing={2}>
            {navLinks?.map((link, index) => (
              <NavLink key={index} {...link} onClose={onClose} />
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}

// NavLink Component
interface NavLinkProps {
  name: string;
  path: string;
  onClose: () => void;
}

// Dropdown MenuLink Component
interface MenuLinkProps {
  name: string;
  path: string;
  onClose: () => void;
}

const NavLink = ({ name, path, onClose }: NavLinkProps) => {
  const isExternal = path.startsWith("https://");
  const router = useRouter();
  if (isExternal) {
    return (
      <a
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onClose()}
      >
        <Text
          textColor={"white"}
          _hover={{
            textShadow: "rgb(89, 76, 145) 0px 0px 7px 4px",

            color: "rgb(89, 76, 145) 0px 0px 7px 4px",
            textDecoration: "underline",
          }}
        >
          {name}
        </Text>
      </a>
    );
  }

  return (
    <Link
      lineHeight="inherit"
      _hover={{
        textShadow: "rgb(89, 76, 145) 0px 0px 7px 4px",
        textDecoration: "underline",
      }}
      onClick={() => {
        router.push(path);
        onClose();
      }}
      textColor={"white"}
    >
      {name}
    </Link>
  );
};

const MenuLink = ({ name, path, onClose }: MenuLinkProps) => {
  const isExternal = path.startsWith("https://");
  const router = useRouter();

  if (isExternal) {
    return (
      <Link
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          onClose();
        }}
      >
        <MenuItem
          textColor={"white"}
          bg={"transparent"}
          _hover={{
            cursor: "pointer",
            color: "rgb(89, 76, 145) 0px 0px 7px 4px",
            textShadow: "rgb(89, 76, 145) 0px 0px 7px 4px",

            textDecoration: "underline",
          }}
        >
          <Text textColor={"white"}>{name}</Text>
        </MenuItem>
      </Link>
    );
  }

  return (
    <Link
      onClick={() => {
        router.push(path?.toString());
        onClose();
      }}
      textColor={"white"}
    >
      <MenuItem
        textColor={"white"}
        bg={"transparent"}
        _hover={{
          cursor: "pointer",
          color: "rgb(89, 76, 145) 0px 0px 7px 4px",
          textShadow: "rgb(89, 76, 145) 0px 0px 7px 4px",

          textDecoration: "underline",
        }}
      >
        <Text>{name}</Text>
      </MenuItem>
    </Link>
  );
};
