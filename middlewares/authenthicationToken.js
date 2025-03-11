const jwt = require("jsonwebtoken");

const secret = 'T2NzMFVhVzM4ZW9VdVR5Y3g0a0pXbTFRbGRaZG5mYzZB'
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
    console.debug('autenticado')
  if (!token) return res.status(403).send("Token is required");

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
          }
          return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = decoded;
    next();
  });
}

module.exports = authenticateToken;