import express from "express";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import bcrypt from "bcrypt";
import { jwtTokens } from "../utils/jwt-helpers.js";
import { authenticateToken } from "../middleware/authorization.js";
import {config} from '../utils/config.js';
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await pool.query(
      `SELECT * FROM users WHERE user_email = '${email}'`,
    );
    if (users.rows.length === 0)
      return res.status(401).json({ error: "Email is incorrect" });
    //PASSWORD CHECK
    const validPassword = await bcrypt.compare(
      password,
      users.rows[0].user_password
    );
    if (!validPassword)
      return res.status(401).json({ error: "Incorrect password" });
    //JWT
    let tokens = jwtTokens(users.rows[0]); 

    res.json(tokens);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.get("/refresh_token", (req, res) => {
  try {
    const authHeader = req.headers["authorization"]; 
    const refreshToken = authHeader && authHeader.split(" ")[1];
    if (refreshToken === null) return res.sendStatus(401);
    jwt.verify(
      refreshToken,
      config.REFRESH_TOKEN_SECRET,
      (error, user) => {
        if (error) return res.status(403).json({ error: error.message });
        let tokens = jwtTokens(user);
        return res.json(tokens);
      }
    );
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    res.json({ auth: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
