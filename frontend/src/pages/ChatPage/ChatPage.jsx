import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Skeleton,
  SkeletonCircle,
  Text,
  VStack,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";

import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import { RiChatSmile3Line } from "react-icons/ri";

import { useRecoilState, useRecoilValue } from "recoil";

import MessageContainer from "../../components/Chatting/MessageContainer";
import Conversation from "../../components/Chatting/Conversation";

import useShowToast from "../../hooks/useShowToast";
import userAtom from "../../atoms/userAtom";
import { useSocket } from "../../context/SocketContext";

import {
  conversationsAtom,
  selectedConversationAtom,
} from "../../atoms/messagesAtom";

import axiosInstance from "../../../axiosConfig";

const ChatPage = () => {
  const [searchingUser, setSearchingUser] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [searchText, setSearchText] = useState("");

  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom,
  );

  const [conversations, setConversations] = useRecoilState(conversationsAtom);

  const currentUser = useRecoilValue(userAtom);

  const showToast = useShowToast();

  const { socket, onlineUsers } = useSocket();

  // =========================
  // Theme
  // =========================

  const containerBg = useColorModeValue("white", "gray.900");
  const sidebarBg = useColorModeValue("gray.50", "gray.850");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const emptyStateBg = useColorModeValue("gray.50", "gray.800");
  const textMuted = useColorModeValue("gray.500", "gray.400");
  const inputBg = useColorModeValue("white", "gray.800");
  const emptyIconBg = useColorModeValue("white", "gray.700");

  // =========================
  // Socket cleanup
  // =========================

  useEffect(() => {
    const handleMessagesSeen = ({ conversationId }) => {
      setConversations((prev) =>
        (prev || []).map((conv) => {
          if (conv._id === conversationId) {
            return {
              ...conv,
              lastMessage: {
                ...conv.lastMessage,
                seen: true,
              },
            };
          }

          return conv;
        }),
      );
    };

    socket?.on("messagesSeen", handleMessagesSeen);

    return () => socket?.off("messagesSeen", handleMessagesSeen);
  }, [socket, setConversations]);

  // =========================
  // Fetch conversations
  // =========================

  useEffect(() => {
    let isMounted = true;

    const getConversations = async () => {
      try {
        const res = await axiosInstance.get("/messages/conversations");

        if (isMounted) {
          setConversations(res?.data || []);
        }
      } catch (error) {
        showToast(
          "Error",
          error?.response?.data?.error || "Could not load conversations",
          "error",
        );
      } finally {
        if (isMounted) {
          setLoadingConversations(false);
        }
      }
    };

    getConversations();

    return () => {
      isMounted = false;
    };
  }, [showToast, setConversations]);

  // =========================
  // Search user
  // =========================

  const handleConversationSearch = async (e) => {
    e.preventDefault();

    if (!searchText.trim()) return;

    setSearchingUser(true);

    try {
      const res = await axiosInstance.get(`/user/profile/${searchText.trim()}`);

      const searchedUser = res?.data?.user;

      if (!searchedUser) {
        showToast("Error", "User not found", "error");
        return;
      }

      if (searchedUser._id === currentUser?._id) {
        showToast("Error", "You cannot message yourself", "error");
        return;
      }

      const existingConversation = (conversations || []).find((conv) =>
        conv.participants?.some((p) => p._id === searchedUser._id),
      );

      if (existingConversation) {
        setSelectedConversation({
          _id: existingConversation._id,
          userId: searchedUser._id,
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic,
        });

        setSearchText("");

        return;
      }

      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: `temp_${Date.now()}`,
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
          },
        ],
      };

      setConversations((prev) => [mockConversation, ...(prev || [])]);

      setSelectedConversation({
        _id: mockConversation._id,
        userId: searchedUser._id,
        username: searchedUser.username,
        userProfilePic: searchedUser.profilePic,
        mock: true,
      });

      setSearchText("");
    } catch (error) {
      showToast(
        "Error",
        error?.response?.data?.error || "Failed to search user",
        "error",
      );
    } finally {
      setSearchingUser(false);
    }
  };

  const conversationList = Array.isArray(conversations) ? conversations : [];

  return (
    <Box
      w="100%"
      maxW={{ base: "100%", md: "900px" }}
      mx="auto"
      mt={{ base: 3, md: 6 }}
      px={{ base: 2, sm: 4, md: 0 }}
      h={{ base: "calc(100vh - 75px)", md: "78vh" }}
    >
      {/* =========================
          MAIN CHAT CONTAINER
      ========================= */}

      <Flex
        h="100%"
        bg={containerBg}
        borderRadius={{ base: "xl", md: "2xl" }}
        border="1px solid"
        borderColor={borderColor}
        overflow="hidden"
        boxShadow="0 12px 30px -15px rgba(0, 0, 0, 0.12)"
      >
        {/* =========================
            LEFT CONVERSATION SIDEBAR
        ========================= */}

        <Flex
          direction="column"
          w={{
            base: selectedConversation?._id ? "0%" : "100%",
            md: "300px",
            lg: "320px",
          }}
          display={{
            base: selectedConversation?._id ? "none" : "flex",
            md: "flex",
          }}
          borderRight="1px solid"
          borderColor={borderColor}
          bg={sidebarBg}
          flexShrink={0}
        >
          {/* Header + Search */}

          <Box p={{ base: 3, md: 4 }} pb={3}>
            <Text fontSize="lg" fontWeight="700" letterSpacing="-0.02em" mb={3}>
              Messages
            </Text>

            <form onSubmit={handleConversationSearch}>
              <InputGroup size="sm">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" boxSize={3.5} />
                </InputLeftElement>

                <Input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search user..."
                  borderRadius="lg"
                  bg={inputBg}
                  border="1px solid"
                  borderColor={borderColor}
                  _focus={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                  }}
                  fontSize="sm"
                />

                {searchText && (
                  <InputRightElement>
                    <IconButton
                      size="xs"
                      variant="ghost"
                      aria-label="Clear search"
                      icon={<CloseIcon boxSize={2} />}
                      onClick={() => setSearchText("")}
                    />
                  </InputRightElement>
                )}
              </InputGroup>
            </form>
          </Box>

          <Divider borderColor={borderColor} opacity={0.6} />

          {/* Conversations */}

          <VStack
            flex={1}
            overflowY="auto"
            spacing={1}
            p={2}
            align="stretch"
            css={{
              "&::-webkit-scrollbar": {
                width: "4px",
              },

              "&::-webkit-scrollbar-thumb": {
                background: "rgba(0,0,0,0.1)",
                borderRadius: "24px",
              },
            }}
          >
            {/* Loading */}

            {loadingConversations &&
              [0, 1, 2, 3, 4].map((_, i) => (
                <Flex
                  key={i}
                  gap={3}
                  alignItems="center"
                  p={3}
                  borderRadius="xl"
                >
                  <SkeletonCircle size="11" />

                  <Box flex="1">
                    <Skeleton h="11px" w="40%" mb={2} borderRadius="full" />

                    <Skeleton h="9px" w="75%" borderRadius="full" />
                  </Box>
                </Flex>
              ))}

            {/* Conversations */}

            {!loadingConversations &&
              conversationList.map((conversation) => (
                <Conversation
                  key={conversation?._id}
                  isOnline={onlineUsers?.includes(
                    conversation?.participants[0]?._id,
                  )}
                  conversation={conversation}
                />
              ))}

            {/* Empty state */}

            {!loadingConversations && conversationList.length === 0 && (
              <Flex
                flex={1}
                align="center"
                justify="center"
                direction="column"
                p={6}
                textAlign="center"
              >
                <Text fontSize="sm" color={textMuted}>
                  No conversations yet. Search someone above to start chatting!
                </Text>
              </Flex>
            )}
          </VStack>
        </Flex>

        {/* =========================
            RIGHT CHAT AREA
        ========================= */}

        <Flex
          flex={1}
          h="100%"
          minW={0}
          display={{
            base: selectedConversation?._id ? "flex" : "none",
            md: "flex",
          }}
          direction="column"
        >
          {!selectedConversation?._id ? (
            <Flex
              flex={1}
              direction="column"
              alignItems="center"
              justifyContent="center"
              bg={emptyStateBg}
              p={{ base: 5, md: 8 }}
              textAlign="center"
            >
              <Box
                p={4}
                borderRadius="full"
                bg={emptyIconBg}
                boxShadow="sm"
                mb={4}
              >
                <RiChatSmile3Line size={40} color="#3182ce" />
              </Box>

              <Text fontSize="lg" fontWeight="600" mb={1}>
                Your Inbox
              </Text>

              <Text fontSize="sm" color={textMuted} maxW="280px">
                Pick a thread from the left or search someone new to exchange
                messages.
              </Text>
            </Flex>
          ) : (
            <MessageContainer />
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default ChatPage;
