import {
  Box,
  Text,
  VStack,
  HStack,
  Avatar,
  AvatarBadge,
  useColorModeValue,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Badge,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaHeart, FaUserPlus, FaComment, FaAt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// 1. Static notification list outside component scope (zero render overhead)
const MOCK_ACTIVITIES = [
  {
    id: 1,
    type: "follow",
    user: "john_doe",
    message: "started following you",
    timestamp: "2m",
    profilePic: "https://bit.ly/dan-abramov",
  },
  {
    id: 2,
    type: "like",
    user: "jane_smith",
    message: "liked your post",
    timestamp: "1h",
    profilePic: "https://bit.ly/ryan-florence",
  },
  {
    id: 3,
    type: "comment",
    user: "bob_jones",
    message: 'replied: "Looks amazing! 🔥"',
    timestamp: "3h",
    profilePic: "https://bit.ly/kent-c-dodds",
  },
  {
    id: 4,
    type: "mention",
    user: "alice_williams",
    message: "mentioned you in a thread",
    timestamp: "6h",
    profilePic: "https://bit.ly/prosper-baba",
  },
  {
    id: 5,
    type: "like",
    user: "mark_taylor",
    message: "liked your reply",
    timestamp: "1d",
    profilePic: "https://bit.ly/sage-adebayo",
  },
];

// Helper to render type-specific action badges on user avatars
const getNotificationBadge = (type) => {
  switch (type) {
    case "like":
      return (
        <AvatarBadge boxSize="1.25em" bg="pink.500" borderColor="transparent">
          <FaHeart size="0.6em" color="#fff" />
        </AvatarBadge>
      );
    case "follow":
      return (
        <AvatarBadge boxSize="1.25em" bg="blue.500" borderColor="transparent">
          <FaUserPlus size="0.6em" color="#fff" />
        </AvatarBadge>
      );
    case "comment":
      return (
        <AvatarBadge boxSize="1.25em" bg="green.500" borderColor="transparent">
          <FaComment size="0.6em" color="#fff" />
        </AvatarBadge>
      );
    case "mention":
      return (
        <AvatarBadge boxSize="1.25em" bg="purple.500" borderColor="transparent">
          <FaAt size="0.6em" color="#fff" />
        </AvatarBadge>
      );
    default:
      return null;
  }
};

const ActivitiesPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  // Modern UI theme tokens
  const cardBg = useColorModeValue("white", "gray.850");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const itemHoverBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const primaryText = useColorModeValue("gray.900", "gray.100");
  const secondaryText = useColorModeValue("gray.500", "gray.400");
  const activeTabColor = useColorModeValue("black", "white");

  const filteredNotifications =
    filter === "all"
      ? MOCK_ACTIVITIES
      : MOCK_ACTIVITIES.filter((item) => item.type === filter);

  return (
    <Box
      w="100%"
      maxW="620px"
      mx="auto"
      mt={{ base: 4, md: 8 }}
      px={{ base: 2, md: 4 }}
      pb={12}
    >
      <Box
        bg={cardBg}
        borderRadius="2xl"
        border="1px solid"
        borderColor={borderColor}
        p={{ base: 4, md: 6 }}
        boxShadow="0 20px 40px -15px rgba(0, 0, 0, 0.05)"
      >
        {/* Header */}
        <HStack justify="space-between" align="center" mb={4}>
          <HStack spacing={3}>
            <Text
              fontSize="2xl"
              fontWeight="700"
              letterSpacing="-0.02em"
              color={primaryText}
            >
              Activity
            </Text>
            <Badge
              colorScheme="purple"
              borderRadius="full"
              px={2}
              fontSize="xs"
            >
              {MOCK_ACTIVITIES.length}
            </Badge>
          </HStack>
        </HStack>

        {/* Filter Tabs (All, Replies, Mentions, Follows) */}
        <Tabs
          variant="soft-rounded"
          colorScheme="gray"
          size="sm"
          onChange={(index) => {
            const filters = ["all", "comment", "mention", "follow"];
            setFilter(filters[index]);
          }}
        >
          <TabList
            gap={1}
            overflowX="auto"
            pb={2}
            css={{ scrollbarWidth: "none" }}
          >
            <Tab
              _selected={{
                color: activeTabColor,
                bg: useColorModeValue("gray.100", "gray.700"),
              }}
            >
              All
            </Tab>
            <Tab
              _selected={{
                color: activeTabColor,
                bg: useColorModeValue("gray.100", "gray.700"),
              }}
            >
              Replies
            </Tab>
            <Tab
              _selected={{
                color: activeTabColor,
                bg: useColorModeValue("gray.100", "gray.700"),
              }}
            >
              Mentions
            </Tab>
            <Tab
              _selected={{
                color: activeTabColor,
                bg: useColorModeValue("gray.100", "gray.700"),
              }}
            >
              Follows
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0} pt={4}>
              <VStack spacing={2} align="stretch">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((item) => (
                    <Box
                      key={item.id}
                      p={3.5}
                      borderRadius="xl"
                      cursor="pointer"
                      transition="background 0.15s ease"
                      _hover={{ bg: itemHoverBg }}
                      onClick={() => navigate(`/${item.user}`)}
                    >
                      <HStack spacing={3.5} align="center">
                        <Avatar
                          size="md"
                          src={item.profilePic}
                          name={item.user}
                          flexShrink={0}
                        >
                          {getNotificationBadge(item.type)}
                        </Avatar>

                        <Box flex="1" minW="0">
                          <HStack justify="space-between" align="baseline">
                            <Text
                              fontSize="sm"
                              fontWeight="bold"
                              color={primaryText}
                              noOfLines={1}
                            >
                              {item.user}
                            </Text>
                            <Text
                              fontSize="xs"
                              color={secondaryText}
                              whiteSpace="nowrap"
                              ml={2}
                            >
                              {item.timestamp}
                            </Text>
                          </HStack>

                          <Text
                            fontSize="sm"
                            color={secondaryText}
                            noOfLines={2}
                            lineHeight="short"
                            mt={0.5}
                          >
                            {item.message}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  ))
                ) : (
                  <Box py={10} textAlign="center">
                    <Text fontSize="sm" color={secondaryText}>
                      No activity found in this category.
                    </Text>
                  </Box>
                )}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default ActivitiesPage;
