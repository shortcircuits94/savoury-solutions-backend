import jwt from "jsonwebtoken";

// Middleware to authorize users based on JWT
const authorize = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Authorization header missing or malformed");
    return res
      .status(401)
      .json({ msg: "No token provided, authorization denied" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token:", decoded);
    req.token = decoded;

    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(403).json({ msg: "Invalid token, authorization denied" });
  }
};

export default authorize;
