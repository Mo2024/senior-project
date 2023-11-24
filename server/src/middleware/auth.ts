import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { AdminModel, AttendanceUserModel, EmployeeModel, OwnerModel } from "../models/user";

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

    if (employee || req.session.roleSe == 'SeUser') {
        next()
    } else {
        next(createHttpError(401, 'User not Authorized'))
    }
}
export const isAdmin: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const admin = await AdminModel.findById(authenticatedUserId).exec();

    if (!admin) {
        next(createHttpError(401, 'User not Authorized'))
    }
    next()
}
export const isAttendanceUser: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const attendanceUser = await AttendanceUserModel.findById(authenticatedUserId).exec();

    if (!attendanceUser) {
        next(createHttpError(401, 'User not Authorized'))
    }
    next()
}