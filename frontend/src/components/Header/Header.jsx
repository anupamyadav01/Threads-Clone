/* eslint-disable react/prop-types */
import {
  Flex,
  Box,
  Image,
  Text,
  Button,
  useColorMode,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import { GoHeart, GoHomeFill } from "react-icons/go";
import { IoAddOutline } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";

const Header = ({ currentPage }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box>
      {/* Header */}
      <Flex
        zIndex={100}
        position="fixed"
        w={"100%"}
        justifyContent="space-between"
        alignItems="center"
        bg={colorMode === "dark" ? "gray.800" : "white"}
        px={6}
        py={4}
        shadow="sm"
      >
        {/* Left - Logo */}
        <Image
          cursor="pointer"
          alt="logo"
          w={8}
          src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
          onClick={toggleColorMode}
        />

        {/* Center - Current page name */}
        <Text fontWeight="bold" fontSize="lg">
          {currentPage} Home
        </Text>

        {/* Right - Sign-in button */}
        <Button
          colorScheme={colorMode === "dark" ? "white" : "gray.800"}
          bg={colorMode === "dark" ? "white" : "gray.800"}
        >
          Sign In
        </Button>
      </Flex>

      {/* Sidebar */}
      <VStack
        zIndex={10}
        position="fixed"
        left={0}
        top={0}
        justifyContent={"center"}
        height="100vh"
        p={4}
        spacing={6}
        bg={colorMode === "dark" ? "gray.800" : "white"}
        alignItems="flex-start"
      >
        <IconButton
          aria-label="Home"
          icon={<GoHomeFill />}
          variant="ghost"
          fontSize="35px"
        />
        <IconButton
          aria-label="Search"
          icon={<IoSearchOutline />}
          variant="ghost"
          fontSize="30px"
        />
        <IconButton
          aria-label="Create Thread"
          icon={<IoAddOutline />}
          variant="ghost"
          fontSize="35px"
        />
        <IconButton
          aria-label="Notifications"
          icon={<GoHeart />}
          variant="ghost"
          fontSize="30px"
        />
        <IconButton
          aria-label="Notifications"
          icon={<FaRegUser />}
          variant="ghost"
          fontSize="25px"
        />
      </VStack>
    </Box>
  );
};

export default Header;
