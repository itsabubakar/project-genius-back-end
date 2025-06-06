//function to verify and authenticate jsonwebtokens sent with the requests
import jwt from "jsonwebtoken";

const authenticateToken = (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res
      .status(401)
      .json({ message: "Access Denied: No token provided." });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT Verification Error:", err);

      if (err instanceof jwt.TokenExpiredError) {
        return res
          .status(401)
          .json({ message: "Access Denied: Token expired." });
      }
      return res.status(403).json({ message: "Access Denied: Invalid token." });
    }
    req.user = user;
    next();
  });
};

export default authenticateToken;
