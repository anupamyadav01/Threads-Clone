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
import { useNavigate, useParams } from "react-router-dom";
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
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const { postId } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

  const currentPost = posts[0];
  useEffect(() => {
    const getPost = async () => {
      setPosts([]); // Clear posts before loading new one
      try {
        // Make the GET request using axiosInstance
        const res = await axiosInstance.get(`/post/${postId}`);

        // Axios automatically parses the response, so access the data directly
        const data = res?.data?.data;
        // Handle potential error in the response
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        // Set the post data inside an array
        setPosts([data]);
      } catch (error) {
        // Handle errors using axios error object
        showToast(
          "Error",
          error.response?.data?.message || error.message,
          "error"
        );
      }
    };

    // Call the getPost function when postId or showToast changes
    getPost();
  }, [showToast, postId, setPosts]);

  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
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

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!currentPost) return null;
  return (
    <>
      <Flex my={12} mx={5} flexDirection={"column"}>
        <Flex
          w={"full"}
          alignItems={"center"}
          gap={3}
          justifyContent={"space-between"}
        >
          <Flex justifyItems={"center"} gap={2} alignItems={"center"}>
            <Avatar src={user?.profilePic} size={"sm"} name={user?.name} />
            <Flex gap={1} alignItems={"center"} justifyContent={"center"}>
              <Text fontSize={"base"} fontWeight={"medium"}>
                {user?.username}
              </Text>
              <Image src="/verified.png" w="4" h={4} />
            </Flex>
          </Flex>
          <Flex gap={4} alignItems={"center"}>
            <Text
              fontSize={"xs"}
              width={36}
              textAlign={"right"}
              color={"gray.light"}
            >
              {formatDistanceToNow(new Date(currentPost?.createdAt))} ago
            </Text>
            <Flex gap={4} alignItems={"center"}>
              {currentUser?._id === user._id && (
                <DeleteIcon
                  size={20}
                  cursor={"pointer"}
                  onClick={handleDeletePost}
                />
              )}
            </Flex>
          </Flex>
        </Flex>
        <Text my={3}>{currentPost?.content}</Text>
        {currentPost?.img && (
          <Box
            borderRadius={6}
            overflow={"hidden"}
            border={"1px solid"}
            borderColor={"gray.light"}
          >
            <Image src={currentPost?.img} w={"full"} />
          </Box>
        )}

        <Flex gap={3} my={3}>
          <Actions post={currentPost} />
        </Flex>

        <Divider my={4} />

        <Flex justifyContent={"space-between"}>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"2xl"}>👋</Text>
            <Text color={"gray.light"}>
              Get the app to like, reply and post.
            </Text>
          </Flex>
          <Button>Get</Button>
        </Flex>

        <Divider my={4} />
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
    </>
  );
};

export default PostDetails;
