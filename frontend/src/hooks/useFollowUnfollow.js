import { useState } from "react";
import useShowToast from "./useShowToast";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";
import axiosInstance from "../../axiosConfig";

const useFollowUnfollow = (user) => {
  const loggedInUser = useRecoilValue(userAtom);
  const [following, setFollowing] = useState(
    user?.followers?.includes(loggedInUser?._id)
  );
  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();

  const handleFollowUnfollow = async () => {
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
        user.followers.pop(); // simulate removing from followers
      } else {
        showToast("Success", `Followed ${user.name}`, "success");
        user.followers.push(loggedInUser?._id); // simulate adding to followers
      }
      setFollowing(!following);
    } catch (error) {
      console.log("Error from handleFollowUnfollow: ", error);
      showToast("Error", error?.response?.data?.error, "error");
    } finally {
      setUpdating(false);
    }
  };

  return { handleFollowUnfollow, updating, following };
};

export default useFollowUnfollow;
