import { Pool } from "pg";

export const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "parva",
    password: "parva123",
    database: "collaborative_compiler"
});