import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";
import axiosInstance from "../../axiosConfig";

const useGetUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();
  const showToast = useShowToast();

  useEffect(() => {
    let isMounted = true;

    const getUser = async () => {
      if (!username) return;

      setLoading(true);
      try {
        const res = await axiosInstance.get(`/user/profile/${username}`);
        const responseData = res?.data;

        // Check for error in response body
        if (responseData?.error) {
          if (isMounted) {
            showToast("Error", responseData.error, "error");
            setUser(null);
          }
          return;
        }

        const userData = responseData?.user || responseData;

        // If the account is frozen, reset user
        if (userData?.isFrozen) {
          if (isMounted) setUser(null);
          return;
        }

        if (isMounted) {
          setUser(userData);
        }
      } catch (error) {
        if (isMounted) {
          setUser(null);
          showToast(
            "Error",
            error.response?.data?.error ||
              error.response?.data?.message ||
              error.message,
            "error",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getUser();

    return () => {
      isMounted = false;
    };
  }, [username, showToast]);

  return { loading, user };
};

export default useGetUserProfile;
