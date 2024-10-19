import { useState, useEffect } from "react";
import { Box, Text, Flex, Spinner } from "@chakra-ui/react";
import axiosInstance from "../../../axiosConfig";
import Post from "../../components/Post/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../../atoms/postsAtom";

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  // Function to fetch posts

  // UseEffect to fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Send GET request to fetch posts
        const response = await axiosInstance.get("/post/feeds"); // Adjust the URL as per your backend route
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
    <Flex direction="column" align="center" justify="center">
      <Box>
        {/* List of Posts */}
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post key={post._id} post={post} postedBy={post?.postedBy} />
          ))
        ) : (
          <Text>No posts to show</Text>
        )}
      </Box>
    </Flex>
  );
};

export default HomePage;
