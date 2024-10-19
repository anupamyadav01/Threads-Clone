import { useToast } from "@chakra-ui/react";
import { useCallback, useRef } from "react";

const useShowToast = () => {
  const toast = useToast();
  const activeToastRef = useRef(null); // Ref to store the active toast ID

  const showToast = useCallback(
    (title, description, status) => {
      // Check if a toast with the same title is already active
      if (activeToastRef.current) {
        toast.close(activeToastRef.current); // Close the existing toast
      }

      // Create a new toast and store its ID
      const id = toast({
        title,
        description,
        status,
        duration: 3000,
        isClosable: true,
      });

      activeToastRef.current = id; // Store the current toast ID
    },
    [toast]
  );

  return showToast;
};

export default useShowToast;
