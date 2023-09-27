import jwt from "jsonwebtoken";
import config from "config";

function generateToken(payload) {
  let privateKey = config.get("PRIVATE_KEY");
  const token = jwt.sign(payload, privateKey, { expiresIn: "1d" });
  return token;
}

export default generateToken;
