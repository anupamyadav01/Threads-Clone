/* eslint-disable react/prop-types */

import {
  Avatar,
  Box,
  Flex,
  Image,
  Text,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import postsAtom from "../../atoms/postsAtom";
import Actions from "../Actions";
import useShowToast from "../../hooks/useShowToast";
import axiosInstance from "../../../axiosConfig";
import { useState } from "react";

const Post = ({ post, postedBy: propUser }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  console.log(posts);

  const navigate = useNavigate();

  // Color tokens
  const cardBg = useColorModeValue("white", "gray.850");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const threadLineColor = useColorModeValue("gray.200", "gray.700");
  const primaryTextColor = useColorModeValue("gray.900", "gray.100");
  const secondaryTextColor = useColorModeValue("gray.500", "gray.400");
  const hoverBg = useColorModeValue("gray.50", "whiteAlpha.50");

  const author = post?.postedBy || propUser;

  const handlePostNavigation = (e) => {
    if (
      e.target.closest("button") ||
      e.target.closest("svg") ||
      e.target.closest(".prevent-post-nav")
    ) {
      return;
    }
    navigate(`/${author?.username}/post/${post._id}`);
  };

  const handleDeletePost = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await axiosInstance.delete(`/post/${post._id}`);
      if (res.data?.error) {
        showToast("Error", res.data.error, "error");
        return;
      }
      showToast("Success", "Post deleted", "success");
      setPosts((prev) => prev.filter((p) => p._id !== post._id));
    } catch (error) {
      showToast(
        "Error",
        error.response?.data?.message || error.message,
        "error",
      );
    }
  };

  const handleProfileNavigation = (e) => {
    e.stopPropagation();
    navigate(`/${author?.username}`);
  };

  const formattedDate = post?.createdAt
    ? `${formatDistanceToNow(new Date(post.createdAt))} ago`
    : "";

  return (
    <Box
      w="100%"
      p={{ base: 3, md: 4 }}
      mb={4}
      bg={cardBg}
      border="1px solid white"
      borderColor={borderColor}
      borderRadius="xl"
      cursor="pointer"
      transition="all 0.15s ease"
      _hover={{ bg: hoverBg }}
      onClick={handlePostNavigation}
    >
      <Flex gap={3} align="stretch">
        {/* Left Column: Author Avatar + Thread Line + Mini Reply Avatars */}
        <Flex direction="column" align="center" flexShrink={0} w="40px">
          <Avatar
            size="sm"
            name={author?.name || author?.username}
            src={author?.profilePic}
            className="prevent-post-nav"
            cursor="pointer"
            onClick={handleProfileNavigation}
          />

          <Box
            flex="1"
            w="2px"
            bg={threadLineColor}
            my={2}
            borderRadius="full"
          />

          {/* Mini Reply Avatars */}
          <Box position="relative" w="100%" h="24px">
            {post?.replies?.length === 0 && (
              <Text fontSize="xs" textAlign="center">
                💬
              </Text>
            )}

            {post?.replies?.[0] && (
              <Avatar
                size="2xs"
                name={post.replies[0].username}
                src={post.replies[0].userProfilePic}
                position="absolute"
                top="0"
                left="2px"
              />
            )}

            {post?.replies?.[1] && (
              <Avatar
                size="2xs"
                name={post.replies[1].username}
                src={post.replies[1].userProfilePic}
                position="absolute"
                bottom="0"
                right="2px"
              />
            )}
          </Box>
        </Flex>

        {/* Right Column: Author Info, Content, Media, Actions */}
        <Flex direction="column" flex="1" minW="0" gap={2}>
          {/* Header Row */}
          <Flex justify="space-between" align="center" w="100%">
            <Flex
              align="center"
              gap={1}
              className="prevent-post-nav"
              cursor="pointer"
              onClick={handleProfileNavigation}
            >
              <Text
                fontWeight="700"
                fontSize="sm"
                color={primaryTextColor}
                _hover={{ textDecoration: "underline" }}
                noOfLines={1}
              >
                {author?.username}
              </Text>
              <Image src="/verified.png" w={3.5} h={3.5} alt="verified" />
            </Flex>

            <Flex align="center" gap={2}>
              <Text
                fontSize="xs"
                color={secondaryTextColor}
                whiteSpace="nowrap"
              >
                {formattedDate}
              </Text>

              {currentUser?._id === author?._id && (
                <IconButton
                  aria-label="Delete post"
                  icon={<DeleteIcon />}
                  size="xs"
                  variant="ghost"
                  colorScheme="red"
                  onClick={handleDeletePost}
                />
              )}
            </Flex>
          </Flex>

          {/* Post Content */}
          <Box>
            <Text
              fontSize="sm"
              color={primaryTextColor}
              whiteSpace="pre-wrap"
              wordBreak="break-word"
              lineHeight="tall"
            >
              {post?.content?.length > 150 && !isExpanded ? (
                <>
                  {post.content.slice(0, 150)}...
                  <Text
                    as="span"
                    color="blue.400"
                    ml={1}
                    fontWeight="semibold"
                    className="prevent-post-nav"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpanded(true);
                    }}
                  >
                    more
                  </Text>
                </>
              ) : (
                <>
                  {post?.content}
                  {isExpanded && post?.content?.length > 150 && (
                    <Text
                      as="span"
                      color="blue.400"
                      ml={2}
                      fontWeight="semibold"
                      className="prevent-post-nav"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(false);
                      }}
                    >
                      less
                    </Text>
                  )}
                </>
              )}
            </Text>
          </Box>

          {/* Post Image Attachment */}
          {post?.img && (
            <Box
              mt={1}
              borderRadius="xl"
              overflow="hidden"
              border="1px solid"
              borderColor={borderColor}
              maxH="420px"
              w="100%"
            >
              <Image
                src={post.img}
                alt="Post attachment"
                w="100%"
                h="auto"
                maxH="420px"
                objectFit="cover"
              />
            </Box>
          )}

          {/* Social Actions (Like, Reply, Repost, Share) */}
          <Box mt={1} onClick={(e) => e.stopPropagation()}>
            <Actions post={post} />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Post;
