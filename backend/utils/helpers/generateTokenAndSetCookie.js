import jwt from "jsonwebtoken";
const generateTokenAndSetCookie = (user_id, res) => {
  const jwtPayload = {
    userId: user_id,
  };

  const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true, // Prevents client-side access to the cookie
    secure: process.env.NODE_ENV === "production", // Only send over HTTPS
    sameSite: "None", // Allow cross-site cookies if needed
    maxAge: 3600000, // Cookie expiration time
  });

  return token;
};

export default generateTokenAndSetCookie;
