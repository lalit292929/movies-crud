import pg from "pg";
const { Pool } = pg;
import { config } from "./utils/config.js";

const poolConfig = config.localPoolConfig;

const pool = new Pool(poolConfig);
export default pool;
