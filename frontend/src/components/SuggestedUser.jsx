import {
  Avatar,
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const SuggestedUser = ({ user }) => {
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

  const primaryText = useColorModeValue("gray.800", "gray.100");
  const secondaryText = useColorModeValue("gray.500", "gray.400");
  const hoverBg = useColorModeValue("gray.50", "whiteAlpha.50");

  if (!user) return null;

  return (
    <Flex
      w="100%"
      gap={3}
      justifyContent="space-between"
      alignItems="center"
      p={2}
      borderRadius="xl"
      transition="background 0.15s ease"
      _hover={{ bg: hoverBg }}
    >
      {/* Left side: Avatar + User Info (Links to user profile) */}
      <Flex
        as={Link}
        to={`/${user.username}`}
        gap={3}
        alignItems="center"
        flex="1"
        minW="0"
      >
        <Avatar
          size="sm"
          src={user.profilePic}
          name={user.name || user.username}
        />
        <Box flex="1" minW="0">
          <Text
            fontSize="sm"
            fontWeight="bold"
            color={primaryText}
            noOfLines={1}
            _hover={{ textDecoration: "underline" }}
          >
            {user.username}
          </Text>
          <Text fontSize="xs" color={secondaryText} noOfLines={1}>
            {user.name || user.username}
          </Text>
        </Box>
      </Flex>

      {/* Right side: Follow / Unfollow Button */}
      <Button
        size="xs"
        px={3}
        borderRadius="full"
        colorScheme={following ? "gray" : "blue"}
        variant={following ? "outline" : "solid"}
        onClick={handleFollowUnfollow}
        isLoading={updating}
        flexShrink={0}
      >
        {following ? "Unfollow" : "Follow"}
      </Button>
    </Flex>
  );
};

export default SuggestedUser;
