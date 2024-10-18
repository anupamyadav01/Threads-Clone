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
} from "@chakra-ui/react";
import { useRef, useState } from "react";

import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import { useNavigate, useParams } from "react-router-dom";
import useShowToast from "../../hooks/useShowToast";
import userAtom from "../../atoms/userAtom";
import usePreviewImg from "../../hooks/usePreviewImg";
import modalAtom from "../../atoms/modalAtom";
import axiosInstance from "../../../axiosConfig";
import postsAtom from "../../atoms/postsAtom";

const MAX_CHAR = 500;

const CreatePost = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useRecoilState(modalAtom);
  const [postText, setPostText] = useState("");
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const imageRef = useRef(null);
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { username } = useParams();

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

  const handleCreatePost = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/post/create", {
        postedBy: user._id,
        content: postText,
        img: imgUrl,
      });

      const data = res.data; // axios automatically parses JSON
      console.log(data);

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      showToast("Success", "Post created successfully", "success");

      if (username === user.username) {
        setPosts([data, ...posts]);
      }

      setIsOpen(false); // Close modal
      setPostText("");
      setImgUrl("");
      navigate("/");
    } catch (error) {
      // axios returns the error details in error.response
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";
      showToast("Error", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {/* Modal content */}
        <ModalOverlay />

        <ModalContent maxW="600px" height="auto">
          {" "}
          {/* You can adjust the value here */}
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="Post content goes here.."
                onChange={handleTextChange}
                value={postText}
              />
              <Text
                fontSize="xs"
                fontWeight="bold"
                textAlign={"right"}
                m={"1"}
                color={"gray.800"}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>

              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />

              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => imageRef.current.click()}
              />
            </FormControl>
            {imgUrl && (
              <Flex mt={5} w="full" position="relative" justifyContent="center">
                <Image
                  src={imgUrl}
                  alt="Selected image"
                  objectFit="cover" // Fills the container while cropping any overflow to maintain aspect ratio
                  width="100%" // Full width of the container
                  height="300px" // Adjust this as per your design, this ensures a fixed height
                  borderRadius="md" // Optional: Add border radius for rounded corners
                />
                <CloseButton
                  onClick={() => {
                    setImgUrl("");
                  }}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCreatePost}
              isLoading={loading}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreatePost;
