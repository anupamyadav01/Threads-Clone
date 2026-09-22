import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa6";
import { PiDotsThreeCircleLight } from "react-icons/pi";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import useFollowUnfollow from "../../hooks/useFollowUnfollow";
import useShowToast from "../../hooks/useShowToast";
import axiosInstance from "../../../axiosConfig";

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const showToast = useShowToast();
  const loggedInUser = useRecoilValue(userAtom);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

  // Modal State for Followers / Following
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalTitle, setModalTitle] = useState("");
  const [modalUsers, setModalUsers] = useState([]);

  // Theme colors
  const cardBg = useColorModeValue("white", "gray.850");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.900", "gray.100");
  const subTextColor = useColorModeValue("gray.500", "gray.400");

  // Fetch Profile Info
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/user/profile/${username}`);
        console.log(res);

        if (res.data?.error) {
          showToast("Error", res.data.error, "error");
          setUser(null);
        } else {
          setUser(res.data.user || res.data);
        }
      } catch (err) {
        showToast("Error", err.response?.data?.message || err.message, "error");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Success", "Profile link copied to clipboard", "success");
  };

  const handleOpenModal = (title, list) => {
    setModalTitle(title);
    setModalUsers(list || []);
    onOpen();
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="40vh">
        <Spinner size="lg" color="blue.500" />
      </Flex>
    );
  }

  if (!user) {
    return (
      <Flex
        justify="center"
        align="center"
        minH="40vh"
        direction="column"
        gap={3}
      >
        <Text fontSize="lg" fontWeight="semibold" color={textColor}>
          User not found
        </Text>
        <Button size="sm" onClick={() => navigate("/")}>
          Go Home
        </Button>
      </Flex>
    );
  }

  const isOwnProfile = loggedInUser?._id === user._id;

  return (
    <Box maxW="620px" mx="auto" w="100%" pt={4} px={4}>
      <Box
        p={6}
        bg={cardBg}
        borderRadius="2xl"
        border="1px solid"
        borderColor={borderColor}
      >
        {/* Top: Name/Username on left, Avatar + Menu on right */}
        <Flex justify="space-between" align="start">
          <Box>
            <Text fontSize="2xl" fontWeight="bold" color={textColor}>
              {user.name}
            </Text>
            <Text fontSize="sm" color={subTextColor}>
              @{user.username}
            </Text>
          </Box>

          <HStack spacing={2} align="center">
            <Avatar size="lg" name={user.name} src={user.profilePic} />
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<PiDotsThreeCircleLight size={28} />}
                variant="ghost"
                borderRadius="full"
                aria-label="Options"
              />
              <MenuList>
                <MenuItem icon={<FaCopy />} onClick={copyUrl}>
                  Copy link
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>

        {/* Bio */}
        {user.bio && (
          <Text fontSize="sm" color={textColor} mt={3} whiteSpace="pre-wrap">
            {user.bio}
          </Text>
        )}

        {/* Follow / Edit Profile CTA Button */}
        <Box mt={5}>
          {isOwnProfile ? (
            <Button
              w="full"
              size="sm"
              variant="outline"
              borderRadius="xl"
              onClick={() => navigate("/update")}
            >
              Edit Profile
            </Button>
          ) : (
            <Button
              w="full"
              size="sm"
              borderRadius="xl"
              colorScheme={following ? "gray" : "blue"}
              variant={following ? "outline" : "solid"}
              onClick={handleFollowUnfollow}
              isLoading={updating}
            >
              {following ? "Unfollow" : "Follow"}
            </Button>
          )}
        </Box>
      </Box>

      {/* Followers & Following Stats */}
      <HStack spacing={3} mt={4} w="full">
        <Button
          flex={1}
          variant="outline"
          borderRadius="xl"
          borderColor={borderColor}
          onClick={() => handleOpenModal("Followers", user.followers)}
        >
          <Text fontSize="sm">
            <b>{user.followers?.length || 0}</b> Followers
          </Text>
        </Button>

        <Button
          flex={1}
          variant="outline"
          borderRadius="xl"
          borderColor={borderColor}
          onClick={() => handleOpenModal("Following", user.following)}
        >
          <Text fontSize="sm">
            <b>{user.following?.length || 0}</b> Following
          </Text>
        </Button>
      </HStack>

      <Divider my={6} borderColor={borderColor} />

      {/* Followers / Following List Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
        <ModalOverlay backdropFilter="blur(3px)" />
        <ModalContent borderRadius="xl" bg={cardBg}>
          <ModalHeader fontSize="md">{modalTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} maxH="350px" overflowY="auto">
            {modalUsers.length === 0 ? (
              <Text
                textAlign="center"
                color={subTextColor}
                fontSize="sm"
                py={4}
              >
                No users found.
              </Text>
            ) : (
              <VStack spacing={3} align="stretch">
                {modalUsers.map((item, idx) => (
                  <UserRow
                    key={item?._id || idx}
                    item={item}
                    onClose={onClose}
                    navigate={navigate}
                  />
                ))}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

// Mini subcomponent to render each user in the Followers/Following modal
const UserRow = ({ item, onClose, navigate }) => {
  const username = item.username || "user";
  const name = item.name || username;
  const hoverBg = useColorModeValue("gray.50", "whiteAlpha.100");

  return (
    <Flex
      align="center"
      gap={3}
      p={2}
      borderRadius="lg"
      cursor="pointer"
      _hover={{ bg: hoverBg }}
      onClick={() => {
        onClose();
        navigate(`/${username}`);
      }}
    >
      <Avatar size="sm" src={item.profilePic} name={name} />
      <Box minW="0" flex={1}>
        <Text fontSize="sm" fontWeight="bold" noOfLines={1}>
          {username}
        </Text>
        {item.name && (
          <Text fontSize="xs" color="gray.500" noOfLines={1}>
            {item.name}
          </Text>
        )}
      </Box>
    </Flex>
  );
};

export default Profile;
