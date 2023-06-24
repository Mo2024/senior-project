import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { AdminModel, EmployeeModel, OwnerModel } from "../models/user";

export const requiresAuth: RequestHandler = (req, res, next) => {
    if (req.session.userId) {
        next()
    } else {
        next(createHttpError(401, 'User not authenticated'))
    }
}

export const isOwner: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const owner = await OwnerModel.findById(authenticatedUserId).exec();

    if (owner) {
        next()
    } else {
        next(createHttpError(401, 'User not Authorized'))
    }
}
export const isEmployee: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const employee = await EmployeeModel.findById(authenticatedUserId).exec();

    if (employee) {
        next()
    } else {
        next(createHttpError(401, 'User not Authorized'))
    }
}
export const isAdminOrOwner: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const admin = await AdminModel.findById(authenticatedUserId).exec();
    const owner = await OwnerModel.findById(authenticatedUserId).exec();

    if (!admin && !owner) {
        next(createHttpError(401, 'User not Authorized'))
    }
    next()
}

