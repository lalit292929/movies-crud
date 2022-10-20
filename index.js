import express, { json } from "express";
import cors from "cors";
import moviesRouter from "./routes/movies-routes.js";
import usersRouter from "./routes/users-routes.js";
import authRouter from "./routes/auth-routes.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = { credentials: true, origin: "*" };

app.use(cors(corsOptions));
app.use(json());

app.use("/", express.static(join(__dirname, "public")));
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/movies", moviesRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port:${PORT}`);
});
