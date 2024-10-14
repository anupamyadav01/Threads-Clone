import { Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage/UserPage";
import PostPage from "./pages/PostPage/PostPage";
import Header from "./components/Header/Header";
import { Container } from "@chakra-ui/react";

const App = () => {
  return (
    <>
      <Header />
      <Container maxW={`620px`}>
        <Routes>
          <Route path="/:username" element={<UserPage />} />
          <Route path="/:username/post/:postId" element={<PostPage />} />
        </Routes>
      </Container>
    </>
  );
};

export default App;
