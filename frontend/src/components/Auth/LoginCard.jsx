import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
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
import useShowToast from "../../hooks/useShowToast";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../../atoms/authAtom";
import axiosInstance from "../../../axiosConfig";
import userAtom from "../../atoms/userAtom";

export default function LoginCard() {
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const setUser = useSetRecoilState(userAtom);
  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const showToast = useShowToast();

  // Modern UI theme tokens
  const cardBg = useColorModeValue("white", "gray.850");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const inputBg = useColorModeValue("gray.50", "gray.800");
  const primaryText = useColorModeValue("gray.900", "gray.100");
  const secondaryText = useColorModeValue("gray.500", "gray.400");

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    if (!inputs.email.trim() || !inputs.password.trim()) {
      showToast("Error", "Please fill in all fields", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/user/login", {
        email: inputs.email.trim(),
        password: inputs.password,
      });

      if (res?.data?.status === false || res?.data?.error) {
        showToast("Error", res?.data?.error || "Login failed", "error");
        return;
      }

      const loggedInUser = res?.data?.user || res?.data;

      localStorage.setItem("user-threads", JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      showToast("Success", res?.data?.message || "Welcome back!", "success");
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Invalid credentials";
      showToast("Error", errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH="80vh" align="center" justify="center" px={4}>
      <Box
        w="100%"
        maxW="420px"
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
            Welcome Back
          </Heading>
          <Text fontSize="sm" color={secondaryText}>
            Enter your credentials to access your feed
          </Text>
        </Stack>

        <form onSubmit={handleLogin}>
          <Stack spacing={4}>
            {/* Email / Username Field */}
            <FormControl isRequired>
              <FormLabel
                fontSize="xs"
                fontWeight="semibold"
                color={primaryText}
                mb={1}
              >
                Email or Username
              </FormLabel>
              <Input
                type="text"
                placeholder="name@example.com"
                value={inputs.email}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, email: e.target.value }))
                }
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
                  h="44px"
                  pr="44px"
                  _focus={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                  }}
                />
                <InputRightElement h="44px" pr={2}>
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
              loadingText="Signing in..."
              transition="all 0.2s"
              _hover={{ transform: "translateY(-1px)", boxShadow: "sm" }}
              _active={{ transform: "translateY(0)" }}
            >
              Sign In
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
            Don&apos;t have an account?{" "}
            <Link
              color="blue.500"
              fontWeight="semibold"
              _hover={{ textDecoration: "underline" }}
              onClick={() => setAuthScreen("signup")}
            >
              Sign up
            </Link>
          </Text>
        </Box>
      </Box>
    </Flex>
  );
}
