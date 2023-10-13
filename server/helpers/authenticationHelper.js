import jwt from "jsonwebtoken";

// to generate a token for the user
export const generateToken = (user) => {
  const payload = { sub: user._id };

  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
      (err, token) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(token);
      }
    );
  });
};

export const authenticateToken = (req, res, next) => {
  // Get the token from the request headers
  const authHeader = req.headers.authorization;

  // Check if the token is provided
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Extract the token without the "Bearer " prefix
  const token = authHeader.slice(7);

  // Verify the token and extract user data
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    // Attach user data to the request for use in protected routes
    req.user = user;
    next();
  });
};
