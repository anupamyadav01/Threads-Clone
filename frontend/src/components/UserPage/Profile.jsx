import {
  Flex,
  Avatar,
  Text,
  Button,
  VStack,
  HStack,
  Divider,
  IconButton,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Box,
  Skeleton,
  SkeletonCircle,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PiDotsThreeCircleLight } from "react-icons/pi";
import { FaCopy } from "react-icons/fa6";
import { useEffect, useState } from "react";
import axiosInstance from "../../../axiosConfig";
import useShowToast from "../../hooks/useShowToast";
import { useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import useFollowUnfollow from "../../hooks/useFollowUnfollow";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const loggedInUser = useRecoilValue(userAtom);
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalTitle, setModalTitle] = useState("");
  const [modalUsers, setModalUsers] = useState([]);

  // Theme tokens
  const cardBg = useColorModeValue("white", "gray.850");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const primaryText = useColorModeValue("gray.900", "gray.100");
  const secondaryText = useColorModeValue("gray.500", "gray.400");
  const modalHoverBg = useColorModeValue("gray.100", "gray.750");

  const copyUserURL = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast("Copied", "Profile link copied to clipboard", "success");
    });
  };

  useEffect(() => {
    let isMounted = true;

    const getUserDetails = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/user/profile/${username}`);
        if (response?.data?.error) {
          showToast("Error", response.data.error, "error");
          if (isMounted) setUser(null);
          return;
        }
        if (isMounted) setUser(response?.data?.user || response?.data);
      } catch (error) {
        showToast(
          "Error",
          error.response?.data?.message || "Failed to load profile",
          "error",
        );
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getUserDetails();
    return () => {
      isMounted = false;
    };
  }, [username, showToast]);

  const openFollowersModal = () => {
    setModalTitle("Followers");
    setModalUsers(user?.followers || []);
    onOpen();
  };

  const openFollowingModal = () => {
    setModalTitle("Following");
    setModalUsers(user?.following || []);
    onOpen();
  };

  // 1. Loading Skeleton State
  if (loading) {
    return (
      <VStack spacing={6} w="100%" maxW="680px" mx="auto" mt="40px" px={4}>
        <Flex w="100%" justify="space-between" align="center">
          <Box>
            <Skeleton h="24px" w="180px" mb={2} borderRadius="md" />
            <Skeleton h="16px" w="120px" mb={3} borderRadius="md" />
            <Skeleton h="14px" w="220px" borderRadius="md" />
          </Box>
          <SkeletonCircle size="24" />
        </Flex>
        <Skeleton h="36px" w="100%" borderRadius="lg" />
      </VStack>
    );
  }

  // 2. User Not Found State
  if (!user) {
    return (
      <Flex h="50vh" justify="center" align="center" direction="column" gap={3}>
        <Text fontSize="xl" fontWeight="semibold" color={primaryText}>
          User not found
        </Text>
        <Button size="sm" onClick={() => navigate("/")}>
          Return Home
        </Button>
      </Flex>
    );
  }

  const isOwnProfile = loggedInUser?._id === user?._id;

  return (
    <VStack
      spacing={5}
      w="100%"
      maxW="680px"
      mx="auto"
      mt={{ base: "20px", md: "40px" }}
      px={4}
    >
      {/* Profile Header Card */}
      <Box
        w="100%"
        p={{ base: 4, md: 6 }}
        bg={cardBg}
        borderRadius="2xl"
        border="1px solid"
        borderColor={borderColor}
      >
        <Flex
          direction={{ base: "column-reverse", sm: "row" }}
          justify="space-between"
          align={{ base: "flex-start", sm: "center" }}
          gap={4}
        >
          {/* User Details */}
          <VStack align="flex-start" spacing={1} flex="1">
            <Text
              fontWeight="700"
              fontSize={{ base: "xl", md: "2xl" }}
              color={primaryText}
            >
              {user?.name}
            </Text>

            <Text fontSize="sm" color={secondaryText} fontWeight="medium">
              @{user?.username}
            </Text>

            {user?.bio && (
              <Text
                fontSize="sm"
                color={primaryText}
                pt={2}
                whiteSpace="pre-wrap"
              >
                {user.bio}
              </Text>
            )}
          </VStack>

          {/* Avatar and Action Menu */}
          <HStack align="flex-start" spacing={3}>
            <Avatar
              size={{ base: "xl", md: "2xl" }}
              src={user?.profilePic}
              name={user?.name || user?.username}
            />

            <Menu>
              <MenuButton
                as={IconButton}
                icon={<PiDotsThreeCircleLight size={28} />}
                variant="ghost"
                borderRadius="full"
                aria-label="Profile actions"
              />
              <MenuList borderRadius="xl" shadow="md">
                <MenuItem icon={<FaCopy />} onClick={copyUserURL} fontSize="sm">
                  Copy profile link
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>

        {/* Primary CTA (Update Profile or Follow/Unfollow) */}
        <Box mt={5}>
          {isOwnProfile ? (
            <Button
              w="100%"
              variant="outline"
              borderRadius="xl"
              size="sm"
              borderColor={borderColor}
              onClick={() => navigate("/update")}
            >
              Edit Profile
            </Button>
          ) : (
            <Button
              w="100%"
              borderRadius="xl"
              size="sm"
              colorScheme={following ? "gray" : "blue"}
              variant={following ? "outline" : "solid"}
              onClick={handleFollowUnfollow}
              isLoading={updating}
            >
              {following ? "Following" : "Follow"}
            </Button>
          )}
        </Box>
      </Box>

      {/* Followers & Following Toggles */}
      <HStack w="100%" spacing={3}>
        <Button
          flex="1"
          variant="outline"
          borderRadius="xl"
          borderColor={borderColor}
          onClick={openFollowersModal}
          py={5}
        >
          <VStack spacing={0}>
            <Text fontWeight="bold" fontSize="md">
              {user?.followers?.length || 0}
            </Text>
            <Text fontSize="xs" color={secondaryText}>
              Followers
            </Text>
          </VStack>
        </Button>

        <Button
          flex="1"
          variant="outline"
          borderRadius="xl"
          borderColor={borderColor}
          onClick={openFollowingModal}
          py={5}
        >
          <VStack spacing={0}>
            <Text fontWeight="bold" fontSize="md">
              {user?.following?.length || 0}
            </Text>
            <Text fontSize="xs" color={secondaryText}>
              Following
            </Text>
          </VStack>
        </Button>
      </HStack>

      <Divider borderColor={borderColor} />

      {/* Followers / Following Dialog Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
        <ModalOverlay backdropFilter="blur(3px)" />
        <ModalContent borderRadius="2xl" bg={cardBg}>
          <ModalHeader fontSize="md" fontWeight="bold">
            {modalTitle}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} maxH="380px" overflowY="auto">
            {modalUsers?.length > 0 ? (
              modalUsers.map((item, index) => {
                // Safely handles both populated user objects and unpopulated string IDs
                const itemUser =
                  typeof item === "object" ? item : { _id: item };
                const itemUsername = itemUser.username || "User";

                return (
                  <Flex
                    key={itemUser._id || index}
                    align="center"
                    justify="space-between"
                    p={2}
                    borderRadius="lg"
                    _hover={{ bg: modalHoverBg }}
                    cursor="pointer"
                    onClick={() => {
                      onClose();
                      if (itemUser.username) {
                        navigate(`/${itemUser.username}`);
                      }
                    }}
                  >
                    <HStack spacing={3}>
                      <Avatar
                        size="sm"
                        src={itemUser.profilePic}
                        name={itemUser.name || itemUsername}
                      />
                      <Box>
                        <Text fontWeight="semibold" fontSize="sm">
                          {itemUsername}
                        </Text>
                        {itemUser.name && (
                          <Text fontSize="xs" color={secondaryText}>
                            {itemUser.name}
                          </Text>
                        )}
                      </Box>
                    </HStack>
                  </Flex>
                );
              })
            ) : (
              <Flex justify="center" py={6}>
                <Text fontSize="sm" color={secondaryText}>
                  No users to display
                </Text>
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default Profile;
