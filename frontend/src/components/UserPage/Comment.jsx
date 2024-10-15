import { Avatar, Box, Flex, Text, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Actions from "./Actions";

const Comment = () => {
  return (
    <Flex w="full">
      <Flex w={"full"}>
        <Box mr={2}>
          {" "}
          <Avatar
            size="sm"
            src="https://avatars.githubusercontent.com/u/53673576?v=4"
            name="anjimaxuofficially"
          />
        </Box>
        <Box w="full">
          <Flex align="center" w="100%" gap={2}>
            <Text fontWeight="bold">anjimaxuofficially</Text>
            <Image src="/verified.png" w={"18px"} alt="verified"></Image>
            <Text fontSize="sm" color="gray.500">
              3d
            </Text>
          </Flex>
          <Text>
            I like you, I love you, and I want to be with you forever.
            <Link to="/post/1">View Post</Link>
          </Text>

          <Box my={3}>
            <Actions />
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Comment;
