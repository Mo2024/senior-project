import bcrypt from 'bcrypt';
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { CustomerModel, OwnerModel, UserModel } from '../models/user';
import { validateOwnerRegex, validateUserRegex } from '../util/functions';
export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    try {
        const user = await UserModel.findById(authenticatedUserId).select('+email').exec();
        res.status(201).json(user)
    } catch (error) {
        next(error)
    }
}
interface SignUpOwnerBody {
    username?: string,
    email?: string,
    password?: string,
    confirmPassword?: string,
    fullName?: string,
    telephone?: string,
    area?: string,
    road?: string,
    block?: string,
    building?: string,
    ownerCpr?: number,
}
export const signUpOwner: RequestHandler<unknown, unknown, SignUpOwnerBody, unknown> = async (req, res, next) => {
    const {
        username,
        email,
        password,
        confirmPassword,
        fullName,
        telephone,
        area,
        road,
        block,
        building,
        ownerCpr,
    } = req.body;
    try {
        if (!username || !email || !password || !confirmPassword || !fullName || !telephone || !area || !road || !block || !building || !ownerCpr) {
            throw createHttpError(400, "Parameter Missing");
        }

        if (password !== confirmPassword) {
            throw createHttpError(400, "Passwords Do not match!");
        }

        validateUserRegex(username, email, password, confirmPassword, fullName, telephone)
        validateOwnerRegex(area, road, block, building, ownerCpr)
        const existingUsername = await UserModel.findOne({ username }).exec();
        if (existingUsername) {
            throw createHttpError(409, "Username already taken. Please choose a different one.");
        }

        const existingEmail = await UserModel.findOne({ email }).exec();
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

interface SignUpCustomerBody {
    username?: string,
    email?: string,
    password?: string,
    confirmPassword?: string,
    fullName?: string,
    telephone?: string,

}
export const signUpCustomer: RequestHandler<unknown, unknown, SignUpCustomerBody, unknown> = async (req, res, next) => {
    const {
        username,
        email,
        password,
        confirmPassword,
        fullName,
        telephone,
    } = req.body;
    try {
        if (!username || !email || !password || !confirmPassword || !fullName || !telephone) {
            throw createHttpError(400, "Parameter Missing");
        }

        validateUserRegex(username, email, password, confirmPassword, fullName, telephone)


        const existingUsername = await UserModel.findOne({ username }).exec();
        if (existingUsername) {
            throw createHttpError(409, "Username already taken. Please choose a different one.");
        }

        const existingEmail = await UserModel.findOne({ email }).exec();
        if (existingEmail) {
            throw createHttpError(409, "Email already taken. Please choose a different one.");
        }

        const passwordHashed = await bcrypt.hash(password, 10);
        const newCustomer = await CustomerModel.create({
            username,
            email,
            password: passwordHashed,
            fullName,
            telephone,
        });

        req.session.userId = newCustomer._id as mongoose.Types.ObjectId;

        res.status(201).json(newCustomer);
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

