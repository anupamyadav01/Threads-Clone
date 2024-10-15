/* eslint-disable react/no-unescaped-entities */
import {
  Avatar,
  Box,
  Flex,
  Image,
  Text,
  VStack,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import Actions from "./Actions";

const UserPost = () => {
  const { colorMode } = useColorMode();

  // const handleReply = () => {};

  return (
    <Link to={"/anupamyadav01/post/1"}>
      <Flex
        paddingY={5}
        borderBottom={"1px solid"}
        borderColor={colorMode === "dark" ? "gray.600" : "gray.300"}
        maxW="100%"
        bg={colorMode === "dark" ? "gray.800" : "white"}
        align="start"
      >
        <Avatar size="md" src="/zuck-avatar.png" name="Salome Munoz" mr={4} />

        <VStack align="start" w="100%" spacing={4}>
          <Flex justify="space-between" w="100%" align="center">
            <Box>
              <Text fontWeight="bold">Salome Munoz</Text>
              <Text fontSize="sm" color="gray.500" marginLeft={-5}>
                10 minutes ago
              </Text>
            </Box>
            <IconButton
              icon={<BsThreeDots />}
              aria-label="Options"
              variant="ghost"
              size="sm"
            />
          </Flex>

          <Text textAlign={"start"}>
            After resting Babar Azam, PCB called Ahmad Shehzad and said we still
            don't need you. 😭😔
          </Text>

          <Image src="/post3.png" alt="post" borderRadius="md" />
          <Actions />
        </VStack>
      </Flex>
    </Link>
  );
};

export default UserPost;
