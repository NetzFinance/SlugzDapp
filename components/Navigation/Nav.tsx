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
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ConnectWallet } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { FaWallet } from "react-icons/fa";
import { dropdownLinks } from "../../consts/DropdownLinks";
import { navLinks } from "../../consts/NavLinks";

export default function Navbar() {
  const [isHovered, setIsHovered] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const toast = useToast();

  return (
    <Box
      px={4}
      bg={"#747474"}
      bgImage={"/banners/navbar.svg"}
      bgSize={{ base: "cover", md: "contain" }}
    >
      <Stack
        direction={"row"}
        h={16}
        alignItems="center"
        justifyContent="space-between"
        mx="auto"
      >
        <HStack>
          <Icon
            as={Image}
            src={
              isHovered ? "/banners/tinysluggreen.svg" : "/banners/tinyslug.svg"
            }
            h={8}
            w={8}
            onClick={() => {
              router.push("/");
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            _hover={{
              cursor: "pointer",
            }}
          />

          <Button
            as={ConnectWallet}
            bg="transparent"
            rounded="md"
            textColor="white"
            textAlign={"center"}
            justifyContent={"Center"}
            _hover={{
              bg: "transparent",
              textColor: "#8FFF00",
              color: "#8FFF00",
            }}
            rightIcon={
              <Icon
                as={FaWallet}
                color="white"
                _hover={{
                  bg: "transparent",
                  textColor: "#8FFF00",
                  color: "#8FFF00",
                }}
              />
            }
            modalTitle="You do the oozin, we do the goozin"
            showThirdwebBranding={false}
            modalTitleIconUrl="/banners/tinyslug.svg"
            termsOfServiceUrl="https://your-terms-of-service-url.com"
            privacyPolicyUrl="https://your-privacy-policy-url.com"
            welcomeScreen={() => {
              return <Image src="/banners/oozyconnect.png" w="100%" h="100%" />;
            }}
            display={{ base: "block", md: "none" }}
            onConnect={() => {
              toast({
                title: "Oozer has logged in",
                description: "Welcome to the Oozy Goozy Web3 Hub!",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
            }}
            auth={{
              loginOptional: false,
              onLogin: (token: string) => {
                toast({
                  title: "Oozer has logged in",
                  description: "Welcome to the Oozy Goozy Web3 Hub!",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
              },

              onLogout: () => {
                // Add your logout logic here
                toast({
                  title: "Oozer has logged out",
                  description: "Oozer has logged out",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
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
                  display={{ base: "block", md: "none" }}
                  rightIcon={
                    <Icon
                      as={FaWallet}
                      _hover={{
                        bg: "transparent",
                        textColor: "#8FFF00",
                        color: "#8FFF00",
                      }}
                    />
                  }
                  _hover={{
                    bg: "transparent",
                    textColor: "#8FFF00",
                    color: "#8FFF00",
                  }}
                >
                  connected
                </Button>
              );
            }}
          >
            Sign in
          </Button>
        </HStack>

        <HStack spacing={8} alignItems="center">
          <HStack
            as="nav"
            spacing={6}
            display={{ base: "none", md: "flex" }}
            alignItems="center"
            pl={100}
          >
            {navLinks.map((link, index) => (
              <NavLink key={index} {...link} onClose={onClose} />
            ))}

            {/* Dropdown Menu */}
            <Menu autoSelect={false} isLazy>
              {({ isOpen, onClose }) => (
                <>
                  <MenuButton _hover={{ color: "#8FFF00" }}>
                    <Flex alignItems="center">
                      <Text>Utility</Text>
                      <Icon
                        as={BiChevronDown}
                        h={5}
                        w={5}
                        ml={1}
                        transition="all .25s ease-in-out"
                        transform={isOpen ? "rotate(180deg)" : ""}
                        _hover={{ color: "#8FFF00" }}
                      />
                    </Flex>
                  </MenuButton>
                  <MenuList
                    zIndex={5}
                    bg="black"
                    border="1px solid white"
                    boxShadow={useColorModeValue(
                      "2px 4px 6px 2px rgba(160, 174, 192, 0.6)",
                      "2px 4px 6px 2px rgba(9, 17, 28, 0.6)",
                    )}
                  >
                    {dropdownLinks.map((link, index) => (
                      <MenuLink
                        key={index}
                        name={link.name}
                        path={link.path}
                        onClose={onClose}
                      />
                    ))}
                  </MenuList>
                </>
              )}
            </Menu>
          </HStack>
        </HStack>

        <Button
          as={ConnectWallet}
          bg="transparent"
          rounded="md"
          textColor="white"
          textAlign={"center"}
          justifyContent={"Center"}
          _hover={{
            bg: "transparent",
            textColor: "#8FFF00",
            color: "#8FFF00",
          }}
          rightIcon={
            <Icon
              as={FaWallet}
              color="white"
              _hover={{
                bg: "transparent",
                textColor: "#8FFF00",
                color: "#8FFF00",
              }}
            />
          }
          modalTitle="Please choose a Wallet"
          showThirdwebBranding={false}
          modalTitleIconUrl="/banners/tinyslug.svg"
          termsOfServiceUrl="https://your-terms-of-service-url.com"
          privacyPolicyUrl="https://your-privacy-policy-url.com"
          welcomeScreen={() => {
            return <Image src="/banners/oozyconnect.png" w="100%" h="100%" />;
          }}
          display={{ base: "none", md: "block" }}
          onConnect={() => {
            toast({
              title: "Oozer has logged in",
              description: "Welcome to the Oozy Goozy Web3 Hub!",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          }}
          auth={{
            loginOptional: false,
            onLogin: (token: string) => {
              toast({
                title: "Oozer has logged in",
                description: "Welcome to the Oozy Goozy Web3 Hub!",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
            },

            onLogout: () => {
              // Add your logout logic here
              toast({
                title: "Oozer has logged out",
                description: "Oozer has logged out",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
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
                rightIcon={
                  <Icon
                    as={FaWallet}
                    _hover={{
                      bg: "transparent",
                      textColor: "#8FFF00",
                      color: "#8FFF00",
                    }}
                  />
                }
                _hover={{
                  bg: "transparent",
                  textColor: "#8FFF00",
                  color: "#8FFF00",
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
          size="md"
          icon={
            isOpen ? (
              <Icon
                as={Image}
                src={
                  isOpen ? "/banners/BURBER_HAPPY.svg" : "/banners/BURBER.svg"
                }
                h="8"
                w="8"
              />
            ) : (
              <Icon
                as={Image}
                src={
                  isOpen ? "/banners/BURBER_HAPPY.svg" : "/banners/BURBER.svg"
                }
                h="8"
                w="8"
              />
            )
          }
          color="white"
          _hover={{
            bg: "transparent",
          }}
          bg="transparent"
          aria-label="Open Menu"
          display={{ base: "inherit", md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />
      </Stack>

      {/* Mobile Screen Links */}
      {isOpen ? (
        <Box pb={4} display={{ base: "inherit", md: "none" }}>
          <Stack as="nav" spacing={2}>
            {navLinks.map((link, index) => (
              <NavLink key={index} {...link} onClose={onClose} />
            ))}
            <Text fontWeight="semibold" color="#8fff00">
              Utility
            </Text>
            <Stack pl={2} spacing={1} mt={"0 !important"}>
              {dropdownLinks.map((link, index) => (
                <NavLink key={index} {...link} onClose={onClose} />
              ))}
            </Stack>
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

const NavLink = ({ name, path, onClose }: NavLinkProps) => {
  const router = useRouter();

  return (
    <Link
      lineHeight="inherit"
      _hover={{
        textDecoration: "none",
        color: "#8FFF00",
      }}
      onClick={() => {
        router.push(path), onClose();
      }}
    >
      {name}
    </Link>
  );
};

// Dropdown MenuLink Component
interface MenuLinkProps {
  name: string;
  path: string;
  onClose: () => void;
}

const MenuLink = ({ name, path, onClose }: MenuLinkProps) => {
  const router = useRouter();
  return (
    <Link
      onClick={() => {
        router.push(path), onClose();
      }}
    >
      <MenuItem
        bg="transparent  "
        _hover={{
          color: "#8FFF00",
          bg: "grey.700",
          textColor: "#8FFF00",
        }}
      >
        <Text>{name}</Text>
      </MenuItem>
    </Link>
  );
};
