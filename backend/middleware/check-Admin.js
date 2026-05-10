const jwt = require("jsonwebtoken");

const checkAdmin = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      message: "Token is not defined ",
    });
  }
  const bearer = authorization.split(" ")[0];
  const token = authorization.split(" ")[1];

  if (bearer != "Bearer" || !token)
    return res.status(401).json({
      message: "Bearer token is require!",
    });
  try {
    const decode = jwt.verify(token, process.env.SEKRET_KEY);
    req.user = decode;

    if (req.user.role != "admin") {
      return res.status(403).json({
        message: "You are not admin ukam",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = checkAdmin;
