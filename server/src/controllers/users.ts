import bcrypt from 'bcrypt';
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { OwnerModel, UserModel } from '../models/user';
import { emailRegex, ownerCprRegex, passwordRegex, usernameRegex } from "../util/regex";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    const authenticatedUser = req.session.userId;
    try {
        const user = await UserModel.findById(authenticatedUser).select('+email').exec();
        res.status(201).json(user)
    } catch (error) {
        next(error)
    }
}
interface SignUpBody {
    username?: string,
    email?: string,
    password?: string,

}
export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    // const { username, email, password } = req.body;

    // try {
    //     if (!username || !email || !password) {
    //         throw createHttpError(400, "Parameter Missing")
    //     }

    //     const existingUsername = await UserModel.findOne({ username }).exec();
    //     if (existingUsername) {
    //         throw createHttpError(409, "Username already taken. Please choose a diffrent one.")
    //     }
    //     const existingEmail = await UserModel.findOne({ email }).exec();
    //     if (existingEmail) {
    //         throw createHttpError(409, "Email already taken. Please choose a diffrent one.")
    //     }

    //     const passwordHashed = await bcrypt.hash(password, 10);
    //     const newUser = await UserModel.create({ username, email, password: passwordHashed });

    //     // req.session.userId = newUser._id;

    //     res.status(201).json(newUser)

    // } catch (error) {
    //     next(error)
    // }
}
interface SignUpClientBody {
    username?: string,
    email?: string,
    password?: string,
    fullName?: string,
    telephone?: string,
    area?: string,
    road?: string,
    block?: string,
    building?: string,
    ownerCpr?: number,
}
export const signUpClient: RequestHandler<unknown, unknown, SignUpClientBody, unknown> = async (req, res, next) => {
    const {
        username,
        email,
        password,
        fullName,
        telephone,
        area,
        road,
        block,
        building,
        ownerCpr,
    } = req.body;
    try {
        if (!username || !email || !password) {
            throw createHttpError(400, "Parameter Missing");
        }

        if (!usernameRegex.test(username)) {
            throw createHttpError(400, "Invalid username format");
        }

        if (!emailRegex.test(email)) {
            throw createHttpError(400, "Invalid email format");
        }

        if (!passwordRegex.test(password)) {
            throw createHttpError(400, "Invalid password format");
        }

        if (ownerCpr && !ownerCprRegex.test(ownerCpr.toString())) {
            throw createHttpError(400, "Invalid owner CPR format");
        }

        const existingUsername = await OwnerModel.findOne({ username }).exec();
        if (existingUsername) {
            throw createHttpError(409, "Username already taken. Please choose a different one.");
        }

        const existingEmail = await OwnerModel.findOne({ email }).exec();
        if (existingEmail) {
            throw createHttpError(409, "Email already taken. Please choose a different one.");
        }

        const passwordHashed = await bcrypt.hash(password, 10);
        const newOwner = await OwnerModel.create({
            username,
            email,
            password: passwordHashed,
            fullName,
            telephone,
            area,
            road,
            block,
            building,
            ownerCpr,
        });

        req.session.userId = newOwner._id as mongoose.Types.ObjectId;

        res.status(201).json(newOwner);
    } catch (error) {
        next(error);
    }
};

interface LoginBody {
    username?: string,
    password?: string,

}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            throw createHttpError(400, "Parameter Missing")
        }

        const user = await UserModel.findOne({ username }).select('+password +email').exec();
        if (!user) {
            throw createHttpError(401, "Invalid credentials")
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            throw createHttpError(401, "Invalid credentials")
        }

        req.session.userId = user._id;
        res.status(201).json(user)
    } catch (error) {
        next(error)
    }

}

export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error)
        } else {
            res.sendStatus(200)
        }
    });

}

