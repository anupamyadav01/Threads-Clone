import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is missing");
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax", // lowercase per RFC standard
    maxAge: 60 * 60 * 1000, // 1 hour in ms
  });

  return token;
};

export default generateTokenAndSetCookie;
