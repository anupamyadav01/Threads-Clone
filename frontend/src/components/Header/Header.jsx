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

  // Theme colors
  const headerBg = useColorModeValue(
    "rgba(255, 255, 255, 0.75)",
    "rgba(26, 32, 44, 0.75)",
  );

  const borderColor = useColorModeValue(
    "rgba(0, 0, 0, 0.08)",
    "rgba(255, 255, 255, 0.10)",
  );

  const activeColor = useColorModeValue("black", "white");
  const inactiveColor = useColorModeValue("gray.500", "gray.400");

  const activeBg = useColorModeValue(
    "rgba(0, 0, 0, 0.06)",
    "rgba(255, 255, 255, 0.10)",
  );

  const hoverBg = useColorModeValue(
    "rgba(0, 0, 0, 0.05)",
    "rgba(255, 255, 255, 0.08)",
  );

  const sidebarBg = useColorModeValue(
    "rgba(255, 255, 255, 0.80)",
    "rgba(26, 32, 44, 0.80)",
  );

  const showUserProfile = () => {
    if (user) {
      navigate(`/${user.username}`);
    } else {
      showToast("Error", "Login to view profile", "error");
      navigate("/auth");
    }
  };

  // Main sidebar navigation items
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
      {/* =========================
          TOP NAVBAR
      ========================= */}
      <Flex
        position="sticky"
        top={0}
        zIndex={100}
        w="100%"
        h={{ base: "52px", md: "54px" }}
        alignItems="center"
        justifyContent="space-between"
        px={{ base: 3, sm: 5, md: 8 }}
        bg={headerBg}
        borderBottom="1px solid"
        borderColor={borderColor}
        backdropFilter="blur(16px)"
      >
        {/* =========================
            LEFT - LOGO
        ========================= */}
        <Box flex="1">
          <Image
            cursor="pointer"
            alt="Threads logo"
            w={{ base: 6, md: 7 }}
            src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
            onClick={toggleColorMode}
            title="Toggle color mode"
          />
        </Box>

        {/* =========================
            CENTER - FEED TABS
        ========================= */}
        <HStack
          spacing={1}
          h="100%"
          justifyContent="center"
          position="absolute"
          left="50%"
          transform="translateX(-50%)"
        >
          {/* For You */}
          <Button
            variant="ghost"
            size="sm"
            px={{ base: 3, sm: 5 }}
            h="32px"
            borderRadius="full"
            fontSize={{ base: "13px", sm: "14px" }}
            fontWeight="600"
            color={pathname === "/" ? activeColor : inactiveColor}
            bg={pathname === "/" ? activeBg : "transparent"}
            _hover={{
              bg: hoverBg,
              color: activeColor,
            }}
            onClick={() => navigate("/")}
          >
            For You
          </Button>

          {/* Following */}
          <Button
            variant="ghost"
            size="sm"
            px={{ base: 3, sm: 5 }}
            h="32px"
            borderRadius="full"
            fontSize={{ base: "13px", sm: "14px" }}
            fontWeight="600"
            color={pathname === "/following" ? activeColor : inactiveColor}
            bg={pathname === "/following" ? activeBg : "transparent"}
            _hover={{
              bg: hoverBg,
              color: activeColor,
            }}
            onClick={() => navigate("/following")}
          >
            Following
          </Button>
        </HStack>

        {/* =========================
            RIGHT - LOGOUT
        ========================= */}
        <Flex flex="1" justifyContent="flex-end">
          {user && <LogoutButton />}
        </Flex>
      </Flex>

      {/* =========================
          DESKTOP SIDEBAR (lg and up)
      ========================= */}
      <VStack
        position="fixed"
        left={4}
        top="50%"
        transform="translateY(-50%)"
        zIndex={90}
        spacing={4}
        p={2.5}
        bg={sidebarBg}
        borderRadius="2xl"
        border="1px solid"
        borderColor={borderColor}
        boxShadow="0 4px 20px rgba(0, 0, 0, 0.06)"
        backdropFilter="blur(16px)"
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
                bg={isActive ? activeBg : "transparent"}
                _hover={{
                  bg: hoverBg,
                  color: activeColor,
                }}
                onClick={item.onClick}
              />
            </Tooltip>
          );
        })}
      </VStack>

      {/* =========================
          MOBILE BOTTOM BAR (below lg)
      ========================= */}
      <Flex
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        zIndex={90}
        h="56px"
        bg={headerBg}
        borderTop="1px solid"
        borderColor={borderColor}
        backdropFilter="blur(16px)"
        alignItems="center"
        justifyContent="space-around"
        px={2}
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
              fontSize="22px"
              borderRadius="xl"
              color={isActive ? activeColor : inactiveColor}
              bg={isActive ? activeBg : "transparent"}
              _hover={{
                bg: hoverBg,
                color: activeColor,
              }}
              onClick={item.onClick}
            />
          );
        })}
      </Flex>
    </>
  );
};

export default Header;
