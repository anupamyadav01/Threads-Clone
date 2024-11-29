import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { GiConversation } from "react-icons/gi";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import MessageContainer from "../../components/Chatting/MessageContainer";
import useShowToast from "../../hooks/useShowToast";
import userAtom from "../../atoms/userAtom";
import { useSocket } from "../../context/SocketContext";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../../atoms/messagesAtom";
import axiosInstance from "../../../axiosConfig";
import Conversation from "../../components/Chatting/Conversation";

const ChatPage = () => {
  const { colorMode } = useColorMode();
  const [searchingUser, setSearchingUser] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const { socket, onlineUsers } = useSocket();

  useEffect(() => {
    socket?.on("messagesSeen", ({ conversationId }) => {
      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === conversationId) {
            return {
              ...conversation,
              lastMessage: {
                ...conversation.lastMessage,
                seen: true,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });
  }, [socket, setConversations]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axiosInstance.get("/messages/conversations");
        const data = res?.data;
        if (data.error) {
          showToast("Error", "hel", "error");
          return;
        }
        setConversations(data);
      } catch (error) {
        if (error.status === 401) {
          showToast("Error", error?.response?.data?.error, "error");
        }
      } finally {
        setLoadingConversations(false);
      }
    };

    getConversations();
  }, [showToast, setConversations]);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);

    try {
      const res = await axiosInstance.get(`/user/profile/${searchText}`);
      const searchedUser = res?.data?.user;

      console.log(res);

      if (!searchedUser) {
        showToast("Error", "User not found", "error");
        return;
      }

      const messagingYourself = searchedUser._id === currentUser._id;
      if (messagingYourself) {
        showToast("Error", "You cannot message yourself", "error");
        return;
      }

      const conversationAlreadyExists = conversations.find(
        (conversation) => conversation.participants[0]._id === searchedUser._id
      );

      if (conversationAlreadyExists) {
        setSelectedConversation({
          _id: conversationAlreadyExists._id,
          userId: searchedUser._id,
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic,
        });
        return;
      }

      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
          },
        ],
      };

      setConversations((prevConvs) => [...prevConvs, mockConversation]);
    } catch (error) {
      showToast("Error", error?.response?.data?.error, "error");
    } finally {
      setSearchingUser(false);
    }
  };

  return (
    <Box
      position={"absolute"}
      marginTop={"-20%"}
      minW={"60%"}
      transform={"translateX(-15%)"}
      pt={8}
      bg={useColorModeValue("gray.50", "gray.800")}
      borderRadius="lg"
      boxShadow="md"
    >
      <Flex
        gap={4}
        flexDirection={{ base: "column", md: "row" }}
        maxW={{ sm: "400px", md: "full" }}
        mx={"auto"}
        pb={8}
      >
        <Flex
          mx={5}
          p={4}
          flex={30}
          gap={4}
          flexDirection={"column"}
          maxW={{ sm: "250px", md: "full" }}
        >
          <Text
            fontWeight={700}
            fontSize="xl"
            color={useColorModeValue("gray.800", "gray.100")}
          >
            Your Conversations
          </Text>
          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input
                p={2}
                placeholder="Search for a user"
                onChange={(e) => setSearchText(e.target.value)}
                variant="flushed"
                _focus={{ borderColor: "blue.500" }}
              />
              <Button
                size={"sm"}
                onClick={handleConversationSearch}
                isLoading={searchingUser}
                colorScheme="blue"
                variant="solid"
              >
                <SearchIcon />
              </Button>
            </Flex>
          </form>

          {loadingConversations &&
            [0, 1, 2, 3, 4].map((_, i) => (
              <Flex
                key={i}
                gap={4}
                alignItems={"center"}
                p={"2"}
                borderRadius={"md"}
              >
                <Box>
                  <SkeletonCircle size={"10"} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))}

          {!loadingConversations &&
            conversations?.map((conversation) => (
              <Conversation
                key={conversation?._id}
                isOnline={onlineUsers?.includes(
                  conversation?.participants[0]?._id
                )}
                conversation={conversation}
              />
            ))}
        </Flex>

        {!selectedConversation?._id && (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"600px"}
            bg={colorMode === "dark" ? "gray.800" : "white"}
            boxShadow="md"
          >
            <GiConversation size={100} />
            <Text
              fontSize={20}
              bg={colorMode === "dark" ? "gray.800" : "white"}
            >
              Select a conversation to start messaging
            </Text>
          </Flex>
        )}

        {selectedConversation?._id && <MessageContainer />}
      </Flex>
    </Box>
  );
};

export default ChatPage;
