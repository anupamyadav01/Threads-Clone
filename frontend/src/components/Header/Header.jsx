/* eslint-disable react/prop-types */
import {
  Flex,
  Box,
  Image,
  Text,
  useColorMode,
  VStack,
  IconButton,
  Button,
} from "@chakra-ui/react";
import { GoHeart, GoHomeFill } from "react-icons/go";
import { IoAddOutline } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";
import LogoutButton from "../Auth/LogoutButton";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";

import modalAtom from "../../atoms/modalAtom";
import { useNavigate } from "react-router-dom";
import useShowToast from "../../hooks/useShowToast";
import { BsChatDotsFill } from "react-icons/bs";

const Header = ({ currentPage }) => {
  const showToast = useShowToast();
  const naviagte = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  // eslint-disable-next-line no-unused-vars
  const [isOpen, setIsOpen] = useRecoilState(modalAtom); // Global state for modal
  const handleOnClick = () => {
    naviagte("/create");
    setIsOpen(true);
  };

  const showUserProfile = () => {
    if (user) {
      naviagte(`/${user.username}`);
    } else {
      showToast("Error", "Login to view profile", "error");
      setTimeout(() => {
        naviagte("/auth");
      }, 2000);
    }
  };
  const navigateToSignIn = () => {
    naviagte("/auth");
  };
  return (
    <Box>
      <Flex
        zIndex={100}
        position="sticky"
        w={"100%"}
        justifyContent="space-between"
        alignItems="center"
        bg={colorMode === "dark" ? "gray.800" : "white"}
        px={6}
        py={4}
      >
        <Image
          cursor="pointer"
          alt="logo"
          w={8}
          src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
          onClick={toggleColorMode}
        />
        <Text fontWeight="bold" fontSize="lg">
          {currentPage} Home
        </Text>
        <Box>
          {user ? (
            <LogoutButton />
          ) : (
            <Button onClick={navigateToSignIn}>Sign In</Button>
          )}
        </Box>
      </Flex>
      {/* side bar  */}
      <VStack
        zIndex={10}
        position={"fixed"}
        left={0}
        top={0}
        justifyContent={"center"}
        height="90vh"
        p={4}
        spacing={6}
        bg={colorMode === "dark" ? "gray.800" : "white"}
        alignItems="flex-start"
      >
        <IconButton
          aria-label="Home"
          icon={<GoHomeFill />}
          onClick={() => naviagte("/")}
          variant="ghost"
          fontSize="35px"
        />
        <IconButton
          aria-label="Home"
          icon={<BsChatDotsFill />}
          onClick={() => naviagte("/chat")}
          variant="ghost"
          fontSize="30px"
        />
        <IconButton
          aria-label="Search"
          icon={<IoSearchOutline />}
          onClick={() => naviagte("/search")}
          variant="ghost"
          fontSize="30px"
        />
        <IconButton
          aria-label="Create Thread"
          icon={<IoAddOutline />}
          onClick={handleOnClick} // Set modal state to open
          variant="ghost"
          fontSize="35px"
        />
        <IconButton
          aria-label="Notifications"
          icon={<GoHeart />}
          onClick={() => naviagte("/activity")}
          variant="ghost"
          fontSize="30px"
        />
        <IconButton
          aria-label="Profile"
          icon={<FaRegUser />}
          onClick={showUserProfile}
          variant="ghost"
          fontSize="25px"
        />
      </VStack>
    </Box>
  );
};

export default Header;
