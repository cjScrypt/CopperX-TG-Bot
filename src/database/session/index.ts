import { Postgres } from "@telegraf/session/pg";
import { Pool } from "pg";
import {
    SESSION_DB_HOST,
    SESSION_DB_NAME,
    SESSION_DB_USER,
    SESSION_DB_PASSWORD
} from "../../config";
import { SceneSession } from "../../interfaces";

const pool = new Pool({
    host: SESSION_DB_HOST,
    database: SESSION_DB_NAME,
    user: SESSION_DB_USER,
    password: SESSION_DB_PASSWORD
})

export const store = Postgres<SceneSession>({ pool });