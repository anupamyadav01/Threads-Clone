import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../../atoms/postsAtom";
import useShowToast from "../../hooks/useShowToast";
import userAtom from "../../atoms/userAtom";
import Actions from "../../components/Actions";
import Comment from "../../components/Comment";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import axiosInstance from "../../../axiosConfig";

const PostDetails = () => {
  const navigate = useNavigate();
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const { postId } = useParams();
  const currentUser = useRecoilValue(userAtom);

  const currentPost = posts[0];

  useEffect(() => {
    const getPost = async () => {
      setPosts([]); // Clear posts before loading new one
      try {
        const res = await axiosInstance.get(`/post/${postId}`);
        const data = res?.data?.data;

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        setPosts([data]);
      } catch (error) {
        showToast(
          "Error",
          error.response?.data?.message || error.message,
          "error"
        );
      }
    };

    getPost();
  }, [showToast, postId, setPosts]);

  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await axiosInstance.delete(`/post/${currentPost._id}`);
      const data = res?.data;

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post deleted", "success");
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="50vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!currentPost) return null;

  return (
    <Flex my={12} mx={4} direction="column" maxW="container.md" w="full" p={4}>
      {/* Header */}
      <Flex w="full" alignItems="center" gap={3} justifyContent="space-between">
        <Flex gap={2} alignItems="center">
          <Avatar src={user?.profilePic} size="md" name={user?.name} />
          <Flex direction="column">
            <Link
              to={`/${user?.username}`}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="medium"
            >
              {user?.username}
            </Link>
            <Text fontSize="xs" color="gray.500">
              {formatDistanceToNow(new Date(currentPost?.createdAt))} ago
            </Text>
          </Flex>
        </Flex>

        {currentUser?._id === user?._id && (
          <DeleteIcon
            color="red.500"
            cursor="pointer"
            onClick={handleDeletePost}
            boxSize={6}
          />
        )}
      </Flex>

      {/* Post Content */}
      <Text my={3} fontSize={{ base: "sm", md: "md" }} color="gray.400">
        {currentPost?.content}
      </Text>

      {/* Post Image */}
      {currentPost?.img && (
        <Box
          borderRadius="md"
          overflow="hidden"
          borderWidth="1px"
          borderColor="gray.200"
          my={4}
        >
          <Image
            src={currentPost.img}
            w="100%"
            maxH={{ base: "200px", md: "400px" }}
            objectFit="cover"
          />
        </Box>
      )}

      {/* Actions */}
      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={4} />

      {/* App CTA Section */}
      <Flex
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        <Flex gap={2} alignItems="center">
          <Text fontSize="2xl">👋</Text>
          <Text fontSize={{ base: "sm", md: "md" }} color="gray.600">
            Get the app to like, reply, and post.
          </Text>
        </Flex>
        <Button colorScheme="blue" size="sm">
          Get
        </Button>
      </Flex>

      <Divider my={4} />

      {/* Comments */}
      {currentPost?.replies?.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          lastReply={
            reply?._id ===
            currentPost?.replies[currentPost?.replies?.length - 1]._id
          }
        />
      ))}
    </Flex>
  );
};

export default PostDetails;
