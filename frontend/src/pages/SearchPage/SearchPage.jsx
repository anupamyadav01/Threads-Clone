import { useState } from "react";
import {
  Box,
  Input,
  Avatar,
  Text,
  VStack,
  HStack,
  Button,
  useColorMode,
} from "@chakra-ui/react";
import { IoIosSearch } from "react-icons/io";
import { CheckCircleIcon } from "@chakra-ui/icons";

const SearchPage = () => {
  const { colorMode } = useColorMode();
  const [searchQuery, setSearchQuery] = useState("");

  // Dummy user data
  const users = [
    { name: "Sophie Rain", username: "cakeofsophie", followers: "6,417" },
    {
      name: "Victoria Matos",
      username: "soyvictoriamatosa",
      followers: "764K",
      verified: true,
    },
    {
      name: "Anna-Lisa",
      username: "annamonetx",
      followers: "32.1K",
      verified: true,
    },
    {
      name: "Renu Chandra",
      username: "__renu__chandra",
      followers: "115K",
      verified: true,
    },
    {
      name: "Khushi Mukherjee",
      username: "khushi_mukherjee",
      followers: "113K",
      verified: true,
    },
    { name: "MELISSA", username: "melimtx_1", followers: "28.2K" },
  ];

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      p={4}
      bg={colorMode === "dark" ? "gray.800" : "white"}
      color={colorMode === "dark" ? "gray.300" : "gray.600"}
      maxW={["full", "600px"]}
      mx="auto"
      borderRadius="lg"
    >
      {/* Search Bar */}

      <Box mb={4}>
        <HStack position="relative">
          {/* Icon Box */}
          <Box
            position="absolute"
            left={3}
            top="50%"
            transform="translateY(-50%)"
          >
            <IoIosSearch fontSize="30px" color="gray" />
          </Box>

          {/* Input Box */}
          <Input
            placeholder="Search"
            pl="50px"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="lg"
          />
        </HStack>
      </Box>

      {/* User List */}
      <VStack
        align="start"
        spacing={4}
        bg={colorMode === "dark" ? "gray.800" : "white"}
        color={colorMode === "dark" ? "gray.300" : "gray.600"}
      >
        {filteredUsers.map((user, index) => (
          <HStack
            key={index}
            justify="space-between"
            w="full"
            p={2}
            borderRadius="md"
            _hover={{ bg: "gray.50" }}
          >
            <HStack spacing={4}>
              <Avatar name={user?.name} size="md" />
              <Box>
                <HStack>
                  <Text fontWeight="bold">{user?.username}</Text>
                  {user?.verified && (
                    <CheckCircleIcon color="blue.500" boxSize={4} />
                  )}
                </HStack>
                <Text fontSize="sm" color="gray.500">
                  {user?.name}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {user?.followers} followers
                </Text>
              </Box>
            </HStack>
            <Button size="sm" variant="outline" colorScheme="blue">
              Follow
            </Button>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

export default SearchPage;
