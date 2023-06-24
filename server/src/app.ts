import MongoStore from "connect-mongo";
import "dotenv/config";
import express, { NextFunction, Request, Response } from 'express';
import session from "express-session";
import createHttpError, { isHttpError } from "http-errors";
import morgan from 'morgan';
import { requiresAuth, isOwner, isEmployee, isAdminOrOwner } from './middleware/auth';
import userRoutes from './routes/users';
import businessRoutes from './routes/business';
import employeesRoutes from './routes/employees';
import adminRoutes from './routes/admins';
import env from './util/validateEnv';

const app = express();
app.use(morgan('dev'));
app.use(express.json());

app.use(session({
    secret: env.session_secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.mongo_connection
    })
}))

app.use('/api/users', userRoutes);
app.use('/api/employees', requiresAuth, isEmployee, employeesRoutes);
app.use('/api/admins', requiresAuth, isAdminOrOwner, adminRoutes);
app.use('/api/business', requiresAuth, isOwner, businessRoutes);

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"))
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.log(error)
    let errorMsg = "An error occured";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMsg = error.message;
    }
    res.status(statusCode).json({ error: errorMsg });
})

export default app;