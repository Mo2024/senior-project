import { cleanEnv } from "envalid";
import { str, port } from 'envalid/dist/validators';

export default cleanEnv(process.env, {
    mongo_connection: str(),
    port: port(),
    session_secret: str(),
    smtpEmail: str(),
    smtpPassword: str(),
    secret_key: str(),
    pk: str(),
}) 