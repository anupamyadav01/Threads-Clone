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
  useColorMode,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Box,
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
  const { colorMode } = useColorMode();
  const showToast = useShowToast();
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const loggedInUser = useRecoilValue(userAtom);
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalTitle, setModalTitle] = useState("");
  const [modalUsers, setModalUsers] = useState([]);

  const copyUserURL = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast("Copied", "User URL copied to clipboard", "success");
    });
  };

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await axiosInstance.get(`/user/profile/${username}`);
        if (response?.data?.error) {
          showToast("Error", response?.data?.error, "error");
          setUser([[]]);
          return;
        } else {
          setUser(response?.data?.user);
          return;
        }
      } catch (error) {
        console.log("Error from getUserDetails: ", error);
      } finally {
        setLoading(false);
      }
    };
    getUserDetails();
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

  const closePopup = () => {
    onClose();
  };

  if (!user && !loading) return <Text>User not found</Text>;

  return (
    <VStack spacing={4} width="100%" mt={{ base: "40px", md: "60px" }} p={4}>
      <Flex
        width="100%"
        p={4}
        borderRadius="lg"
        bg={colorMode === "dark" ? "gray.800" : "white"}
      >
        <VStack flex={1} spacing={4} mb={{ base: 4, sm: 0 }}>
          <Avatar
            size={{ base: "xl", sm: "2xl" }}
            src={user?.profilePic}
            name={user?.name}
          />
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<PiDotsThreeCircleLight />}
              fontSize="30px"
              variant="ghost"
              aria-label="Options"
            />
            <MenuList>
              <MenuItem justifyContent="space-between" onClick={copyUserURL}>
                Copy Link <FaCopy />
              </MenuItem>
            </MenuList>
          </Menu>
        </VStack>

        {/* Left - User info (below avatar on small screens) */}
        <VStack spacing={2} flex={2} p={3}>
          <Text fontWeight="medium" fontSize={{ base: "lg", md: "2xl" }}>
            {user?.name}
          </Text>
          <Text fontSize={{ base: "sm", md: "md" }} color="gray.500">
            @{user?.username}
          </Text>
          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">
            {user?.bio}
          </Text>
          {loggedInUser?._id === user?._id ? (
            <Link to="/update">
              <Button variant="outline" size="sm" colorScheme="blue">
                Update Profile
              </Button>
            </Link>
          ) : (
            <Button
              size="sm"
              variant="solid"
              colorScheme={following ? "red" : "blue"}
              onClick={handleFollowUnfollow}
              isLoading={updating}
            >
              {following ? "Unfollow" : "Follow"}
            </Button>
          )}
        </VStack>
      </Flex>

      {/* Action Buttons */}
      <HStack justifyContent="center" width="100%" p={4} spacing={4}>
        <Button variant="outline" w="45%" onClick={openFollowersModal}>
          {user?.followers?.length} Followers
        </Button>
        <Button variant="outline" w="45%" onClick={openFollowingModal}>
          {user?.following?.length} Following
        </Button>
      </HStack>

      <Divider />

      {/* Followers/Following Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {modalUsers?.length ? (
              modalUsers.map((user, index) => (
                <Box key={index} display="flex" alignItems="center" mb={4}>
                  <Avatar
                    size="md"
                    src={user?.profilePic}
                    name={user?.username}
                    mr={3}
                  />
                  <Link
                    onClick={(e) => {
                      closePopup();
                      e.preventDefault();
                      navigate(`/${user?.username}`);
                    }}
                    fontSize="lg"
                  >
                    {user?.username}
                  </Link>
                </Box>
              ))
            ) : (
              <Text>No users to display.</Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default Profile;
