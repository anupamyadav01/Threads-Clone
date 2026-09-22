import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import useShowToast from "../../hooks/useShowToast";
import authScreenAtom from "../../atoms/authAtom";
import userAtom from "../../atoms/userAtom";
import axiosInstance from "../../../axiosConfig";

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();

  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  // Modern UI theme tokens
  const cardBg = useColorModeValue("white", "gray.850");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const inputBg = useColorModeValue("gray.50", "gray.800");
  const primaryText = useColorModeValue("gray.900", "gray.100");
  const secondaryText = useColorModeValue("gray.500", "gray.400");

  const handleSignup = async (e) => {
    if (e) e.preventDefault();

    const { name, username, email, password } = inputs;
    if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
      showToast("Error", "Please fill in all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      // Send a clean, flattened payload matching the backend controller
      const res = await axiosInstance.post("/user/signup", {
        name: name.trim(),
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (res?.data?.error) {
        showToast("Error", res.data.error, "error");
        return;
      }

      const createdUser = res?.data?.user || res?.data;

      // Persist auth credentials and update Recoil global state
      localStorage.setItem("user-threads", JSON.stringify(createdUser));
      setUser(createdUser);
      showToast(
        "Success",
        res?.data?.message || "Account created successfully",
        "success",
      );
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to create account";
      showToast("Error", errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH="80vh" align="center" justify="center" px={4} py={8}>
      <Box
        w="100%"
        maxW="460px"
        bg={cardBg}
        borderRadius="2xl"
        border="1px solid"
        borderColor={borderColor}
        p={{ base: 6, sm: 8 }}
        boxShadow="0 20px 40px -15px rgba(0, 0, 0, 0.05)"
      >
        <Stack spacing={2} textAlign="center" mb={6}>
          <Heading
            fontSize="2xl"
            fontWeight="700"
            letterSpacing="-0.02em"
            color={primaryText}
          >
            Create your account
          </Heading>
          <Text fontSize="sm" color={secondaryText}>
            Join the conversation and connect with others
          </Text>
        </Stack>

        <form onSubmit={handleSignup}>
          <Stack spacing={4}>
            {/* Full Name & Username */}
            <HStack spacing={3} align="flex-start">
              <FormControl isRequired>
                <FormLabel
                  fontSize="xs"
                  fontWeight="semibold"
                  color={primaryText}
                  mb={1}
                >
                  Full name
                </FormLabel>
                <Input
                  type="text"
                  placeholder="Jane Doe"
                  value={inputs.name}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, name: e.target.value }))
                  }
                  bg={inputBg}
                  borderRadius="xl"
                  borderColor={borderColor}
                  fontSize="sm"
                  h="42px"
                  _focus={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                  }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel
                  fontSize="xs"
                  fontWeight="semibold"
                  color={primaryText}
                  mb={1}
                >
                  Username
                </FormLabel>
                <Input
                  type="text"
                  placeholder="janedoe"
                  value={inputs.username}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, username: e.target.value }))
                  }
                  bg={inputBg}
                  borderRadius="xl"
                  borderColor={borderColor}
                  fontSize="sm"
                  h="42px"
                  _focus={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                  }}
                />
              </FormControl>
            </HStack>

            {/* Email Address */}
            <FormControl isRequired>
              <FormLabel
                fontSize="xs"
                fontWeight="semibold"
                color={primaryText}
                mb={1}
              >
                Email address
              </FormLabel>
              <Input
                type="email"
                placeholder="name@example.com"
                value={inputs.email}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, email: e.target.value }))
                }
                bg={inputBg}
                borderRadius="xl"
                borderColor={borderColor}
                fontSize="sm"
                h="42px"
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                }}
              />
            </FormControl>

            {/* Password Field */}
            <FormControl isRequired>
              <FormLabel
                fontSize="xs"
                fontWeight="semibold"
                color={primaryText}
                mb={1}
              >
                Password
              </FormLabel>
              <InputGroup size="md">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={inputs.password}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, password: e.target.value }))
                  }
                  bg={inputBg}
                  borderRadius="xl"
                  borderColor={borderColor}
                  fontSize="sm"
                  h="42px"
                  pr="42px"
                  _focus={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                  }}
                />
                <InputRightElement h="42px" pr={2}>
                  <IconButton
                    variant="ghost"
                    size="sm"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowPassword((prev) => !prev)}
                    color="gray.400"
                    _hover={{ bg: "transparent", color: "blue.400" }}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              h="46px"
              w="100%"
              mt={2}
              borderRadius="xl"
              colorScheme="blue"
              fontSize="sm"
              fontWeight="semibold"
              isLoading={loading}
              loadingText="Creating account..."
              transition="all 0.2s"
              _hover={{ transform: "translateY(-1px)", boxShadow: "sm" }}
              _active={{ transform: "translateY(0)" }}
            >
              Sign up
            </Button>
          </Stack>
        </form>

        {/* Footer Link */}
        <Box
          textAlign="center"
          mt={6}
          pt={4}
          borderTop="1px solid"
          borderColor={borderColor}
        >
          <Text fontSize="sm" color={secondaryText}>
            Already have an account?{" "}
            <Link
              color="blue.500"
              fontWeight="semibold"
              _hover={{ textDecoration: "underline" }}
              onClick={() => setAuthScreen("login")}
            >
              Login
            </Link>
          </Text>
        </Box>
      </Box>
    </Flex>
  );
}
