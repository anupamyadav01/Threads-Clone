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
  useToast,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { PiDotsThreeCircleLight } from "react-icons/pi";
import { FaCopy } from "react-icons/fa6";
import UserPost from "./UserPost";

const Profile = () => {
  const toast = useToast();
  const copyUserURL = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast({
        title: "Profile URL Copied to clipboard",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    });
  };
  const { username } = useParams();
  const { colorMode } = useColorMode();
  const activeColor = "white"; // Color for the active tab
  const inactiveColor = useColorModeValue("gray.500", "gray.400"); // Dim color for inactive tabs
  const activeBorderColor = "white"; // Border color for active tab
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
            Salome Munoz
          </Text>
          <Text pb={4}>@{username}</Text>
          <Text pb={4}>CEO of Facebook</Text>
          <Flex fontSize="sm" color="gray.400">
            <Text>525K followers</Text>
            <Text>525K followers</Text>
          </Flex>
        </VStack>

        {/* Right - Avatar */}
        <Flex flexDir={"column"} justifyContent={"end"} gap={4} align={"end"}>
          <Avatar size="xl" src="/zuck-avatar.png" name="Salome Munoz" />

          {/* Right - Action Button */}
          <Menu>
            <MenuButton>
              <IconButton
                aria-label="Home"
                icon={<PiDotsThreeCircleLight />}
                variant="ghost"
                fontSize="30px"
              />
            </MenuButton>
            <MenuList>
              <MenuItem justifyContent={"space-between"} onClick={copyUserURL}>
                Copy Link <FaCopy />
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      px={6}
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
            px={6} /* Add padding for better visual balance */
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
          <TabPanel>
            <UserPost />

            <UserPost />
            <UserPost />
            <UserPost />
          </TabPanel>
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
