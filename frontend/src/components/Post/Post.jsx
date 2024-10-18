/* eslint-disable react/prop-types */
import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon, useColorMode } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import postsAtom from "../../atoms/postsAtom";
import Actions from "../Actions";
import useShowToast from "../../hooks/useShowToast";
import axiosInstance from "../../../axiosConfig";

const Post = ({ post, postedBy }) => {
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();

      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await axiosInstance.delete(`/post/${post._id}`);

      const data = res.data;
      console.log(data);

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post deleted", "success");

      setPosts(posts.filter((p) => p._id !== post._id));
    } catch (error) {
      showToast(
        "Error",
        error.response?.data?.message || error.message,
        "error"
      );
    }
  };

  return (
    <Link to={`/${postedBy.username}/post/${post._id}`}>
      <Flex
        gap={3}
        mb={4}
        py={12}
        px={12}
        bg={colorMode === "dark" ? "gray.800" : "white"}
        borderRadius="md"
        border={"1px"}
        borderColor={colorMode === "dark" ? "gray.600" : "gray.400"}
      >
        <Flex flexDirection="column" alignItems="center">
          <Avatar
            size="md"
            name={postedBy.name}
            src={postedBy?.profilePic || "/default-avatar.png"}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${postedBy?.username}`);
            }}
            cursor="pointer"
          />
          <Box
            w="1px"
            h={"full"}
            bg="gray.light"
            my={2}
            border={"0.5px solid gray"}
          ></Box>
          <Box position={"relative"} w={"full"}>
            {post?.replies?.length === 0 && (
              <Text textAlign={"center"}>🥱</Text>
            )}
            {post?.replies[0] && (
              <Avatar
                size="xs"
                name="John doe"
                src={post?.replies[0].userProfilePic}
                position={"absolute"}
                top={"0px"}
                left="15px"
                padding={"2px"}
              />
            )}

            {post?.replies[1] && (
              <Avatar
                size="xs"
                name="John doe"
                src={post?.replies[1].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                right="-5px"
                padding={"2px"}
              />
            )}

            {post?.replies[2] && (
              <Avatar
                size="xs"
                name="John doe"
                src={post?.replies[2].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                left="4px"
                padding={"2px"}
              />
            )}
          </Box>
        </Flex>

        <Flex flex={1} flexDirection="column" gap={2}>
          <Flex justifyContent="space-between" w="full" mb={4}>
            <Flex w="full" alignItems="center">
              <Text
                pt={2}
                fontSize="base"
                fontWeight="medium"
                cursor="pointer"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${postedBy?.username}`);
                }}
              >
                {postedBy?.username}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>

            <Flex gap={4} alignItems="center">
              <Text
                fontSize="sm"
                width={36}
                textAlign="right"
                color={colorMode === "dark" ? "gray.300" : "gray.600"}
              >
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>

              {currentUser?._id === postedBy._id && (
                <DeleteIcon
                  size={20}
                  cursor="pointer"
                  onClick={handleDeletePost}
                />
              )}
            </Flex>
          </Flex>

          <Text
            fontSize="base"
            color={colorMode === "dark" ? "gray.300" : "gray.600"}
          >
            {post.content}
          </Text>

          {post.img && (
            <Box borderRadius={6} overflow="hidden">
              <Image src={post.img} w="full" />
            </Box>
          )}

          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
