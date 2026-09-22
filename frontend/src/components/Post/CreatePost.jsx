import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useShowToast from "../../hooks/useShowToast";
import userAtom from "../../atoms/userAtom";
import usePreviewImg from "../../hooks/usePreviewImg";
import modalAtom from "../../atoms/modalAtom";
import axiosInstance from "../../../axiosConfig";
import postsAtom from "../../atoms/postsAtom";

const MAX_CHAR = 500;

const CreatePost = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { username } = useParams();

  const [isOpen, setIsOpen] = useRecoilState(modalAtom);
  const [postText, setPostText] = useState("");
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const imageRef = useRef(null);
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);

  // Chakra UI dynamic tokens
  const charCounterColor = useColorModeValue("gray.500", "gray.400");
  const modalBg = useColorModeValue("white", "gray.850");
  const textareaBorderColor = useColorModeValue("gray.200", "gray.700");

  const resetState = () => {
    setPostText("");
    setRemainingChar(MAX_CHAR);
    setImgUrl("");
    if (imageRef.current) {
      imageRef.current.value = "";
    }
  };

  const handleCloseModal = () => {
    resetState();
    setIsOpen(false);
  };

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      setPostText(inputText.slice(0, MAX_CHAR));
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  const handleRemoveImage = () => {
    setImgUrl("");
    if (imageRef.current) {
      imageRef.current.value = "";
    }
  };

  const handleCreatePost = async () => {
    if (!postText.trim() && !imgUrl) {
      showToast("Error", "Please add some text or an image", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/post/create", {
        content: postText.trim(),
        img: imgUrl,
      });

      // Backend returns either res.data.data or res.data
      const newCreatedPost = res.data?.data || res.data;

      showToast("Success", "Post created successfully", "success");

      // Update feed when on home ("/") or on the user's own profile page
      if (pathname === "/" || username === user?.username) {
        setPosts((prevPosts) => [newCreatedPost, ...(prevPosts || [])]);
      }

      handleCloseModal();
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Something went wrong!";
      showToast("Error", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent
        bg={modalBg}
        maxW={{ base: "90%", sm: "520px" }}
        borderRadius="2xl"
        p={2}
      >
        <ModalHeader fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
          Create Post
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={4}>
          <FormControl>
            <Textarea
              placeholder="What's on your mind?..."
              onChange={handleTextChange}
              value={postText}
              fontSize="sm"
              borderRadius="xl"
              borderColor={textareaBorderColor}
              minH="120px"
              resize="none"
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
              }}
            />

            <Flex justify="space-between" align="center" mt={2} px={1}>
              {/* Image upload trigger */}
              <Flex align="center" gap={2}>
                <Input
                  type="file"
                  hidden
                  ref={imageRef}
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <BsFillImageFill
                  style={{ cursor: "pointer" }}
                  size={18}
                  color="#718096"
                  onClick={() => imageRef.current?.click()}
                  title="Attach image"
                />
              </Flex>

              {/* Character limit counter */}
              <Text fontSize="xs" fontWeight="medium" color={charCounterColor}>
                {remainingChar}/{MAX_CHAR}
              </Text>
            </Flex>
          </FormControl>

          {/* Image Preview */}
          {imgUrl && (
            <Flex
              mt={4}
              w="full"
              position="relative"
              borderRadius="xl"
              overflow="hidden"
              border="1px solid"
              borderColor={textareaBorderColor}
            >
              <Image
                src={imgUrl}
                alt="Selected image preview"
                objectFit="cover"
                width="100%"
                maxH="280px"
              />
              <CloseButton
                onClick={handleRemoveImage}
                position="absolute"
                top={2}
                right={2}
                bg="blackAlpha.700"
                color="white"
                borderRadius="full"
                size="sm"
                _hover={{ bg: "blackAlpha.900" }}
              />
            </Flex>
          )}
        </ModalBody>

        <ModalFooter gap={2} pt={0}>
          <Button
            variant="ghost"
            borderRadius="full"
            size="sm"
            onClick={handleCloseModal}
          >
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            borderRadius="full"
            size="sm"
            onClick={handleCreatePost}
            isLoading={loading}
            isDisabled={!postText.trim() && !imgUrl}
          >
            Post
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreatePost;
