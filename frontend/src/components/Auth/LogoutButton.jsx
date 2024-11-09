import { Button } from "@chakra-ui/react";
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
      const res = await axiosInstance.post("/user/logout");

      if (res?.data?.error) {
        showToast("Error", res.data.error, "error");
        return;
      }

      localStorage.removeItem("user-threads");
      setUser(null);
      navigate("/auth");

      showToast("Success", "Logged out successfully", "success");
    } catch (error) {
      showToast(
        "Error",
        error?.response?.data?.error || error.message || "Logout failed",
        "error"
      );
    }
  };

  return (
    <Button
      size={{ base: "md", md: "lg" }}
      onClick={handleLogout}
      leftIcon={<FiLogOut />}
      variant="ghost"
      ml={{ base: 2, md: 4 }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
