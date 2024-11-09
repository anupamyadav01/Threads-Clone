import { useEffect, useState } from "react";
import Profile from "../../components/UserPage/Profile";
import axiosInstance from "../../../axiosConfig";
import useShowToast from "../../hooks/useShowToast";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import postsAtom from "../../atoms/postsAtom";
import { Flex, Spinner, Text, Box } from "@chakra-ui/react";
import Post from "../../components/Post/Post";

const UserPage = () => {
  const showToast = useShowToast();
  const { username } = useParams();
  const [user, setUser] = useState([[]]);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      if (!user) return;
      setFetchingPosts(true);
      try {
        const res = await axiosInstance.get(`/post/user/${username}`);
        const data = res?.data?.posts;
        setPosts(data);
      } catch (error) {
        showToast(
          "Error",
          error.response?.data?.message || error.message,
          "error"
        );
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };

    getPosts();
  }, [username, showToast, setPosts, user]);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await axiosInstance.get(`/user/profile/${username}`);
        if (response?.data?.error) {
          showToast("Error", response?.data?.error, "error");
          setUser([[]]);
          return;
        } else {
          setUser(response?.data?.user);
          return;
        }
      } catch (error) {
        console.log("Error from getUserDetails: ", error);
      } finally {
        setLoading(false);
      }
    };
    getUserDetails();
  }, [username, showToast]);

  if (loading) {
    return (
      <Flex height="100vh" justify="center" align="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!user && loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!user && !loading)
    return (
      <Flex w="full" height="100vh" justify="center" align="center">
        <Text fontSize={{ base: "lg", md: "xl" }}>User not found</Text>
      </Flex>
    );

  return (
    <Box px={{ base: 4, md: 8 }} py={{ base: 6, md: 12 }}>
      {/* Profile component */}
      <Profile />

      {/* No posts message */}
      {!fetchingPosts && posts.length === 0 && (
        <Flex justify="center" mt={6}>
          <Text fontSize={{ base: "lg", md: "2xl" }} textAlign="center">
            User has no posts.
          </Text>
        </Flex>
      )}

      {/* Loading spinner for posts */}
      {fetchingPosts && (
        <Flex justify="center" my={12}>
          <Spinner size="xl" />
        </Flex>
      )}

      {/* Posts list */}
      <Box mt={6} w="full">
        {posts?.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))}
      </Box>
    </Box>
  );
};

export default UserPage;
