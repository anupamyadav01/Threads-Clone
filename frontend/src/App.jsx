import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage/UserPage";
import Header from "./components/Header/Header";
import { Container, useColorMode, Box } from "@chakra-ui/react";
import PostDetails from "./pages/PostPage/PostDetails";
import HomePage from "./pages/HomePage/HomePage";
import AuthPage from "./pages/AuthPage/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfile/UpdateProfile";
import CreatePost from "./components/Post/CreatePost";
import SearchPage from "./pages/SearchPage/SearchPage";

const App = () => {
  const { colorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  return (
    <>
      <Header />
      <Box
        display="flex"
        justifyContent="center"
        mt={4} /* Adds margin between Header and content */
      >
        <Container
          maxW={`720px`}
          border={"0.5px solid"}
          borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
          borderTopRadius={"30px"}
          h="90vh" /* Fixed height for the container */
          overflow="hidden" /* Prevents content from overflowing */
        >
          <Box
            h="100%"
            overflowY="scroll"
            sx={{
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <Routes>
              <Route
                path="/"
                element={user ? <HomePage /> : <Navigate to="/auth" />}
              />
              <Route
                path="/auth"
                element={!user ? <AuthPage /> : <Navigate to="/" />}
              />
              <Route
                path="/update"
                element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
              />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/:username" element={<UserPage />} />
              <Route path="/:username/post/:postId" element={<PostDetails />} />
            </Routes>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default App;
