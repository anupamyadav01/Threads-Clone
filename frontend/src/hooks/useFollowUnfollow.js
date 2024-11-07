import { useEffect, useState, useCallback } from "react";
import useShowToast from "./useShowToast";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";
import axiosInstance from "../../axiosConfig";

const useFollowUnfollow = (user) => {
  const loggedInUser = useRecoilValue(userAtom);
  const [following, setFollowing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();

  // Check if the logged-in user is following the profile user on load
  useEffect(() => {
    if (user && loggedInUser) {
      const isFollowing = user.followers.some(
        (follower) => follower._id === loggedInUser._id
      );
      setFollowing(isFollowing);
    }
  }, [user, loggedInUser]);

  // Toggle follow/unfollow status
  const handleFollowUnfollow = useCallback(async () => {
    if (!loggedInUser) {
      showToast("Error", "Please login to follow", "error");
      return;
    }
    if (updating) return;

    setUpdating(true);
    try {
      const response = await axiosInstance.post(
        `/user/follow/${user?._id}`,
        {}
      );
      if (response?.data?.error) {
        showToast("Error", response?.data?.error, "error");
        return;
      }

      if (following) {
        showToast("Success", `Unfollowed ${user.name}`, "success");
        user.followers = user.followers.filter((id) => id !== loggedInUser._id);
      } else {
        showToast("Success", `Followed ${user.name}`, "success");
        user.followers.push(loggedInUser._id);
      }

      setFollowing(!following);
    } catch (error) {
      console.log("Error from handleFollowUnfollow: ", error);
      showToast(
        "Error",
        error?.response?.data?.error || "An error occurred",
        "error"
      );
    } finally {
      setUpdating(false);
    }
  }, [loggedInUser, user, following, showToast, updating]);

  return { handleFollowUnfollow, updating, following };
};

export default useFollowUnfollow;
