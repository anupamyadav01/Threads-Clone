import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  IconButton,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../../atoms/userAtom";
import useShowToast from "../../hooks/useShowToast";
import usePreviewImg from "../../hooks/usePreviewImg";
import axiosInstance from "../../../axiosConfig";
import { useNavigate } from "react-router-dom";
import { FiCamera } from "react-icons/fi";

export default function UpdateProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(userAtom);

  const [inputs, setInputs] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
    password: "",
  });

  const fileRef = useRef(null);
  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();
  const { handleImageChange, imgUrl } = usePreviewImg();

  // Modern UI theme tokens
  const cardBg = useColorModeValue("white", "gray.850");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const inputBg = useColorModeValue("gray.50", "gray.800");
  const primaryText = useColorModeValue("gray.900", "gray.100");
  const secondaryText = useColorModeValue("gray.500", "gray.400");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updating) return;

    setUpdating(true);
    try {
      const res = await axiosInstance.put(`/user/update/${user?._id}`, {
        ...inputs,
        img: imgUrl,
      });

      if (res?.data?.error) {
        showToast("Error", res.data.error, "error");
        return;
      }

      const updatedUser = res?.data?.user || res?.data;

      // Update state and persistence cleanly
      setUser(updatedUser);
      localStorage.setItem("user-threads", JSON.stringify(updatedUser));
      showToast("Success", "Profile updated successfully", "success");
      navigate(`/${updatedUser.username}`);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to update profile";
      showToast("Error", errorMsg, "error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Flex minH="90vh" align="center" justify="center" px={4} py={8}>
      <Box
        w="100%"
        maxW="560px"
        bg={cardBg}
        borderRadius="2xl"
        border="1px solid"
        borderColor={borderColor}
        p={{ base: 6, sm: 8 }}
        boxShadow="0 20px 40px -15px rgba(0, 0, 0, 0.05)"
      >
        <Stack spacing={2} mb={6}>
          <Text
            fontSize="2xl"
            fontWeight="700"
            letterSpacing="-0.02em"
            color={primaryText}
          >
            Edit Profile
          </Text>
          <Text fontSize="sm" color={secondaryText}>
            Update your account details and public information
          </Text>
        </Stack>

        <form onSubmit={handleSubmit}>
          <Stack spacing={5}>
            {/* Avatar Row */}
            <Flex
              align="center"
              gap={4}
              p={3}
              bg={inputBg}
              borderRadius="xl"
              border="1px solid"
              borderColor={borderColor}
            >
              <Box position="relative">
                <Avatar
                  size="lg"
                  src={imgUrl || user?.profilePic}
                  name={user?.name || user?.username}
                />
                <IconButton
                  aria-label="Upload photo"
                  icon={<FiCamera size={14} />}
                  size="xs"
                  colorScheme="blue"
                  borderRadius="full"
                  position="absolute"
                  bottom="0"
                  right="-2px"
                  onClick={() => fileRef.current?.click()}
                />
              </Box>

              <Box flex="1">
                <Text fontSize="sm" fontWeight="bold" color={primaryText}>
                  Profile Picture
                </Text>
                <Text fontSize="xs" color={secondaryText} mb={2}>
                  PNG, JPG or WebP up to 10MB
                </Text>
                <Button
                  size="xs"
                  variant="outline"
                  borderRadius="md"
                  onClick={() => fileRef.current?.click()}
                >
                  Change Photo
                </Button>
              </Box>

              <Input
                type="file"
                hidden
                ref={fileRef}
                accept="image/*"
                onChange={handleImageChange}
              />
            </Flex>

            {/* Name & Username Fields */}
            <HStack spacing={3} align="flex-start">
              <FormControl isRequired>
                <FormLabel
                  fontSize="xs"
                  fontWeight="semibold"
                  color={primaryText}
                  mb={1}
                >
                  Full Name
                </FormLabel>
                <Input
                  value={inputs.name}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Your full name"
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
                  value={inputs.username}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, username: e.target.value }))
                  }
                  placeholder="username"
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
                Email Address
              </FormLabel>
              <Input
                type="email"
                value={inputs.email}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="name@example.com"
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

            {/* Bio Field */}
            <FormControl>
              <FormLabel
                fontSize="xs"
                fontWeight="semibold"
                color={primaryText}
                mb={1}
              >
                Bio
              </FormLabel>
              <Textarea
                value={inputs.bio}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, bio: e.target.value }))
                }
                placeholder="Write a brief bio about yourself..."
                bg={inputBg}
                borderRadius="xl"
                borderColor={borderColor}
                fontSize="sm"
                minH="90px"
                resize="none"
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                }}
              />
            </FormControl>

            {/* Password Field (Optional) */}
            <FormControl>
              <FormLabel
                fontSize="xs"
                fontWeight="semibold"
                color={primaryText}
                mb={1}
              >
                New Password (Optional)
              </FormLabel>
              <Input
                type="password"
                value={inputs.password}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder="Leave blank to keep current password"
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

            <Divider borderColor={borderColor} pt={2} />

            {/* Action Buttons */}
            <HStack justify="flex-end" spacing={3} pt={1}>
              <Button
                variant="ghost"
                borderRadius="xl"
                size="md"
                onClick={() => navigate(`/${user?.username}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                colorScheme="blue"
                borderRadius="xl"
                size="md"
                px={6}
                isLoading={updating}
                loadingText="Saving..."
              >
                Save Changes
              </Button>
            </HStack>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
}
