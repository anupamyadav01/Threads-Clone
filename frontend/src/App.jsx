import { Navigate, Route, Routes, useLocation } from "react-router-dom";
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
import ChatPage from "./pages/ChatPage/ChatPage";
import Activity from "./pages/Activity/Activity";

const App = () => {
  const { colorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation();
  return (
    <>
      <Header />
      <Box width={"full"} display="flex" justifyContent="center">
        <Container
          maxW={pathname === "/" ? { base: "700px", md: "950px" } : "700px"}
          borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
          borderTopRadius={"30px"}
          height={"100%"}
          overflow="hidden"
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
              <Route
                path="/create"
                element={user ? <CreatePost /> : <Navigate to="/auth" />}
              />
              <Route path="/:username" element={<UserPage />} />
              <Route path="/:username/post/:postId" element={<PostDetails />} />
              <Route
                path="/activity"
                element={user ? <Activity /> : <Navigate to="/auth" />}
              />{" "}
              <Route
                path="/chat"
                element={user ? <ChatPage /> : <Navigate to="/auth" />}
              />
            </Routes>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default App;
