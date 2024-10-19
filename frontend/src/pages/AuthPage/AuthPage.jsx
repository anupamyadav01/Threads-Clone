import LoginCard from "../../components/Auth/LoginCard";
import { useRecoilValue } from "recoil";
import SignupCard from "../../components/Auth/SignupCard";
import authScreenAtom from "../../atoms/authAtom";

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);
  return (
    <div>{authScreenState === "login" ? <LoginCard /> : <SignupCard />}</div>
  );
};

export default AuthPage;
