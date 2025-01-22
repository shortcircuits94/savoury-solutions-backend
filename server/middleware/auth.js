import jwt from "jsonwebtoken";

const authorize = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Authorization header missing or malformed");
      return res.status(401).json({
        error: "Authentication required",
        message: "No valid authorization header found",
      });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token:", token);

    if (!token) {
      console.log("Token is empty");
      return res.status(401).json({
        error: "Authentication required",
        message: "No token provided",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);

      // Store the entire decoded token object
      req.user = decoded;

      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);

      // Provide specific error messages based on the type of JWT error
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          error: "Token expired",
          message: "Your session has expired. Please log in again.",
        });
      } else if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          error: "Invalid token",
          message: "Authentication token is invalid",
        });
      }

      return res.status(403).json({
        error: "Authentication failed",
        message: "Unable to verify authentication token",
      });
    }
  } catch (error) {
    console.error("Authorization middleware error:", error);
    return res.status(500).json({
      error: "Server error",
      message: "An internal server error occurred",
    });
  }
};

export default authorize;
