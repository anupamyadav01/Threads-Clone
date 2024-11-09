/* eslint-disable react/prop-types */
import { useState } from "react";
import { Avatar, Box, Flex, Text, Image, IconButton } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
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
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await axiosInstance.delete(`/post/${post._id}`);
      if (res.data.error) {
        showToast("Error", res.data.error, "error");
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
    <Link
      to={`/${postedBy.username}/post/${post._id}`}
      style={{ width: "100%" }}
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        bg="white"
        _dark={{ bg: "gray.800" }}
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.200"
        _dark={{ borderColor: "gray.700" }}
        p={{ base: 4, md: 6 }}
        mb={6}
        boxShadow="sm"
        _hover={{ boxShadow: "md" }}
      >
        {/* Avatar Section */}
        <Avatar
          size="lg"
          name={postedBy.name}
          src={postedBy?.profilePic || "/default-avatar.png"}
          mr={{ base: 0, md: 4 }}
          mb={{ base: 4, md: 0 }}
          alignSelf={{ base: "center", md: "flex-start" }}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/${postedBy?.username}`);
          }}
          cursor="pointer"
        />

        {/* Post Content Section */}
        <Flex direction="column" flex={1}>
          {/* Username and Timestamp */}
          <Flex justifyContent="space-between" align="center" mb={2}>
            <Box>
              <Text
                fontWeight="bold"
                fontSize={{ base: "md", md: "lg" }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${postedBy?.username}`);
                }}
                cursor="pointer"
              >
                {postedBy?.username}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>
            </Box>
            {currentUser?._id === postedBy._id && (
              <IconButton
                icon={<DeleteIcon />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={handleDeletePost}
                aria-label="Delete post"
              />
            )}
          </Flex>

          {/* Post Content with Show More / Show Less */}
          <Text
            fontSize={{ base: "sm", md: "md" }}
            color="gray.700"
            _dark={{ color: "gray.300" }}
            mb={4}
          >
            {post.content.length > 60 ? (
              <>
                {isExpanded ? post.content : `${post.content.slice(0, 60)}...`}
                <Text
                  as="span"
                  color="blue.500"
                  ml={2}
                  fontWeight="medium"
                  cursor="pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsExpanded(!isExpanded);
                  }}
                >
                  {isExpanded ? "Show less" : "Show more"}
                </Text>
              </>
            ) : (
              post.content
            )}
          </Text>

          {/* Post Image */}
          {post.img && (
            <Box borderRadius="md" overflow="hidden" mb={4}>
              <Image src={post.img} alt="Post image" w="100%" />
            </Box>
          )}

          {/* Actions Section */}
          <Actions post={post} />
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
