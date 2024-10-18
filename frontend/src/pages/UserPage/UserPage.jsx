import { useEffect, useState } from "react";
import Profile from "../../components/UserPage/Profile";
import axiosInstance from "../../../axiosConfig";
import useShowToast from "../../hooks/useShowToast";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import postsAtom from "../../atoms/postsAtom";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../../components/Post/Post";

const UserPage = () => {
  const showToast = useShowToast();
  const { username } = useParams();
  const [user, setUser] = useState([[]]);
  const [loading, setLoading] = useState(true);

  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  useEffect(() => {
    const getPosts = async () => {
      if (!user) return;
      setFetchingPosts(true);
      try {
        const res = await axiosInstance.get(`/post/user/${username}`);
        const data = res?.data?.posts;
        setPosts(data);
      } catch (error) {
        showToast(
          "Error",
          error.response?.data?.message || error.message,
          "error"
        );
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };

    getPosts();
  }, [username, showToast, setPosts, user]);

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

  if (loading) return <div>Loading...</div>;
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"} alignItems={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!user && !loading)
    return (
      <Flex w={"full"} justifyContent={"center"} alignItems={"center"}>
        <h1>User not found</h1>
      </Flex>
    );

  return (
    <>
      <Profile />

      {!fetchingPosts && posts.length === 0 && <h1>User has not posts.</h1>}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      {posts?.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  );
};
export default UserPage;
