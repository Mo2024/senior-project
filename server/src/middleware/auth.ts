import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { OwnerModel } from "../models/user";

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

