CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE DATABASE lalitstealth;

CREATE TABLE users(
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL UNIQUE,
  user_password TEXT NOT NULL
);

CREATE TABLE movies(
  record_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  movie_name TEXT NOT NULL,
  rating FLOAT NOT NULL,
  movie_cast TEXT[] NOT NULL,
  genre TEXT NOT NULL,
  release_date TEXT NOT NULL,
  user_email TEXT NOT NULL
);
