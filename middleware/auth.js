const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log(token);
    if (!token || token.split(" ")[0] !== "Bearer")
      return res
        .status(400)
        .json({ status: false, message: "Bearer Token is Required" });

    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({status: false, message: "Unauthorized" });
  }
};
