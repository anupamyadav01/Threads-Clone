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
    const getUser = async () => {
      try {
        // Make a GET request using axiosInstance
        const res = await axiosInstance.get(`/user/profile/${username}`);

        // Axios automatically parses the response, so access the data directly
        const data = res?.data?.user;
        // Handle errors in the response
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        // If the user account is frozen, set user to null
        if (data.isFrozen) {
          setUser(null);
          return;
        }

        // Set the user state with the retrieved data
        setUser(data);
      } catch (error) {
        // Error handling with Axios
        showToast(
          "Error",
          error.response?.data?.message || error.message,
          "error"
        );
      } finally {
        setLoading(false); // Ensure loading state is reset
      }
    };

    // Call the getUser function when username or showToast changes
    getUser();
  }, [username, showToast]);

  return { loading, user };
};

export default useGetUserProfile;
