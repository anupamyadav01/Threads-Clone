import {
  Avatar,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../../atoms/userAtom";
import useShowToast from "../../hooks/useShowToast";
import usePreviewImg from "../../hooks/usePreviewImg";
import axiosInstance from "../../../axiosConfig";
import { useNavigate } from "react-router-dom";

export default function UpdateProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(userAtom);
  const [inputs, setInputs] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
    password: "",
  });
  console.log(user);

  const fileRef = useRef(null);
  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();
  const { handleImageChange, imgUrl } = usePreviewImg();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updating) return;
    setUpdating(true);
    try {
      const res = await axiosInstance.put(`/user/update/${user._id}`, {
        ...inputs,
        img: imgUrl,
      });

      if (res?.data?.error) {
        showToast("Error", res?.data?.error, "error");
        return;
      }
      showToast("Success", "Profile updated successfully", "success");
      setUser(res?.data?.error);
      localStorage.setItem("user-threads", JSON.stringify(res?.data?.error));
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Flex
      bg={useColorModeValue("white", "gray.800")}
      justifyContent={"center"}
      alignItems={"center"}
      height={"100vh"}
      px={4} // Add padding to prevent overflow on small screens
    >
      <form onSubmit={handleSubmit}>
        <Flex
          py={8}
          w={useBreakpointValue({ base: "100%", md: "650px" })} // Full width on mobile
          maxW="650px"
          px={5}
          direction="column"
          bg={useColorModeValue("gray.100", "gray.700")}
          rounded="lg"
          boxShadow="lg"
        >
          <Text fontSize={"2xl"} textAlign="center" mb={6}>
            Edit Profile
          </Text>

          <Flex direction={{ base: "column", md: "row" }} gap={6}>
            {/* Left Side - Profile Picture */}
            <Stack align="center" spacing={4} w={{ base: "100%", md: "40%" }}>
              <Avatar
                size="2xl"
                src={imgUrl || user.profilePic}
                borderColor={useColorModeValue("gray.200", "gray.600")}
                borderWidth="2px"
              />
              <Button
                onClick={() => fileRef.current.click()}
                variant="outline"
                colorScheme="blue"
                w="full"
              >
                Update Profile Pic
              </Button>
              <Input
                type="file"
                hidden
                ref={fileRef}
                onChange={handleImageChange}
              />
            </Stack>

            {/* Right Side - Form Fields */}
            <Stack spacing={4} flex={1} w={{ base: "100%", md: "60%" }}>
              <FormControl id="name">
                <FormLabel color={useColorModeValue("gray.700", "gray.200")}>
                  Full Name
                </FormLabel>
                <Input
                  placeholder="Full name"
                  value={inputs.name}
                  onChange={(e) =>
                    setInputs({ ...inputs, name: e.target.value })
                  }
                  _placeholder={{ color: "gray.500" }}
                  bg={useColorModeValue("white", "gray.800")}
                  color={useColorModeValue("gray.700", "white")}
                />
              </FormControl>

              <FormControl id="username">
                <FormLabel color={useColorModeValue("gray.700", "gray.200")}>
                  Username
                </FormLabel>
                <Input
                  placeholder="Username"
                  value={inputs.username}
                  onChange={(e) =>
                    setInputs({ ...inputs, username: e.target.value })
                  }
                  _placeholder={{ color: "gray.500" }}
                  bg={useColorModeValue("white", "gray.800")}
                  color={useColorModeValue("gray.700", "white")}
                />
              </FormControl>

              <FormControl id="email">
                <FormLabel color={useColorModeValue("gray.700", "gray.200")}>
                  Email Address
                </FormLabel>
                <Input
                  placeholder="Email address"
                  value={inputs.email}
                  onChange={(e) =>
                    setInputs({ ...inputs, email: e.target.value })
                  }
                  _placeholder={{ color: "gray.500" }}
                  type="email"
                  bg={useColorModeValue("white", "gray.800")}
                  color={useColorModeValue("gray.700", "white")}
                />
              </FormControl>

              <FormControl id="bio">
                <FormLabel color={useColorModeValue("gray.700", "gray.200")}>
                  Bio
                </FormLabel>
                <Textarea
                  placeholder="Bio"
                  value={inputs.bio}
                  onChange={(e) =>
                    setInputs({ ...inputs, bio: e.target.value })
                  }
                  _placeholder={{ color: "gray.500" }}
                  bg={useColorModeValue("white", "gray.800")}
                  color={useColorModeValue("gray.700", "white")}
                />
              </FormControl>

              <FormControl id="password">
                <FormLabel color={useColorModeValue("gray.700", "gray.200")}>
                  Password
                </FormLabel>
                <Input
                  placeholder="Password"
                  value={inputs.password}
                  onChange={(e) =>
                    setInputs({ ...inputs, password: e.target.value })
                  }
                  _placeholder={{ color: "gray.500" }}
                  type="password"
                  bg={useColorModeValue("white", "gray.800")}
                  color={useColorModeValue("gray.700", "white")}
                />
              </FormControl>
            </Stack>
          </Flex>

          {/* Action Buttons */}
          <Flex justify="space-between" mt={6} w="full">
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={updating}
              w="48%"
            >
              Update Profile
            </Button>
            <Button
              colorScheme="gray"
              variant="outline"
              w="48%"
              onClick={() => {
                navigate(`/${user?.username}`);
              }}
            >
              Cancel
            </Button>
          </Flex>
        </Flex>
      </form>
    </Flex>
  );
}
