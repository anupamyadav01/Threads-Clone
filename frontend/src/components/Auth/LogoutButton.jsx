import {
  Button,
  IconButton,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { FiLogOut } from "react-icons/fi";
import userAtom from "../../atoms/userAtom";
import useShowToast from "../../hooks/useShowToast";
import axiosInstance from "../../../axiosConfig";
import { useNavigate } from "react-router-dom";

const LogoutButton = ({ iconOnly = false }) => {
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);

  const hoverBg = useColorModeValue("red.50", "whiteAlpha.100");
  const iconColor = useColorModeValue("red.500", "red.400");

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axiosInstance.post("/user/logout");
      showToast("Success", "Logged out successfully", "success");
    } catch (error) {
      // Show error but still proceed with client cleanup
      showToast(
        "Notice",
        error?.response?.data?.message || "Logged out locally",
        "info",
      );
    } finally {
      // Always purge local credentials so the client doesn't get trapped in an invalid session
      localStorage.removeItem("user-threads");
      setUser(null);
      setLoading(false);
      navigate("/auth");
    }
  };

  // Compact icon button mode (ideal for top navbars and sidebars)
  if (iconOnly) {
    return (
      <Tooltip label="Log out" placement="bottom" hasArrow>
        <IconButton
          aria-label="Log out"
          icon={<FiLogOut size={18} />}
          variant="ghost"
          size="sm"
          borderRadius="full"
          color={iconColor}
          isLoading={loading}
          onClick={handleLogout}
          _hover={{ bg: hoverBg }}
        />
      </Tooltip>
    );
  }

  // Standard pill button
  return (
    <Button
      size="sm"
      variant="ghost"
      borderRadius="full"
      color={iconColor}
      leftIcon={<FiLogOut size={16} />}
      isLoading={loading}
      loadingText="Logging out..."
      onClick={handleLogout}
      _hover={{ bg: hoverBg }}
    >
      Log out
    </Button>
  );
};

export default LogoutButton;
