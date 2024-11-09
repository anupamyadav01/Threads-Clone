/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  Flex,
  Image,
  Skeleton,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { BsCheck2All } from "react-icons/bs";
import { useState } from "react";
import { selectedConversationAtom } from "../../atoms/messagesAtom";
import userAtom from "../../atoms/userAtom";

const Message = ({ ownMessage, message }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const user = useRecoilValue(userAtom);

  const [imgLoaded, setImgLoaded] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra UI Modal hooks
  const [selectedImage, setSelectedImage] = useState("");

  const handleImageClick = (img) => {
    setSelectedImage(img);
    onOpen();
  };

  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"}>
          {message?.text && (
            <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}>
              <Text color={"white"} px={3}>
                {message?.text}
              </Text>
              <Box
                alignSelf={"flex-end"}
                ml={1}
                color={message?.seen ? "blue.400" : ""}
                fontWeight={"bold"}
              >
                <BsCheck2All size={16} />
              </Box>
            </Flex>
          )}
          {message?.img && !imgLoaded && (
            <Flex mt={5}>
              <Image
                src={message?.img}
                hidden
                onLoad={() => setImgLoaded(true)}
                alt="Message image"
                borderRadius={4}
                maxW={"250px"} // Increased width
                maxH={"250px"} // Increased height
                objectFit="cover"
                cursor="pointer"
                onClick={() => handleImageClick(message?.img)} // Open the modal when clicked
              />
              <Skeleton w={"250px"} h={"250px"} />
            </Flex>
          )}

          {message?.img && imgLoaded && (
            <Flex mt={5}>
              <Image
                src={message.img}
                alt="Message image"
                borderRadius={4}
                maxW={"250px"} // Increased width
                maxH={"250px"} // Increased height
                objectFit="cover"
                cursor="pointer"
                onClick={() => handleImageClick(message.img)} // Open the modal when clicked
              />
              <Box
                alignSelf={"flex-end"}
                ml={1}
                color={message.seen ? "blue.400" : ""}
                fontWeight={"bold"}
              >
                <BsCheck2All size={16} />
              </Box>
            </Flex>
          )}

          <Avatar src={user?.profilePic} w="7" h={7} />
        </Flex>
      ) : (
        <Flex gap={3}>
          <Avatar src={selectedConversation?.userProfilePic} w="7" h={7} />

          {message.text && (
            <Text
              maxW={"350px"}
              bg={"gray.400"}
              p={1}
              px={3}
              borderRadius={"md"}
              color={"black"}
            >
              {message?.text}
            </Text>
          )}
          {message.img && !imgLoaded && (
            <Flex mt={5} w={"250px"}>
              {" "}
              {/* Increased width */}
              <Image
                src={message.img}
                hidden
                onLoad={() => setImgLoaded(true)}
                alt="Message image"
                borderRadius={4}
                maxW={"250px"} // Increased width
                maxH={"250px"} // Increased height
                objectFit="cover"
                cursor="pointer"
                onClick={() => handleImageClick(message.img)} // Open the modal when clicked
              />
              <Skeleton w={"250px"} h={"250px"} />
            </Flex>
          )}

          {message?.img && imgLoaded && (
            <Flex mt={5} w={"250px"}>
              {" "}
              {/* Increased width */}
              <Image
                src={message.img}
                alt="Message image"
                borderRadius={4}
                maxW={"250px"} // Increased width
                maxH={"250px"} // Increased height
                objectFit="cover"
                cursor="pointer"
                onClick={() => handleImageClick(message.img)} // Open the modal when clicked
              />
            </Flex>
          )}
        </Flex>
      )}

      {/* Modal for showing larger image */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Image Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image
              src={selectedImage}
              alt="Large Image Preview"
              borderRadius={4}
              width="100%" // Make it responsive
              height="auto" // Adjust height automatically
              maxHeight="80vh" // Limit height to 80% of the viewport height
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Message;
