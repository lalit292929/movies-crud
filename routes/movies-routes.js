import express from "express";
import pool from "../db.js";
import { authenticateToken } from "../middleware/authorization.js";

const router = express.Router();

router.get("/movie", authenticateToken, async (req, res) => {
  try {
    const movies = await pool.query(
      `SELECT * FROM movies WHERE 
      user_email = '${req.user.user_email}' and
      record_id = '${req.query.record_id}';`
    );
    if (movies && movies.rows && movies.rows[0]) {
      res.json({ movies: movies.rows[0] });
    } else {
      res.status(404).json({ error: "record not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const movies = await pool.query(
      `SELECT * FROM movies WHERE 
      user_email = '${req.user.user_email}'
      ${req.query.skip ? `offset ${parseInt(req.query.skip)}` : ""} 
      ${req.query.limit ? `limit ${parseInt(req.query.limit)}` : ""};`
    );
    res.json({ movies: movies.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const newMovie = await pool.query(
      `INSERT INTO movies (movie_name, rating, movie_cast, genre, release_date, user_email) 
      VALUES
       ('${req.body.movie_name}', ${
        req.body.rating
      }, '{"${req.body.movie_cast.join('","')}"}', '${req.body.genre}', '${
        req.body.release_date
      }', '${req.user.user_email}')
        RETURNING *`
    );
    res.json(newMovie.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/", authenticateToken, async (req, res) => {
  try {
    const updatedMovie = await pool.query(
      `UPDATE movies
      SET 
      movie_name = '${req.body.movie_name}', 
      rating = ${req.body.rating},
      movie_cast = '{"${req.body.movie_cast.join('","')}"}',
      genre = '${req.body.genre}',
      release_date = '${req.body.release_date}'
      WHERE 
      record_id = '${req.body.record_id}'
      RETURNING *`
    );
    res.json(updatedMovie.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/", authenticateToken, async (req, res) => {
  try {
    const deletedMovie = await pool.query(
      `DELETE from movies WHERE record_id = '${req.query.record_id}' and user_email = '${req.user.user_email}' RETURNING *`
    );
    res.json(deletedMovie.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
