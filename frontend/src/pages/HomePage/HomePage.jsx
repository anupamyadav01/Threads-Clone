import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Flex,
  Spinner,
  Center,
  VStack,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import axiosInstance from "../../../axiosConfig";
import Post from "../../components/Post/Post";
import postsAtom from "../../atoms/postsAtom";
import userAtom from "../../atoms/userAtom";
import SuggestedUsers from "../../components/SuggestedUsers";

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

  // Modern UI theme tokens
  const borderColor = useColorModeValue("gray.250", "gray.750");
  const secondaryText = useColorModeValue("gray.500", "gray.400");
  const cardBg = useColorModeValue("white", "gray.850");

  useEffect(() => {
    const controller = new AbortController();

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Query feed (handles public feed if unauthenticated)
        const response = await axiosInstance.get("/post/feed", {
          signal: controller.signal,
        });

        // Safely extract posts across various response patterns
        const feedData =
          response?.data?.posts || response?.data?.data || response?.data;

        setPosts(Array.isArray(feedData) ? feedData : []);
      } catch (err) {
        if (err.name === "CanceledError" || err.name === "AbortError") {
          return;
        }
        const serverMessage =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch posts";
        setError(serverMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    return () => controller.abort();
  }, [setPosts]);

  const postList = Array.isArray(posts) ? posts : [];

  return (
    <Flex
      mt={{ base: "20px", md: "35px" }}
      direction={{ base: "column", md: "row" }}
      alignItems="flex-start"
      justifyContent="center"
      gap={8}
      maxW="1020px"
      mx="auto"
      px={{ base: 3, md: 6 }}
      pb={16}
    >
      {/* 1. Feed Column */}
      <Box flex="1" maxW="640px" width="100%" mx="auto">
        {/* Loading State */}
        {loading && (
          <Center py={14}>
            <Spinner size="lg" thickness="3px" speed="0.7s" color="blue.500" />
          </Center>
        )}

        {/* Error State */}
        {error && !loading && (
          <Center
            p={8}
            flexDirection="column"
            gap={3}
            border="1px dashed"
            borderColor="red.300"
            borderRadius="2xl"
          >
            <Text color="red.500" fontSize="sm" fontWeight="medium">
              {error}
            </Text>
            <Button
              size="xs"
              variant="outline"
              colorScheme="red"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </Center>
        )}

        {/* Post Feed */}
        {!loading && !error && postList.length > 0 && (
          <VStack spacing={4} align="stretch" w="100%">
            {postList.map((post) => (
              <Post key={post._id} post={post} postedBy={post?.postedBy} />
            ))}
          </VStack>
        )}

        {/* Empty Feed State */}
        {!loading && !error && postList.length === 0 && (
          <Center
            p={10}
            border="1px dashed"
            borderColor={borderColor}
            borderRadius="2xl"
            flexDirection="column"
            gap={2}
          >
            <Text fontSize="md" fontWeight="bold">
              Your feed is quiet
            </Text>
            <Text fontSize="sm" color={secondaryText} textAlign="center">
              {currentUser
                ? "Follow other creators to build your personal timeline."
                : "No posts found. Be the first to start a conversation!"}
            </Text>
            {!currentUser && (
              <Button
                size="sm"
                colorScheme="blue"
                borderRadius="full"
                mt={3}
                onClick={() => navigate("/auth")}
              >
                Log In to Post
              </Button>
            )}
          </Center>
        )}
      </Box>

      {/* 2. Suggested Users / Right Sidebar Column */}
      <Box
        w="300px"
        display={{ base: "none", lg: "block" }}
        position="sticky"
        top="80px"
      >
        {currentUser ? (
          <SuggestedUsers />
        ) : (
          /* Card for guest / logged-out visitors */
          <Box
            p={5}
            bg={cardBg}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="2xl"
            textAlign="center"
          >
            <Text fontSize="md" fontWeight="bold" mb={1}>
              Join the conversation
            </Text>
            <Text fontSize="xs" color={secondaryText} mb={4}>
              Sign up or log in to like, reply to posts, and follow people you
              know.
            </Text>
            <Button
              w="100%"
              size="sm"
              colorScheme="blue"
              borderRadius="xl"
              onClick={() => navigate("/auth")}
            >
              Sign Up / Log In
            </Button>
          </Box>
        )}
      </Box>
    </Flex>
  );
};

export default HomePage;
