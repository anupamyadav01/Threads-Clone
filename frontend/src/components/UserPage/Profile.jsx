import {
  Flex,
  Avatar,
  Text,
  Button,
  VStack,
  HStack,
  Divider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  IconButton,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
  useColorMode,
  useColorModeValue,
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

  const activeColor = "white";
  const inactiveColor = useColorModeValue("gray.500", "gray.400");
  const activeBorderColor = "white";

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
  if (!user && !loading) return <h1>User not found</h1>;

  return (
    <VStack spacing={4}>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p={4}
        w="100%"
        borderRadius={"3xl"}
        bg={colorMode === "dark" ? "gray.800" : "white"}
      >
        {/* Left - User info */}
        <VStack align="flex-start" spacing={0}>
          <Text fontWeight="bold" fontSize="2xl">
            {user?.name}
          </Text>
          <Text pb={4}>@{user?.username}</Text>
          <Text pb={4}>{user?.bio}</Text>

          {loggedInUser?._id === user?._id && (
            <Link to={"/update"}>
              <Button variant="outline" w="100%">
                Update Profile
              </Button>
            </Link>
          )}
          {loggedInUser?._id !== user?._id && (
            <Button
              variant="outline"
              w="100%"
              onClick={handleFollowUnfollow}
              isLoading={updating}
            >
              {following ? "Unfollow" : "Follow"}
            </Button>
          )}
        </VStack>

        {/* Right - Avatar and Action Button */}
        <Flex flexDir={"column"} justifyContent={"end"} gap={4} align={"end"}>
          <Avatar size="xl" src={user?.profilePic} name={user?.name} />

          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<PiDotsThreeCircleLight />}
              variant="ghost"
              fontSize="30px"
            />
            <MenuList>
              <MenuItem justifyContent={"space-between"} onClick={copyUserURL}>
                Copy Link <FaCopy />
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {/* Action Buttons */}
      <HStack justifyContent="space-between" p={4} w="100%">
        <Button variant="outline" w="48%" onClick={openFollowersModal}>
          {user?.followers?.length} followers
        </Button>
        <Button variant="outline" w="48%" onClick={openFollowingModal}>
          {user?.following?.length} following
        </Button>
      </HStack>

      <Divider />

      {/* Tabs Section */}
      <Tabs variant="unstyled" align="center" w="100%">
        <TabList
          justifyContent="space-around"
          borderBottom="1px solid"
          borderColor="gray.300"
        >
          <Tab
            _selected={{
              color: activeColor,
              borderBottom: "1px solid",
              borderColor: activeBorderColor,
            }}
            color={inactiveColor}
            fontWeight="bold"
            px={6}
          >
            Threads
          </Tab>
          <Tab
            _selected={{
              color: activeColor,
              borderBottom: "1px solid",
              borderColor: activeBorderColor,
            }}
            color={inactiveColor}
            fontWeight="bold"
            px={6}
          >
            Replies
          </Tab>
          <Tab
            _selected={{
              color: activeColor,
              borderBottom: "1px solid",
              borderColor: activeBorderColor,
            }}
            color={inactiveColor}
            fontWeight="bold"
          >
            Reposts
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel></TabPanel>
          <TabPanel>
            <p>Replies</p>
          </TabPanel>
          <TabPanel>
            <p>Reposts</p>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Followers/Following Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {modalUsers?.length > 0 ? (
              modalUsers?.map((user, index) => (
                <Box key={index} display="flex" alignItems="center" mb={4}>
                  <Avatar
                    size="md"
                    src={user?.profilePic}
                    name={user?.username}
                    mr={3}
                  />
                  {/* navigate(`/${postedBy?.username} */}
                  <Link
                    onClick={(e) => {
                      closePopup();
                      e.preventDefault();
                      navigate(`/${user?.username}`);
                    }}
                    fontSize="larger"
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
