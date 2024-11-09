/* eslint-disable react/prop-types */
import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Comment = ({ reply, lastReply }) => {
  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={reply?.userId?.profilePic} size={"sm"} />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Link
              to={`/${reply?.userId?.username}`}
              fontSize="sm"
              fontWeight="bold"
            >
              {reply?.userId?.username}
            </Link>
          </Flex>
          <Text>{reply?.replyText}</Text>
        </Flex>
      </Flex>
      {!lastReply ? <Divider /> : null}
    </>
  );
};

export default Comment;
