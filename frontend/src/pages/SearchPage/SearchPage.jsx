import { useState, useEffect } from "react";
import {
  Box,
  Input,
  Avatar,
  Text,
  VStack,
  HStack,
  Flex,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Spinner,
  useColorModeValue,
  Center,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../axiosConfig";
import SuggestedUser from "../../components/SuggestedUser";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Modern UI theme tokens
  const cardBg = useColorModeValue("white", "gray.850");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const inputBg = useColorModeValue("gray.50", "gray.800");
  const primaryText = useColorModeValue("gray.900", "gray.100");
  const secondaryText = useColorModeValue("gray.500", "gray.400");
  const hoverBg = useColorModeValue("gray.50", "whiteAlpha.50");

  // Debounced search with AbortController to handle race conditions
  useEffect(() => {
    if (!searchQuery.trim()) {
      setUsers([]);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get(`/user/search`, {
          params: { query: searchQuery.trim() },
          signal: controller.signal,
        });

        const fetchedData = response?.data?.users || response?.data || [];
        setUsers(Array.isArray(fetchedData) ? fetchedData : []);
      } catch (err) {
        if (err.name === "CanceledError" || err.name === "AbortError") return;
        setError("Failed to search users. Please try again.");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }, 350); // 350ms debounce window

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery]);

  return (
    <Box
      w="100%"
      maxW="620px"
      mx="auto"
      mt={{ base: 4, md: 8 }}
      px={{ base: 3, md: 4 }}
      pb={16}
    >
      <Box
        bg={cardBg}
        borderRadius="2xl"
        border="1px solid"
        borderColor={borderColor}
        p={{ base: 4, md: 6 }}
        boxShadow="0 20px 40px -15px rgba(0, 0, 0, 0.05)"
      >
        <Text
          fontSize="2xl"
          fontWeight="700"
          letterSpacing="-0.02em"
          color={primaryText}
          mb={4}
        >
          Search
        </Text>

        {/* Search Input Bar */}
        <InputGroup size="md" mb={4}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" boxSize={3.5} />
          </InputLeftElement>
          <Input
            placeholder="Search by name or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg={inputBg}
            borderRadius="xl"
            borderColor={borderColor}
            fontSize="sm"
            h="44px"
            _focus={{
              borderColor: "blue.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
            }}
          />
          {searchQuery && (
            <InputRightElement h="44px">
              <IconButton
                size="xs"
                variant="ghost"
                aria-label="Clear search"
                icon={<CloseIcon boxSize={2} />}
                onClick={() => setSearchQuery("")}
              />
            </InputRightElement>
          )}
        </InputGroup>

        {/* Loading Spinner */}
        {loading && (
          <Center py={8}>
            <Spinner size="md" thickness="3px" speed="0.65s" color="blue.500" />
          </Center>
        )}

        {/* Error Feedback */}
        {error && !loading && (
          <Center py={4}>
            <Text fontSize="sm" color="red.500">
              {error}
            </Text>
          </Center>
        )}

        {/* Results List */}
        {!loading && users.length > 0 && (
          <VStack spacing={1} align="stretch" mt={2}>
            {users.map((user) => (
              <SuggestedUser key={user._id} user={user} />
            ))}
          </VStack>
        )}

        {/* Empty State: No Query */}
        {!loading && !searchQuery.trim() && (
          <Center py={12} flexDirection="column" gap={1}>
            <Text fontSize="sm" fontWeight="medium" color={secondaryText}>
              Find people on Threads
            </Text>
            <Text fontSize="xs" color={secondaryText}>
              Search for creators, friends, and accounts by username or name.
            </Text>
          </Center>
        )}

        {/* Empty State: Query without Results */}
        {!loading && searchQuery.trim() && users.length === 0 && !error && (
          <Center py={10}>
            <Text fontSize="sm" color={secondaryText}>
              No users found for &quot;{searchQuery}&quot;
            </Text>
          </Center>
        )}
      </Box>
    </Box>
  );
};

export default SearchPage;
