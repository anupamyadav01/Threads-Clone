/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import {
  Box,
  Input,
  Avatar,
  Text,
  VStack,
  HStack,
  useColorMode,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
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
    <Flex
      direction="column"
      justify="center"
      align="center"
      minHeight="100vh"
      p={4}
    >
      <Box
        px={8}
        py={8}
        bg={colorMode === "dark" ? "gray.700" : "white"}
        color={colorMode === "dark" ? "gray.300" : "gray.600"}
        maxW={["full", "600px"]} // Full width on small screens, 600px on larger
        w="100%"
        borderRadius="lg"
      >
        {users.length === 0 && !loading && searchQuery.length === 0 && (
          <Text fontSize={"xl"} textAlign={"center"} pb={8}>
            Search for users by name or username.
          </Text>
        )}
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
          bg={colorMode === "dark" ? "gray.700" : "white"}
          color={colorMode === "dark" ? "gray.300" : "gray.600"}
          maxHeight={users.length > 4 ? "300px" : "none"}
          overflowY={users.length > 4 ? "auto" : "none"}
          p={2}
          borderRadius="md"
          boxShadow="sm"
          sx={{
            // Custom scrollbar styling
            "&::-webkit-scrollbar": {
              width: "12px", // Wider scrollbar
              height: "12px", // For horizontal scrollbar
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: colorMode === "dark" ? "#4A5568" : "#CBD5E0", // Thumb color (dark/light mode)
              borderRadius: "6px", // Rounded thumb edges
              border: "3px solid transparent", // Space between thumb and track
              backgroundClip: "content-box", // Thumb outline to create a more distinct look
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: colorMode === "dark" ? "#2D3748" : "#A0AEC0", // Thumb color on hover
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: colorMode === "dark" ? "#2D3748" : "#E2E8F0", // Track background
              borderRadius: "6px", // Rounded track edges
            },
            "&::-webkit-scrollbar-corner": {
              backgroundColor: "transparent", // Transparent corner when both scrollbars appear
            },
          }}
        >
          {users?.length === 0 && !loading && searchQuery && (
            <Text>No users found for "{searchQuery}".</Text>
          )}

          {users.map((user, index) => (
            <HStack
              key={index}
              justify="space-between"
              w="full"
              p={2}
              borderRadius="md"
              _hover={{ bg: "gray.600" }}
              cursor="pointer"
              onClick={() => navigate(`/${user.username}`)} // Navigate to user's page
              direction={["column", "row"]} // Stack vertically on small screens, horizontally on larger ones
            >
              <HStack
                spacing={4}
                direction={["column", "row"]} // Stack avatar and text vertically on small screens
                align={["center", "start"]} // Center align on small screens, start align on larger ones
                w="full"
              >
                <Avatar
                  src={user?.profilePic}
                  size={["lg", "md"]} // Larger avatar on small screens, smaller on larger ones
                />
                <Box textAlign={["center", "left"]}>
                  {" "}
                  {/* Center text on small screens */}
                  <HStack justify={["center", "start"]}>
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
            </HStack>
          ))}
        </VStack>
      </Box>
    </Flex>
  );
};

export default SearchPage;
