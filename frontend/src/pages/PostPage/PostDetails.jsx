import {
  Avatar,
  Box,
  Flex,
  Image,
  Text,
  VStack,
  HStack,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import { BsHeart, BsChat, BsShare } from "react-icons/bs";
import { BsThreeDots } from "react-icons/bs";
import { GoChevronRight } from "react-icons/go";
import { Link } from "react-router-dom";
import Comment from "../../components/UserPage/Comment";

const PostDetails = () => {
  const { colorMode } = useColorMode();
  return (
    <Box
      w="100%"
      maxW={"720px"}
      borderRadius="lg"
      p={4}
      bg={colorMode === "dark" ? "gray.800" : "white"}
    >
      {/* Header Section */}
      <Flex justify="space-between" align="center" mb={4}>
        <Flex align="center" gap={2}>
          <Avatar
            size="sm"
            src="https://avatars.githubusercontent.com/u/53673576?v=4"
            name="anjimaxuofficially"
          />
          <HStack alignItems={"center"}>
            <Link to={"/anjimaxuofficially"} fontWeight="bold">
              anjimaxuofficially
            </Link>
            <Image src="/verified.png" w={"18px"} alt="verified"></Image>
            <Text fontSize="sm" color="gray.500">
              3d
            </Text>
          </HStack>
        </Flex>
        <IconButton
          icon={<BsThreeDots />}
          aria-label="Options"
          variant="ghost"
          size="sm"
        />
      </Flex>

      {/* Post Content */}
      <Box mb={4}>
        <Text mb={2}>
          Dil walo ke Dil ka krar Lutne Anjali Arora Aie hai PATNA BIHAR Lutne
          😌♥️ #patna ka pyaar 👌🏼💑
        </Text>
      </Box>

      {/* Image Gallery */}

      <Image src="/post1.png" alt="post1" borderRadius="md" objectFit="cover" />

      {/* Post Stats */}
      <HStack
        justify="space-between"
        mt={3}
        borderBottom={"1px solid"}
        borderColor={"gray.300"}
      >
        <HStack spacing={4} py={3}>
          <HStack>
            <BsHeart />
            <Text>307</Text>
          </HStack>
          <HStack>
            <BsChat />
            <Text>6</Text>
          </HStack>
          <HStack>
            <BsShare />
            <Text>2</Text>
          </HStack>
        </HStack>
      </HStack>

      {/* Comment Section */}
      <VStack align="start" spacing={3}>
        <Flex
          justify="space-between"
          py={3}
          align="center"
          w={"100%"}
          borderBottom={"1px solid"}
          borderColor={"gray.300"}
        >
          <Text fontWeight="bold" ml={2} fontSize={"lg"}>
            Replies
          </Text>
          <Flex align="center" color={"gray.500"} ml={2} fontSize={"lg"}>
            View Activity
            <GoChevronRight />
          </Flex>
        </Flex>
        <Comment />
        <Comment />
        <Comment />
      </VStack>
    </Box>
  );
};

export default PostDetails;
