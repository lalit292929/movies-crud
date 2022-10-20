import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import { jwtTokens } from "../utils/jwt-helpers.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await pool.query(
      `INSERT INTO users (user_name,user_email,user_password) VALUES ('${req.body.name}','${req.body.email}','${hashedPassword}') RETURNING *`
    );
    res.json(jwtTokens(newUser.rows[0]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
