import bcrypt from 'bcrypt';
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { AdminModel, EmployeeModel, OwnerModel, UserModel } from '../models/user';
import { checkIfCredentialsIsTaken, checkIfCredentialsIsTakenUpdate, validateOwnerRegex, validateUpdateOwnerRegex, validateUpdateUserRegex } from '../util/functions';
import { BusinessModel } from '../models/business';
import { BranchModel } from '../models/branch';
import { assertIsDefined } from '../util/assertIsDefined';
import { ownerCprRegex } from '../util/regex';
export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    try {
        const user = await UserModel.findById(authenticatedUserId)
            .select('+email +fullName +telephone').exec();
        res.status(201).json(user)
    } catch (error) {
        next(error)
    }
}
interface userInfoBody {
    username?: string,
    email?: string,
    password?: string,
    confirmPassword?: string,
    fullName?: string,
    telephone?: string,
}
interface SignUpOwnerBody extends userInfoBody {
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
            throw createHttpError(400, "Passwords do not match!");
        }

        validateOwnerRegex(username, email, password, confirmPassword, fullName, telephone, area, road, block, building, ownerCpr)
        await checkIfCredentialsIsTaken(username, email)

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
        req.session.role = newOwner.__t;

        const userObj = { _id: newOwner._id, __t: newOwner.__t }
        res.status(201).json(userObj);
    } catch (error) {
        next(error);
    }
};
export const getAllBusinesses: RequestHandler = async (req, res, next) => {

    try {
        const businessModels = await BusinessModel.find().populate('branches').exec();

        res.status(201).json(businessModels)
    } catch (error) {
        next(error)
    }

}


interface LoginBody {
    username?: string,
    password?: string,

}

interface IUser {
    _id: mongoose.Types.ObjectId;
    branchId: mongoose.Types.ObjectId;
    businessId: mongoose.Types.ObjectId;
    username: string;
    email: string;
    password: string;
    __t: 'Employee' | 'Owner' | "Admin";
    __v: number;
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            throw createHttpError(400, "Parameter Missing")
        }

        const user = await UserModel.findOne({ username })
            .select('+password +email').exec() as IUser | null;
        console.log(username)
        if (!user) {
            throw createHttpError(401, "Invalid credentials")
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            throw createHttpError(401, "Invalid credentials")
        }

        if (user.__t === "Employee") {
            const branch = await BranchModel.findById(user.branchId).exec()
            req.session.branchId = user.branchId;
            req.session.businessId = branch?.businessId;
        }
        if (user.__t === "Admin") {
            req.session.businessId = user.businessId;
        }
        req.session.userId = user._id;
        req.session.role = user.__t;

        const userObj = { _id: user._id, __t: user.__t }
        res.status(201).json(userObj)
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

interface updateInfoBody extends userInfoBody {
    area?: string;
    road?: string;
    block?: string;
    building?: string;
    cpr?: number;
    addresses?: IAddress[];
}

interface IAddress {
    addressName: string;
    area: string;
    building: string;
    block: string;
    road: string;
}

export const updateUserInfo: RequestHandler<unknown, unknown, updateInfoBody, unknown> = async (req, res, next) => {
    const { username, email, fullName, telephone, } = req.body;
    const role = req.session.role;
    const userId = req.session.userId;
    console.log(role)

    try {
        assertIsDefined(userId)
        if (!username || !email || !fullName || !telephone) {
            throw createHttpError(400, "Parameter Missing");
        }
        switch (role) {
            case 'Admin':
            case 'Employee': {
                const { cpr } = req.body;
                if (!cpr) {
                    throw createHttpError(400, "Parameter Missing");
                }
                if (!ownerCprRegex.test(cpr.toString())) {
                    throw createHttpError(400, 'Invalid CPR format');
                }
                await checkIfCredentialsIsTakenUpdate(username, email, userId)

                const user = await EmployeeModel.findById(userId).exec() || await AdminModel.findById(userId).exec()
                if (!user) {
                    throw createHttpError(401, "Invalid credentials")
                }
                let updatedFields = {}
                if (user.__t == "Admin") {
                    updatedFields = { username, email, fullName, telephone, adminCpr: cpr, };
                } else if (user.__t == "Employee") {
                    updatedFields = { username, email, fullName, telephone, employeeCpr: cpr, };
                }
                Object.assign(user, updatedFields);
                await user.save();
                res.status(200).json(user)
                break;
            }
            case 'Owner': {
                const { area, road, block, building, cpr, } = req.body;
                if (!area || !road || !block || !building || !cpr) {
                    throw createHttpError(400, "Parameter Missing");
                }
                validateUpdateUserRegex(username, email, fullName, telephone)
                validateUpdateOwnerRegex(area, road, block, building, cpr)

                await checkIfCredentialsIsTakenUpdate(username, email, userId)
                const user = await OwnerModel.findById(userId).exec()
                if (!user) {
                    throw createHttpError(401, "Invalid credentials")
                }
                const updatedFields = { username, email, fullName, telephone, area, road, block, building, ownerCpr: cpr, };
                Object.assign(user, updatedFields);
                await user.save();
                res.status(200).json(user)
                break;
            }
        }

    } catch (error) {
        next(error)
    }

}
