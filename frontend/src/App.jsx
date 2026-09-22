import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage/UserPage";
import Header from "./components/Header/Header";
import { Container, Box } from "@chakra-ui/react";
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
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation();

  // Determine dynamic container widths per route type
  const getContainerMaxWidth = () => {
    if (pathname === "/chat") return { base: "100%", md: "1150px" };
    if (pathname === "/") return { base: "700px", md: "950px" };
    return "700px";
  };

  const isChatRoute = pathname === "/chat";

  return (
    <Box minHeight="100vh" position="relative" pb={isChatRoute ? 0 : 8}>
      <Header />
      <Container
        maxW={getContainerMaxWidth()}
        px={isChatRoute ? { base: 2, md: 4 } : 4}
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
          />
          <Route
            path="/chat"
            element={user ? <ChatPage /> : <Navigate to="/auth" />}
          />
        </Routes>
      </Container>
    </Box>
  );
};

export default App;
