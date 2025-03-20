import express from "express";

import { configureApp } from "./app";


const main = async () => {
    const app = express();
    const PORT = 3000;

    await configureApp(app);
    app.listen(PORT, () => {
        console.log(`======= App running on port ${PORT} =======`);
    })
}
