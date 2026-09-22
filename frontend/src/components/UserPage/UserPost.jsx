import {
  Avatar,
  Box,
  Flex,
  Image,
  Text,
  VStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { FaRegCopy } from "react-icons/fa6";
import { DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import Actions from "./Actions";
import useShowToast from "../../hooks/useShowToast";

const UserPost = ({ post, postedBy, onDelete }) => {
  const navigate = useNavigate();
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);

  const author = post?.postedBy || postedBy;
  const isAuthor = currentUser?._id === author?._id;

  // Theme color tokens
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const primaryText = useColorModeValue("gray.900", "gray.100");
  const secondaryText = useColorModeValue("gray.500", "gray.400");
  const hoverBg = useColorModeValue("gray.50", "whiteAlpha.50");

  const formattedDate = post?.createdAt
    ? `${formatDistanceToNow(new Date(post.createdAt))} ago`
    : "";

  const handlePostNavigation = (e) => {
    if (
      e.target.closest("button") ||
      e.target.closest("svg") ||
      e.target.closest(".prevent-post-nav")
    ) {
      return;
    }
    navigate(`/${author?.username}/post/${post?._id}`);
  };

  const handleCopyLink = (e) => {
    e.stopPropagation();
    const postUrl = `${window.location.origin}/${author?.username}/post/${post?._id}`;
    navigator.clipboard.writeText(postUrl);
    showToast("Copied", "Post link copied to clipboard", "success");
  };

  return (
    <Box
      w="100%"
      py={4}
      px={{ base: 2, md: 4 }}
      borderBottom="1px solid"
      borderColor={borderColor}
      cursor="pointer"
      transition="background 0.15s ease"
      _hover={{ bg: hoverBg }}
      onClick={handlePostNavigation}
    >
      <Flex gap={3} align="flex-start">
        {/* Author Avatar */}
        <Avatar
          size="md"
          src={author?.profilePic}
          name={author?.name || author?.username}
          cursor="pointer"
          className="prevent-post-nav"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/${author?.username}`);
          }}
        />

        {/* Post Content Area */}
        <VStack align="flex-start" flex="1" spacing={2} minW="0">
          {/* Header Row: Username, Timestamp, Options */}
          <Flex justify="space-between" align="center" w="100%">
            <Flex
              align="center"
              gap={2}
              className="prevent-post-nav"
              cursor="pointer"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/${author?.username}`);
              }}
            >
              <Text
                fontWeight="700"
                fontSize="sm"
                color={primaryText}
                _hover={{ textDecoration: "underline" }}
                noOfLines={1}
              >
                {author?.username}
              </Text>
              <Text fontSize="xs" color={secondaryText} whiteSpace="nowrap">
                • {formattedDate}
              </Text>
            </Flex>

            {/* Menu Options */}
            <Box
              className="prevent-post-nav"
              onClick={(e) => e.stopPropagation()}
            >
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<BsThreeDots />}
                  aria-label="Post options"
                  variant="ghost"
                  size="xs"
                  borderRadius="full"
                />
                <MenuList fontSize="sm" minW="140px" shadow="md">
                  <MenuItem icon={<FaRegCopy />} onClick={handleCopyLink}>
                    Copy link
                  </MenuItem>
                  {isAuthor && onDelete && (
                    <MenuItem
                      icon={<DeleteIcon />}
                      color="red.500"
                      onClick={() => onDelete(post?._id)}
                    >
                      Delete
                    </MenuItem>
                  )}
                </MenuList>
              </Menu>
            </Box>
          </Flex>

          {/* Post Content */}
          {post?.content && (
            <Text
              fontSize="sm"
              color={primaryText}
              whiteSpace="pre-wrap"
              wordBreak="break-word"
              textAlign="start"
              lineHeight="tall"
            >
              {post.content}
            </Text>
          )}

          {/* Post Image Attachment */}
          {post?.img && (
            <Box
              w="100%"
              maxH="380px"
              borderRadius="xl"
              overflow="hidden"
              border="1px solid"
              borderColor={borderColor}
              mt={1}
            >
              <Image
                src={post.img}
                alt="Post attachment"
                w="100%"
                h="auto"
                maxH="380px"
                objectFit="cover"
              />
            </Box>
          )}

          {/* Post Actions Bar */}
          <Box w="100%" pt={1} onClick={(e) => e.stopPropagation()}>
            <Actions post={post} />
          </Box>
        </VStack>
      </Flex>
    </Box>
  );
};

export default UserPost;
