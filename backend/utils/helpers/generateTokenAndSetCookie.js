import jwt from "jsonwebtoken";
const generateTokenAndSetCookie = (user_id, res) => {
  const token = jwt.sign({ user_id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    secure: false,
    sameSite: "strict",
  });

  return token;
};

export default generateTokenAndSetCookie;
