import { useEffect, useState } from "react";
import Profile from "../../components/UserPage/Profile";
import axiosInstance from "../../../axiosConfig";
import useShowToast from "../../hooks/useShowToast";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import postsAtom from "../../atoms/postsAtom";
import {
  Flex,
  Spinner,
  Text,
  Box,
  VStack,
  useColorModeValue,
  Center,
} from "@chakra-ui/react";
import Post from "../../components/Post/Post";

const UserPage = () => {
  const showToast = useShowToast();
  const { username } = useParams();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);

  const secondaryText = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.750");

  useEffect(() => {
    let isMounted = true;

    const getPosts = async () => {
      setFetchingPosts(true);
      try {
        const res = await axiosInstance.get(`/post/user/${username}`);
        const data = res?.data?.posts || res?.data || [];

        if (isMounted) {
          setPosts(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (isMounted) {
          setPosts([]);
          showToast(
            "Error",
            error.response?.data?.message || "Failed to load posts",
            "error",
          );
        }
      } finally {
        if (isMounted) {
          setFetchingPosts(false);
        }
      }
    };

    getPosts();

    return () => {
      isMounted = false;
    };
  }, [username, setPosts, showToast]);

  const postsList = Array.isArray(posts) ? posts : [];

  return (
    <Box maxW="680px" mx="auto" w="100%" px={{ base: 3, md: 4 }} pb={16}>
      {/* Profile Header Component */}
      <Profile />

      {/* Posts Section */}
      <Box mt={8}>
        {/* Loading Spinner */}
        {fetchingPosts && (
          <Center py={10}>
            <Spinner size="lg" thickness="3px" speed="0.7s" color="blue.500" />
          </Center>
        )}

        {/* Empty Posts State */}
        {!fetchingPosts && postsList.length === 0 && (
          <Center
            p={8}
            mt={4}
            border="1px dashed"
            borderColor={borderColor}
            borderRadius="2xl"
          >
            <VStack spacing={1}>
              <Text fontSize="md" fontWeight="semibold">
                No threads yet
              </Text>
              <Text fontSize="xs" color={secondaryText}>
                When @{username} shares thoughts or photos, they'll show up
                here.
              </Text>
            </VStack>
          </Center>
        )}

        {/* Posts Stream */}
        {!fetchingPosts && postsList.length > 0 && (
          <VStack spacing={3} align="stretch">
            {postsList.map((post) => (
              <Post key={post._id} post={post} postedBy={post?.postedBy} />
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default UserPage;
