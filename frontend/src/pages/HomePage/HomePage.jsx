import { Link } from "react-router-dom";
import { Button } from "@chakra-ui/react";

const HomePage = () => {
  return (
    <div>
      HomePage
      <Link to="/anupam">
        <Button>Go to Profile</Button>
      </Link>
    </div>
  );
};

export default HomePage;
