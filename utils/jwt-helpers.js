import jwt from "jsonwebtoken";
import { config } from "../utils/config.js";
//Generate an access token and a refresh token for the user
function jwtTokens({ user_id, user_name, user_email }) {
  const user = { user_id, user_name, user_email };
  const accessToken = jwt.sign(user, config.ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });
  const refreshToken = jwt.sign(user, config.REFRESH_TOKEN_SECRET, {
    expiresIn: "30m",
  });
  return { accessToken, refreshToken };
}

export { jwtTokens };
