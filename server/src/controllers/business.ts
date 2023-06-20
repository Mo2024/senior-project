import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { BusinessModel } from '../models/business';
import { assertIsDefined } from '../util/assertIsDefined';
import { validateBusinessRegex } from "../util/functions";

export const getBusinesses: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId)
        const businessModels = await BusinessModel.find({ ownerId: authenticatedUserId });
        res.status(201).json(businessModels)
    } catch (error) {
        next(error)
    }

}


interface BusinessBody {
    name?: string,
    description?: string,

}

export const createBusiness: RequestHandler<unknown, unknown, BusinessBody, unknown> = async (req, res, next) => {
    const { name, description } = req.body;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId)
        if (!name || !description) {
            throw createHttpError(400, "Parameter Missing")
        }
        validateBusinessRegex(name, description)
        const newBusiness = await BusinessModel.create({ name, description, ownerId: authenticatedUserId });

        res.status(201).json(newBusiness)
    } catch (error) {
        next(error)
    }

}