import { useState, useEffect } from "react";
import {
  Box,
  Input,
  Avatar,
  Text,
  VStack,
  HStack,
  Button,
  useColorMode,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { IoIosSearch } from "react-icons/io";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axiosInstance from "../../../axiosConfig";

const SearchPage = () => {
  const { colorMode } = useColorMode();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]); // State to store fetched users
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to fetch users based on search input
  const fetchUsers = async (query) => {
    try {
      setLoading(true);
      setError(null); // Reset error state

      // Make an API call to search users by name or username
      const response = await axiosInstance.get(`/user/search`, {
        params: { query },
      });

      // Update users state with the data from the backend
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      console.log("error from search page", err);
      setLoading(false);
      setError("Failed to fetch users. Please try again.");
    }
  };

  // Fetch users when searchQuery changes
  useEffect(() => {
    if (searchQuery.length > 0) {
      fetchUsers(searchQuery);
    } else {
      setUsers([]); // Clear users if search query is empty
    }
  }, [searchQuery]);

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

      {/* Error Handling */}
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box textAlign="center" mt={4}>
          <Spinner size="lg" />
        </Box>
      )}

      {/* User List */}
      <VStack
        align="start"
        spacing={4}
        bg={colorMode === "dark" ? "gray.800" : "white"}
        color={colorMode === "dark" ? "gray.300" : "gray.600"}
      >
        {users.length === 0 && !loading && searchQuery && (
          <Text>No users found for {searchQuery}.</Text>
        )}
        {users.map((user, index) => (
          <HStack
            key={index}
            justify="space-between"
            w="full"
            p={2}
            borderRadius="md"
            _hover={{ bg: "gray.50" }}
            cursor="pointer"
            onClick={() => navigate(`/${user.username}`)} // Navigate to user's page
          >
            <HStack spacing={4}>
              <Avatar src={user?.profilePic} size="md" />
              <Box>
                <HStack>
                  <Text fontWeight="bold">{user?.username}</Text>
                  <CheckCircleIcon color="blue.500" boxSize={4} />
                </HStack>
                <Text fontSize="sm" color="gray.500">
                  {user?.name}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {user?.followers.length} followers
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
