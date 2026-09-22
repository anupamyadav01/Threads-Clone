import { useState, useEffect } from "react";
import { Box, Text, Flex, Spinner, Center } from "@chakra-ui/react";
import axiosInstance from "../../../axiosConfig";
import Post from "../../components/Post/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../../atoms/postsAtom";
import SuggestedUsers from "../../components/SuggestedUsers";

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get("/post/feeds", {
          signal: controller.signal,
        });

        // Ensure state is always an array
        setPosts(response?.data?.data || []);
      } catch (err) {
        if (err.name === "CanceledError" || err.name === "AbortError") {
          return; // Skip state updates on unmount
        }
        const serverMessage =
          err.response?.data?.message || err.message || "Failed to fetch posts";
        setError(serverMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    return () => controller.abort();
  }, [setPosts]);

  if (loading) {
    return (
      <Flex height="80vh" justifyContent="center" alignItems="center">
        <Spinner size="xl" thickness="4px" speed="0.65s" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Center mt={10}>
        <Text color="red.500" fontSize="lg" fontWeight="semibold">
          {error}
        </Text>
      </Center>
    );
  }

  const postList = Array.isArray(posts) ? posts : [];

  return (
    <Flex
      mt="60px"
      direction={{ base: "column", md: "row" }}
      alignItems="flex-start"
      gap={8}
      maxW="1100px"
      mx="auto"
      px={4}
    >
      {/* Feed Column */}
      <Box flex={{ base: "1", md: "0.7" }} width="100%">
        {postList.length > 0 ? (
          postList.map((post) => (
            <Post key={post._id} post={post} postedBy={post?.postedBy} />
          ))
        ) : (
          <Center
            p={8}
            border="1px dashed"
            borderColor="gray.300"
            borderRadius="md"
          >
            <Text color="gray.500">
              No posts to show. Follow some users to build your feed!
            </Text>
          </Center>
        )}
      </Box>

      {/* Suggested Users Column */}
      <Box
        flex={{ base: "1", md: "0.3" }}
        width="100%"
        display={{ base: "none", md: "block" }}
      >
        <SuggestedUsers />
      </Box>
    </Flex>
  );
};

export default HomePage;
