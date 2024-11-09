/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Avatar,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import { IoMdNotifications } from "react-icons/io";

const ActivitiesPage = () => {
  const { colorMode } = useColorMode();
  const [notifications, setNotifications] = useState([]);

  // Dummy notifications data
  const dummyNotifications = [
    {
      id: 1,
      type: "follow",
      user: "john_doe",
      message: "started following you",
      timestamp: "2 minutes ago",
      profilePic: "https://bit.ly/dan-abramov",
    },
    {
      id: 2,
      type: "like",
      user: "jane_smith",
      message: "liked your post",
      timestamp: "1 hour ago",
      profilePic: "https://bit.ly/ryan-florence",
    },
    {
      id: 3,
      type: "comment",
      user: "bob_jones",
      message: "commented on your post",
      timestamp: "3 hours ago",
      profilePic: "https://bit.ly/kent-c-dodds",
    },
    {
      id: 4,
      type: "mention",
      user: "alice_williams",
      message: "mentioned you in a comment",
      timestamp: "6 hours ago",
      profilePic: "https://bit.ly/prosper-baba",
    },
    {
      id: 5,
      type: "like",
      user: "mark_taylor",
      message: "liked your post",
      timestamp: "1 day ago",
      profilePic: "https://bit.ly/sage-adebayo",
    },
  ];

  useEffect(() => {
    setNotifications(dummyNotifications);
  }, []);

  return (
    <Box
      p={{ base: 4, md: 6 }}
      maxW={{ base: "100%", md: "600px" }}
      mx="auto"
      bg={colorMode === "dark" ? "gray.900" : "white"}
      color={colorMode === "dark" ? "gray.300" : "gray.700"}
      borderRadius="md"
      shadow="lg"
    >
      <Text fontSize={{ base: "sm", md: "md" }} color="red.500" mb={4}>
        This Page is Under Development Work and All Data Is Dummy.
      </Text>

      <HStack justify="space-between" align="center" mb={6}>
        <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
          Notifications
        </Text>
        <IconButton
          aria-label="Notifications"
          icon={<IoMdNotifications />}
          size="lg"
        />
      </HStack>

      <VStack spacing={5} align="stretch">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Box
              key={notification.id}
              p={4}
              borderRadius="lg"
              shadow="sm"
              bg={colorMode === "dark" ? "gray.800" : "gray.50"}
              _hover={{ bg: colorMode === "dark" ? "gray.700" : "gray.100" }}
              transition="background 0.2s ease"
            >
              <HStack spacing={4}>
                <Avatar size="md" src={notification.profilePic} />

                <Box flex="1">
                  <HStack justify="space-between">
                    <Text
                      fontWeight="bold"
                      fontSize="md"
                      color={colorMode === "dark" ? "gray.200" : "gray.600"}
                    >
                      {notification.user}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {notification.timestamp}
                    </Text>
                  </HStack>
                  <Text color={colorMode === "dark" ? "gray.300" : "gray.700"}>
                    {notification.message}
                  </Text>
                </Box>
              </HStack>
            </Box>
          ))
        ) : (
          <Text textAlign="center" color="gray.500">
            No notifications to show.
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default ActivitiesPage;
