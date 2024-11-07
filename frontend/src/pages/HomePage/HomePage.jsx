import { useState, useEffect } from "react";
import { Box, Text, Flex, Spinner } from "@chakra-ui/react";
import axiosInstance from "../../../axiosConfig";
import Post from "../../components/Post/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../../atoms/postsAtom";
import SuggestedUsers from "../../components/SuggestedUsers";

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Send GET request to fetch posts
        const response = await axiosInstance.get("/post/feeds");
        setPosts(response?.data?.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch posts");
        setLoading(false);
      }
    };
    fetchPosts();
  }, [setPosts]);
  // Conditional Rendering based on loading, error, and posts state
  if (loading) {
    return (
      <Flex height={"100vh"} justifyContent={"center"} alignItems={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (error) {
    return <Text color="red">{error}</Text>;
  }

  return (
    <Flex justify="center" justifyContent={"space-between"} gap={10}>
      <Box flex={70}>
        {/* List of Posts */}
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post key={post._id} post={post} postedBy={post?.postedBy} />
          ))
        ) : (
          <Text>No posts to show</Text>
        )}
      </Box>
      <Box flex={30}>
        <SuggestedUsers />
      </Box>
    </Flex>
  );
};

export default HomePage;
