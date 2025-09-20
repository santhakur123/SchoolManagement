const jwt = require("jsonwebtoken");

function auth(req, res, next) {
     console.log(" Headers received:", req.headers);
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token, auth denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(400).json({ msg: "Invalid token" });
  }
}

module.exports = auth;
