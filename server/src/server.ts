import app from "./app";
import mongoose from "mongoose";
import env from "./util/validateEnv";

const port = env.port;

mongoose.connect(env.mongo_connection)
    .then(() => {
        console.log('mongoose connected')
        app.listen(port, () => {
            console.log('Listening to port ' + port);
        });
    })
    .catch(console.error)