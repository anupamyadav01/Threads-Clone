import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import postsAtom from "../../atoms/postsAtom";
import useShowToast from "../../hooks/useShowToast";
import axiosInstance from "../../../axiosConfig";

const Actions = ({ post }) => {
  const user = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();

  const [liked, setLiked] = useState(post?.likes?.includes(user?._id));
  const [isLiking, setIsLiking] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const textColor = useColorModeValue("gray.600", "gray.400");

  // Handle Like / Unlike
  const handleLikeAndUnlike = async () => {
    if (!user) {
      showToast("Error", "You must be logged in to like a post", "error");
      return;
    }
    if (isLiking) return;

    setIsLiking(true);
    try {
      const res = await axiosInstance.put(`/post/like/${post._id}`);
      const data = res.data;

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      if (!liked) {
        // Add user ID to post likes array in state
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: [...p.likes, user._id] };
          }
          return p;
        });
        setPosts(updatedPosts);
      } else {
        // Remove user ID from post likes array in state
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            return {
              ...p,
              likes: p.likes.filter((id) => id !== user._id),
            };
          }
          return p;
        });
        setPosts(updatedPosts);
      }

      setLiked(!liked);
    } catch (error) {
      showToast(
        "Error",
        error.response?.data?.message || error.message,
        "error",
      );
    } finally {
      setIsLiking(false);
    }
  };

  // Handle Submit Reply
  const handleReply = async () => {
    if (!user) {
      showToast("Error", "You must be logged in to reply", "error");
      return;
    }
    if (!replyText.trim() || isReplying) return;

    setIsReplying(true);
    try {
      const res = await axiosInstance.put(`/post/reply/${post._id}`, {
        text: replyText.trim(),
      });
      const data = res.data;

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      const updatedPosts = posts.map((p) => {
        if (p._id === post._id) {
          return { ...p, replies: [...p.replies, data.reply || data] };
        }
        return p;
      });

      setPosts(updatedPosts);
      showToast("Success", "Reply added", "success");
      setReplyText("");
      onClose();
    } catch (error) {
      showToast(
        "Error",
        error.response?.data?.message || error.message,
        "error",
      );
    } finally {
      setIsReplying(false);
    }
  };

  // Handle Share / Copy URL to Clipboard
  const handleShare = async () => {
    const postUrl = `${window.location.origin}/${post?.postedBy?.username || "user"}/post/${post._id}`;
    try {
      await navigator.clipboard.writeText(postUrl);
      showToast("Link copied", "Post URL copied to clipboard", "success");
    } catch {
      showToast("Error", "Could not copy link to clipboard", "error");
    }
  };

  return (
    <Flex direction="column" w="100%">
      <Flex gap={5} my={2} onClick={(e) => e.stopPropagation()}>
        {/* Like Button */}
        <Flex alignItems="center" gap={1.5}>
          <Box
            cursor="pointer"
            onClick={handleLikeAndUnlike}
            transition="transform 0.1s ease"
            _active={{ transform: "scale(1.2)" }}
          >
            <svg
              aria-label="Like"
              color={liked ? "rgb(237, 73, 86)" : "currentColor"}
              fill={liked ? "rgb(237, 73, 86)" : "transparent"}
              height="19"
              role="img"
              viewBox="0 0 24 22"
              width="20"
            >
              <path
                d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </Box>
          <Text fontSize="xs" color={textColor}>
            {post?.likes?.length || 0}
          </Text>
        </Flex>

        {/* Comment Button */}
        <Flex alignItems="center" gap={1.5}>
          <Box cursor="pointer" onClick={onOpen}>
            <svg
              aria-label="Comment"
              height="20"
              role="img"
              viewBox="0 0 24 24"
              width="20"
            >
              <path
                d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                fill="none"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </Box>
          <Text fontSize="xs" color={textColor}>
            {post?.replies?.length || 0}
          </Text>
        </Flex>

        {/* Repost SVG */}
        <RepostSVG />

        {/* Share Button */}
        <Box cursor="pointer" onClick={handleShare}>
          <ShareSVG />
        </Box>
      </Flex>

      {/* Reply Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(3px)" />
        <ModalContent borderRadius="xl">
          <ModalHeader fontSize="md">Reply to post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={4}>
            <FormControl>
              <Input
                placeholder="Write your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                borderRadius="lg"
                autoFocus
              />
            </FormControl>
          </ModalBody>

          <ModalFooter gap={2} pt={0}>
            <Button size="sm" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              colorScheme="blue"
              isLoading={isReplying}
              isDisabled={!replyText.trim()}
              onClick={handleReply}
            >
              Reply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

const RepostSVG = () => (
  <Box display="flex" alignItems="center" cursor="pointer">
    <svg
      aria-label="Repost"
      color="currentColor"
      fill="currentColor"
      height="18"
      role="img"
      viewBox="0 0 24 24"
      width="18"
    >
      <path d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z" />
    </svg>
  </Box>
);

const ShareSVG = () => (
  <Box display="flex" alignItems="center">
    <svg
      aria-label="Share"
      height="18"
      role="img"
      viewBox="0 0 24 24"
      width="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <line x1="22" x2="9.218" y1="3" y2="10.083" />
      <polygon points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" />
    </svg>
  </Box>
);

export default Actions;
