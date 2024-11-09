import {
  Flex,
  Box,
  Image,
  Text,
  useColorMode,
  HStack,
  VStack,
  IconButton,
  Button,
} from "@chakra-ui/react";
import { GoHeart } from "react-icons/go";
import { BiHomeAlt2 } from "react-icons/bi";
import {
  IoAddOutline,
  IoChatbubbleEllipsesOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";
import LogoutButton from "../Auth/LogoutButton";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import modalAtom from "../../atoms/modalAtom";
import { useNavigate } from "react-router-dom";
import useShowToast from "../../hooks/useShowToast";
import { currentPageAtom } from "../../atoms/CurrentPageAtom";

const Header = () => {
  const showToast = useShowToast();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const [isOpen, setIsOpen] = useRecoilState(modalAtom);
  const [currentPage, setCurrentPage] = useRecoilState(currentPageAtom);

  const handleOnClick = () => {
    setCurrentPage("Create Post");
    navigate("/create");
    setIsOpen(true);
  };

  const showUserProfile = () => {
    if (user) {
      setCurrentPage("Profile");
      navigate(`/${user.username}`);
    } else {
      showToast("Error", "Login to view profile", "error");
      setTimeout(() => {
        navigate("/auth");
      }, 2000);
    }
  };

  const navigateToSignIn = () => {
    navigate("/auth");
  };

  return (
    <Box position="relative">
      {/* Responsive Header */}
      <Flex
        zIndex={100}
        position="fixed"
        top={0}
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        bg={colorMode === "dark" ? "gray.800" : "white"}
        px={{ base: 3, md: 6 }}
        py={{ base: 1, md: 4 }}
        height={"60px"}
      >
        <Image
          cursor="pointer"
          alt="logo"
          w={{ base: 5, md: 8 }}
          src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
          onClick={toggleColorMode}
        />
        <Text ml={20} fontSize={{ base: "md", md: "xl" }}>
          {currentPage}
        </Text>
        <Box>
          {user ? (
            <LogoutButton />
          ) : (
            <Button size={{ base: "xs", md: "md" }} onClick={navigateToSignIn}>
              Sign In
            </Button>
          )}
        </Box>
      </Flex>

      {/* Sidebar for larger screens */}
      <VStack
        height={"100vh"}
        zIndex={10}
        position="fixed"
        left={0}
        top={0}
        p={4}
        spacing={6}
        bg={colorMode === "dark" ? "gray.800" : "white"}
        display={{ base: "none", md: "flex" }}
        justifyContent={"center"}
      >
        <IconButton
          aria-label="Home"
          icon={<BiHomeAlt2 />}
          onClick={() => {
            setCurrentPage("Home");
            navigate("/");
          }}
          variant="ghost"
          fontSize="32px"
        />
        <IconButton
          aria-label="Chat"
          icon={<IoChatbubbleEllipsesOutline />}
          onClick={() => {
            setCurrentPage("Chat");
            navigate("/chat");
          }}
          variant="ghost"
          fontSize="30px"
        />
        <IconButton
          aria-label="Search"
          icon={<IoSearchOutline />}
          onClick={() => {
            setCurrentPage("Search");
            navigate("/search");
          }}
          variant="ghost"
          fontSize="30px"
        />
        <IconButton
          aria-label="Create Thread"
          icon={<IoAddOutline />}
          onClick={handleOnClick}
          variant="ghost"
          fontSize="35px"
        />
        <IconButton
          aria-label="Notifications"
          icon={<GoHeart />}
          onClick={() => {
            setCurrentPage("Notifications");
            navigate("/activity");
          }}
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

      {/* Centered Bottom Navigation for mobile */}
      <HStack
        zIndex={10}
        position="fixed"
        bottom={0}
        left="50%"
        transform="translateX(-50%)"
        width="90%"
        justifyContent="space-around"
        bg={colorMode === "dark" ? "gray.800" : "white"}
        p={2}
        borderRadius="md"
        display={{ base: "flex", md: "none" }}
        alignItems="center"
      >
        <IconButton
          aria-label="Home"
          icon={<BiHomeAlt2 />}
          onClick={() => {
            setCurrentPage("Home");
            navigate("/");
          }}
          variant="ghost"
          fontSize="24px"
        />
        <IconButton
          aria-label="Chat"
          icon={<IoChatbubbleEllipsesOutline />}
          onClick={() => {
            setCurrentPage("Chat");
            navigate("/chat");
          }}
          variant="ghost"
          fontSize="24px"
        />
        <IconButton
          aria-label="Search"
          icon={<IoSearchOutline />}
          onClick={() => {
            setCurrentPage("Search");
            navigate("/search");
          }}
          variant="ghost"
          fontSize="24px"
        />
        <IconButton
          aria-label="Create Thread"
          icon={<IoAddOutline />}
          onClick={handleOnClick}
          variant="ghost"
          fontSize="24px"
        />
        <IconButton
          aria-label="Notifications"
          icon={<GoHeart />}
          onClick={() => {
            setCurrentPage("Notifications");
            navigate("/activity");
          }}
          variant="ghost"
          fontSize="24px"
        />
        <IconButton
          aria-label="Profile"
          icon={<FaRegUser />}
          onClick={showUserProfile}
          variant="ghost"
          fontSize="24px"
        />
      </HStack>
    </Box>
  );
};

export default Header;
