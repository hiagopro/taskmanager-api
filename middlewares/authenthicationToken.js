const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
function authenticateToken(req, res, next) {
  const token = req.headers["token"];

  if (!token) return res.status(403).send("Token is required");

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired" });
      }
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
}

module.exports = authenticateToken;
