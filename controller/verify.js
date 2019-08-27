const jwt = require("jsonwebtoken");

const verfiyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized Request");
  }
  let token = req.headers.authorization.split(" ")[1];
  if (token === "null") {
    return res.status(401).send("Unauthorized Request");
  }
  jwt.verify(token, "secret", function(err, decoded) {
    if (err) return res.status(401).send("Unauthorized Request");

    req.phone_number = decoded.phone_number;
    next();
  });
};

module.exports = {
  verfiyToken
};