import { Button } from "@chakra-ui/button";
import { useSetRecoilState } from "recoil";
import { FiLogOut } from "react-icons/fi";
import userAtom from "../../atoms/userAtom";
import useShowToast from "../../hooks/useShowToast";
import axiosInstance from "../../../axiosConfig";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();

  const handleLogout = async () => {
    try {
      // Send POST request to logout endpoint using axios
      const res = await axiosInstance.post("/user/logout");

      console.log(res);

      if (res?.data?.error) {
        showToast("Error", res.data.error, "error");
        return;
      }

      localStorage.removeItem("user-threads");
      setUser(null);
      navigate("/auth");

      showToast("Success", "Logged out successfully", "success");
    } catch (error) {
      // Handle errors from the request and response
      showToast(
        "Error",
        error?.response?.data?.error || error.message || "Logout failed",
        "error"
      );
    }
  };

  return (
    <Button
      position={"fixed"}
      top={"30px"}
      right={"30px"}
      size={"sm"}
      onClick={handleLogout}
    >
      <FiLogOut size={20} />
    </Button>
  );
};

export default LogoutButton;
