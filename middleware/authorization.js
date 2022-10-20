import jwt from "jsonwebtoken";
import {config} from '../utils/config.js';

function authenticateToken(req, res, next) {
  // function to authenticate jwt received in request header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).json({ error: "Null token" });
  jwt.verify(token, config.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) return res.status(403).json({ error: error.message });
    req.user = user;
    next();
  });
}

export { authenticateToken };
