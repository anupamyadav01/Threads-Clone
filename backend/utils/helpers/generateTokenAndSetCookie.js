import jwt from "jsonwebtoken";
const generateTokenAndSetCookie = (user_id, res) => {
  const jwtPayload = {
    userId: user_id,
  };

  const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    path: "/",
    expires: new Date(Date.now() + 3600000), // expires in 1 hour
    httpOnly: true,
    sameSite: "strict",
  });
  return token;
};

export default generateTokenAndSetCookie;
