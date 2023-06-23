import { RequestHandler } from "express";
import { assertIsDefined } from "../util/assertIsDefined";

export const getBusinesses: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId)

        res.status(201).json(['im an employee'])
    } catch (error) {
        next(error)
    }

}