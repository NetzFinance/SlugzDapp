import {
  Divider,
  HStack,
  IconButton,
  Link,
  LinkProps,
  Stack,
  useToast,
} from "@chakra-ui/react";
// Here we have used react-icons package for the icons
import { useRouter } from "next/router";
import { accounts } from "../../consts/SocialLinks";

const links = ["Documentation", "Terms of use", "Privacy policy"];

const Footer = () => {
  const toast = useToast();
  const router = useRouter();
  return (
    <Stack
      //bg={"linear-gradient(to top right, #1a202c, #9f7aea)"}
      textColor={"white"}
      w="100%"
      p={{ base: 2, lg: 4 }}
      marginInline="auto"
      spacing={{ base: 2, md: 0 }}
      justifyContent="space-between"
      alignItems="center"
      direction={{ base: "column", md: "row" }}
    >
      {/* Desktop Screen */}
      <HStack
        spacing={4}
        alignItems="center"
        display={{ base: "none", md: "flex" }}
      >
        {links.map((link, index) => (
          <CustomLink key={index}>{link}</CustomLink>
        ))}
      </HStack>

      {/* Mobile and Tablet Screens */}
      <Stack display={{ base: "flex", md: "none" }} alignItems="center">
        <HStack alignItems="center">
          <CustomLink onClick={() => router.push("")}>Documentation</CustomLink>
          <Divider h="1rem" orientation="vertical" />
          <CustomLink
            onClick={() =>
              toast({
                title: "TOS policy",
                status: "error",
                description:
                  "This documentation is not available yet, please check back soon",
              })
            }
          >
            Terms of use
          </CustomLink>
        </HStack>
        <CustomLink
          onClick={() =>
            toast({
              title: "Privacy policy",
              status: "error",
              description:
                "This documentation is not available yet, please check back soon",
            })
          }
        >
          Privacy policy
        </CustomLink>
      </Stack>

      <Stack
        direction="row"
        spacing={5}
        pt={{ base: 2, md: 0 }}
        alignItems="center"
      >
        {accounts.map((sc, index) => (
          <IconButton
            key={index}
            bg="transparent"
            _hover={{ bg: "transparent", color: "#8FFF00" }}
            as={Link}
            isExternal
            href={sc.url}
            aria-label={sc.label}
            icon={sc.icon}
            rounded="md"
            color={"white"}
          />
        ))}
      </Stack>
    </Stack>
  );
};

const CustomLink = ({ children, ...props }: LinkProps) => {
  return (
    <Link
      href="#"
      target="_blank"
      fontSize="sm"
      _hover={{ textDecoration: "underline", color: "#8FFF00" }}
      {...props}
    >
      {children}
    </Link>
  );
};

export default Footer;
