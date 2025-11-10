// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export function protect(req, res, next) {
  try {
    // Read token from cookie OR Authorization: Bearer <token>
    const bearer = req.headers?.authorization;
    const token =
      req.cookies?.token ||
      (bearer && bearer.startsWith("Bearer ") ? bearer.split(" ")[1] : null);

    if (!token) {
      return res.status(401).json({ message: "unauthorized: no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
    // put minimal info on req.user for /me and other handlers
    req.user = { id: decoded.id, username: decoded.username };
    next();
  } catch (err) {
    return res.status(401).json({ message: "unauthorized: invalid token" });
  }
}
