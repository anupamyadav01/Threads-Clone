import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (user_id, res) => {
  try {
    const jwtPayload = {
      userId: user_id,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side access to the cookie
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Adjust for local vs. production
      maxAge: 3600000, // Cookie expiration time
    });

    return token;
  } catch (error) {
    console.error("Error generating token or setting cookie:", error);
    throw new Error("Unable to generate token");
  }
};

export default generateTokenAndSetCookie;
