import {
  Flex,
  Box,
  Image,
  useColorMode,
  useColorModeValue,
  HStack,
  VStack,
  IconButton,
  Button,
  Tooltip,
} from "@chakra-ui/react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { BiHomeAlt2, BiSolidHomeAlt2 } from "react-icons/bi";
import {
  IoAddOutline,
  IoChatbubbleEllipsesOutline,
  IoChatbubbleEllipses,
  IoSearchOutline,
} from "react-icons/io5";
import { FaRegUser, FaUser } from "react-icons/fa6";
import LogoutButton from "../Auth/LogoutButton";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../../atoms/userAtom";
import modalAtom from "../../atoms/modalAtom";
import { useLocation, useNavigate } from "react-router-dom";
import useShowToast from "../../hooks/useShowToast";

const Header = () => {
  const showToast = useShowToast();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const setIsOpen = useSetRecoilState(modalAtom);

  const headerBg = useColorModeValue("white", "gray.850");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const activeColor = useColorModeValue("black", "white");
  const inactiveColor = useColorModeValue("gray.500", "gray.400");

  const showUserProfile = () => {
    if (user) {
      navigate(`/${user.username}`);
    } else {
      showToast("Error", "Login to view profile", "error");
      navigate("/auth");
    }
  };

  const navItems = [
    {
      label: "Home",
      path: "/",
      icon: pathname === "/" ? <BiSolidHomeAlt2 /> : <BiHomeAlt2 />,
      onClick: () => navigate("/"),
    },
    {
      label: "Search",
      path: "/search",
      icon: <IoSearchOutline />,
      onClick: () => navigate("/search"),
    },
    {
      label: "Create Post",
      path: "/create",
      icon: <IoAddOutline />,
      onClick: () => {
        if (!user) {
          showToast("Error", "Login to create a post", "error");
          navigate("/auth");
          return;
        }
        setIsOpen(true);
        navigate("/create");
      },
    },
    {
      label: "Chat",
      path: "/chat",
      icon:
        pathname === "/chat" ? (
          <IoChatbubbleEllipses />
        ) : (
          <IoChatbubbleEllipsesOutline />
        ),
      onClick: () => {
        if (!user) {
          showToast("Error", "Login to chat", "error");
          navigate("/auth");
          return;
        }
        navigate("/chat");
      },
    },
    {
      label: "Activity",
      path: "/activity",
      icon: pathname === "/activity" ? <GoHeartFill /> : <GoHeart />,
      onClick: () => {
        if (!user) {
          showToast("Error", "Login to view activity", "error");
          navigate("/auth");
          return;
        }
        navigate("/activity");
      },
    },
    {
      label: "Profile",
      path: user ? `/${user.username}` : "/auth",
      icon: pathname === `/${user?.username}` ? <FaUser /> : <FaRegUser />,
      onClick: showUserProfile,
    },
  ];

  return (
    <>
      {/* 1. Top Navbar */}
      <Flex
        position="sticky"
        top={0}
        zIndex={100}
        w="100%"
        h="60px"
        alignItems="center"
        justifyContent="space-between"
        px={{ base: 3, md: 8 }}
        bg={headerBg}
        borderBottom="1px solid"
        borderColor={borderColor}
        backdropFilter="blur(10px)"
      >
        {/* Left: Logo */}
        <Image
          cursor="pointer"
          alt="Threads logo"
          w={{ base: 6, md: 7 }}
          src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
          onClick={toggleColorMode}
          title="Toggle color mode"
        />

        {/* Center: Top Navigation Bar for Small Screens (Hidden on desktop) */}
        <HStack
          spacing={{ base: 1, sm: 2 }}
          display={{ base: "flex", lg: "none" }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <IconButton
                key={item.label}
                aria-label={item.label}
                icon={item.icon}
                variant="ghost"
                size="sm"
                fontSize="20px"
                borderRadius="lg"
                color={isActive ? activeColor : inactiveColor}
                bg={
                  isActive
                    ? useColorModeValue("gray.100", "gray.750")
                    : "transparent"
                }
                _hover={{
                  bg: useColorModeValue("gray.100", "gray.750"),
                  color: activeColor,
                }}
                onClick={item.onClick}
              />
            );
          })}
        </HStack>

        {/* Right: Auth / Action Button */}
        <Box>
          {user ? (
            <LogoutButton />
          ) : (
            <Button
              size="sm"
              colorScheme="blue"
              borderRadius="full"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Flex>

      {/* 2. Floating Sidebar for Desktop (Hidden on small screens) */}
      <VStack
        position="fixed"
        left={4}
        top="50%"
        transform="translateY(-50%)"
        zIndex={90}
        spacing={4}
        p={2.5}
        bg={headerBg}
        borderRadius="2xl"
        border="1px solid"
        borderColor={borderColor}
        boxShadow="0 4px 20px rgba(0, 0, 0, 0.06)"
        display={{ base: "none", lg: "flex" }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Tooltip
              key={item.label}
              label={item.label}
              placement="right"
              hasArrow
            >
              <IconButton
                aria-label={item.label}
                icon={item.icon}
                variant="ghost"
                fontSize="22px"
                borderRadius="xl"
                color={isActive ? activeColor : inactiveColor}
                bg={
                  isActive
                    ? useColorModeValue("gray.100", "gray.750")
                    : "transparent"
                }
                _hover={{
                  bg: useColorModeValue("gray.100", "gray.750"),
                  color: activeColor,
                }}
                onClick={item.onClick}
              />
            </Tooltip>
          );
        })}
      </VStack>
    </>
  );
};

export default Header;
