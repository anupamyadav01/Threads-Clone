import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Spinner,
  Text,
  Button,
  VStack,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import useShowToast from "../../hooks/useShowToast";
import axiosInstance from "../../../axiosConfig";
import Post from "../../components/Post/Post";

const FollowingPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const navigate = useNavigate();

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const subTextColor = useColorModeValue("gray.600", "gray.400");

  useEffect(() => {
    // If not logged in, redirect to auth
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const getFollowingPosts = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/post/following", {
          withCredentials: true,
        });
        setPosts(res.data || []);
      } catch (error) {
        showToast(
          "Error",
          error.response?.data?.error || error.message,
          "error",
        );
      } finally {
        setLoading(false);
      }
    };

    getFollowingPosts();
  }, [currentUser, showToast]);

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="60vh">
        <Spinner size="xl" thickness="3px" speed="0.8s" />
      </Flex>
    );
  }

  // Empty state: Not following anyone or no posts available
  if (posts.length === 0) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="70vh" px={4}>
        <VStack
          spacing={5}
          maxW="420px"
          w="100%"
          p={8}
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="2xl"
          boxShadow="0 8px 30px rgba(0, 0, 0, 0.05)"
          textAlign="center"
        >
          {/* Empty state illustration */}
          <Image
            src="https://illustrations.popertee.com/preview/user-connection.png"
            fallbackSrc="https://cdn-icons-png.flaticon.com/512/7486/7486744.png"
            alt="Follow suggestions"
            boxSize="140px"
            objectFit="contain"
          />

          <VStack spacing={2}>
            <Text fontSize="xl" fontWeight="bold">
              Your Feed is Empty
            </Text>
            <Text fontSize="sm" color={subTextColor} lineHeight="tall">
              Follow creators, friends, and accounts you love to see their
              latest posts and conversations right here.
            </Text>
          </VStack>

          <Button
            colorScheme="blue"
            size="md"
            borderRadius="full"
            px={6}
            onClick={() => navigate("/search")}
          >
            Find People to Follow
          </Button>
        </VStack>
      </Flex>
    );
  }

  // Posts Feed
  return (
    <Box maxW="620px" mx="auto" py={4} px={{ base: 2, sm: 4 }}>
      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </Box>
  );
};

export default FollowingPage;
