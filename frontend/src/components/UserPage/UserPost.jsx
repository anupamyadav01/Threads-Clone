/* eslint-disable react/prop-types */
import {
  Box,
  Avatar,
  Text,
  Flex,
  IconButton,
  Grid,
  Image,
  HStack,
  VStack,
  Spacer,
} from "@chakra-ui/react";
import { FaHeart, FaComment, FaShare } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { useState } from "react";

const UserPost = ({ user }) => {
  const [liked, setLiked] = useState(false);
  const toggleLike = () => setLiked(!liked);

  return (
    <Box
      bg="gray.800"
      borderRadius="lg"
      p={4}
      mb={6}
      w="100%"
      maxW="600px"
      shadow="md"
    >
      {/* Post Header */}
      <Flex alignItems="center" justifyContent="space-between">
        <HStack spacing={3}>
          <Avatar size="md" src={"/zuck-avatar.png"} name="zuck" />
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold" color="white">
              zuck
            </Text>
            <Text fontSize="sm" color="gray.400">
              {/* {user.timestamp} */}
              12s
            </Text>
          </VStack>
        </HStack>
        <IconButton
          aria-label="More options"
          icon={<Text fontSize="2xl">•••</Text>}
          variant="ghost"
          colorScheme="gray"
        />
      </Flex>

      {/* Post Images */}
      <Grid templateColumns="repeat(3, 1fr)" gap={2} mt={4}>
        <Image
          src={"/post1.png"}
          borderRadius="md"
          objectFit="cover"
          w="100%"
          h="100%"
        />
      </Grid>

      {/* Post Actions */}
      <HStack justifyContent="space-between" mt={4}>
        <HStack spacing={6}>
          <IconButton
            aria-label="Like"
            icon={liked ? <FaHeart color="red" /> : <AiOutlineHeart />}
            onClick={toggleLike}
            variant="ghost"
            fontSize="xl"
          />
          <IconButton
            aria-label="Comment"
            icon={<FaComment />}
            variant="ghost"
            fontSize="xl"
          />
          <IconButton
            aria-label="Share"
            icon={<FaShare />}
            variant="ghost"
            fontSize="xl"
          />
        </HStack>
        <Spacer />
        {/* Like, Comment and Share Count */}
        <HStack spacing={4}>
          <Text fontSize="sm" color="gray.400">
            941
          </Text>
          <Text fontSize="sm" color="gray.400">
            17
          </Text>
          <Text fontSize="sm" color="gray.400">
            18
          </Text>
        </HStack>
      </HStack>
    </Box>
  );
};

export default UserPost;
