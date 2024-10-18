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
  Spinner,
} from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { PiDotsThreeCircleLight } from "react-icons/pi";
import { FaCopy } from "react-icons/fa6";
import UserPost from "./UserPost";
import { useEffect, useState } from "react";
import axiosInstance from "../../../axiosConfig";
import useShowToast from "../../hooks/useShowToast";
import { useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import useFollowUnfollow from "../../hooks/useFollowUnfollow";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const { colorMode } = useColorMode();
  const showToast = useShowToast();
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const loggedInUser = useRecoilValue(userAtom);
  // const [following, setFollowing] = useState(
  //   user?.followers?.includes(loggedInUser?._id)
  // );

  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
  // const handleFollowUnfollow = async () => {
  //   try {
  //     const response = await axiosInstance.post(
  //       `/user/follow/${user?._id}`,
  //       {}
  //     );
  //     console.log(response?.data?.message);

  //     if (response?.data?.error) {
  //       showToast("Error", response?.data?.error, "error");
  //       return;
  //     } else {
  //       showToast("Success", response?.data?.message, "success");
  //       setFollowing(!following);
  //       return;
  //     }
  //   } catch (error) {
  //     console.log("Error from handleFollowUnfollow: ", error);
  //     showToast("Error", error?.response?.data?.error, "error");
  //   }
  // };
  const copyUserURL = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast("Copied", "User URL copied to clipboard", "success");
    });
  };

  const activeColor = "white"; // Color for the active tab
  const inactiveColor = useColorModeValue("gray.500", "gray.400"); // Dim color for inactive tabs
  const activeBorderColor = "white"; // Border color for active tab

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await axiosInstance.get(`/user/profile/${username}`);
        if (response?.data?.error) {
          showToast("Error", response?.data?.error, "error");
          setUser([[]]);
          return;
        } else {
          showToast("Success", "User fetched successfully", "success");
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
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

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
          <Flex fontSize="sm" color="gray.400">
            <Text>{user?.followers?.length} followers</Text>
          </Flex>
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
          <Avatar size="xl" src={user?.profilePic} name="Salome Munoz" />

          <Menu>
            <MenuButton
              as={IconButton} // Use IconButton directly within MenuButton to avoid nesting button elements
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
        <Button variant="outline" w="48%">
          Following
        </Button>
        <Button variant="outline" w="48%">
          Mention
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
            px={6} // Add padding for better visual balance
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
    </VStack>
  );
};

export default Profile;
