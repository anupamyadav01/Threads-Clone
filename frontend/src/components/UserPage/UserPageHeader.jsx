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
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { RxDotsHorizontal } from "react-icons/rx";
import { PiDotsThreeCircleLight } from "react-icons/pi";
import { FaCopy } from "react-icons/fa6";

const UserPageHeader = () => {
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

  return (
    <VStack spacing={4} align="stretch">
      {/* Header Section */}
      {username && (
        <Flex
          zIndex={200}
          justifyContent="space-between"
          alignItems={"center"}
          p={4}
          bg={"gray.800"}
          borderRadius="lg"
          w="100%"
          position="relative"
        >
          {/* Left - Back button */}
          <IconButton
            aria-label="Home"
            icon={<GoArrowLeft />}
            variant="ghost"
            fontSize="22px"
          />

          {/* Center - Username */}
          <Text fontWeight="bold" fontSize="lg">
            {username}
          </Text>

          {/* Right - Menu Icon */}
          <IconButton
            aria-label="Home"
            icon={<RxDotsHorizontal />}
            variant="ghost"
            fontSize="22px"
          />
        </Flex>
      )}

      {/* User Info */}
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p={4}
        w="100%"
        borderRadius={"3xl"}
        bg={"#273042"}
      >
        {/* Left - User info */}
        <VStack align="flex-start" spacing={0}>
          <Text fontWeight="bold" fontSize="2xl">
            Salome Munoz
          </Text>
          <Text pb={4}>@{username}</Text>
          <Text pb={4}>one of a kind</Text>
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

      {/* Tabs for Threads, Replies, Mentions */}
      <Tabs variant="soft-rounded" align="center" colorScheme="blue">
        <TabList>
          <Tab>Threads</Tab>
          <Tab>Replies</Tab>
          <Tab>Reposts</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <p>Threads content goes here...</p>
          </TabPanel>
          <TabPanel>
            <p>Replies content goes here...</p>
          </TabPanel>
          <TabPanel>
            <p>Reposts content goes here...</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default UserPageHeader;
