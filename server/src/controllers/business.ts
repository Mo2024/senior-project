import bcrypt from 'bcrypt';
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose, { Document, Schema, Types } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import { BranchModel } from "../models/branch";
import { BusinessModel } from '../models/business';
import { AdminModel, EmployeeModel, UserModel } from "../models/user";
import { assertIsDefined } from '../util/assertIsDefined';
import { generatePassword, sendEmail, validateBranchRegex, validateBusinessRegex, validateEmployeeRegex } from "../util/functions";


export const getBusinesses: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId)
        const businessModels = await BusinessModel.findOne({ ownerId: authenticatedUserId }).populate('branches').exec();

        res.status(201).json(businessModels)
    } catch (error) {
        next(error)
    }

}

export const getBusiness: RequestHandler<IBusinessId, unknown, unknown, unknown> = async (req, res, next) => {
    const { businessId } = req.params
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId)
        if (!businessId) {
            throw createHttpError(400, "Parameter Missing")
        }
        if (!mongoose.isValidObjectId(businessId)) {
            throw createHttpError(404, 'Invalid business id!')
        }
        const business = await BusinessModel.findById({ _id: businessId }).exec();
        if (!business) {
            throw createHttpError(404, 'Business not found!')
        }
        if (!business.ownerId.equals(authenticatedUserId)) {
            throw createHttpError(401, 'You cannot access this business!')
        }
        res.status(201).json(business)
    } catch (error) {
        next(error)
    }

}
export const getAdmins: RequestHandler<IBusinessId, unknown, unknown, unknown> = async (req, res, next) => {
    const { businessId } = req.params
    const authenticatedUserId = req.session.userId;
    // console.log(businessId)

    try {
        assertIsDefined(authenticatedUserId)
        if (!businessId) {
            throw createHttpError(400, "Parameter Missing")
        }
        if (!mongoose.isValidObjectId(businessId)) {
            throw createHttpError(404, 'Invalid business id!')
        }
        const business = await BusinessModel.findById({ _id: businessId }).exec();
        if (!business) {
            throw createHttpError(404, 'Business not found!')
        }
        if (!business.ownerId.equals(authenticatedUserId)) {
            throw createHttpError(401, 'You cannot access this business!')
        }
        const admins = await AdminModel.find({ businessId })
            .populate({ path: 'businessId', select: "ownerId" }).exec();
        if (!admins) {
            throw createHttpError(404, 'Admin not found!')
        }

        res.status(201).json(admins)
    } catch (error) {
        next(error)
    }

}


export const getBranches: RequestHandler<IBusinessId, unknown, unknown, unknown> = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const { businessId } = req.params

    try {
        assertIsDefined(authenticatedUserId)
        if (!businessId) {
            throw createHttpError(400, "Parameter Missing")
        }
        if (!mongoose.isValidObjectId(businessId)) {
            throw createHttpError(404, 'Invalid business id!')
        }
        const business = await BusinessModel.findById({ _id: businessId }).exec();
        if (!business) {
            throw createHttpError(404, 'Business not found!')
        }
        if (!business.ownerId.equals(authenticatedUserId)) {
            throw createHttpError(401, 'You cannot access this business!')
        }
        const branchModels = await BranchModel.find({ businessId: businessId })
            .populate({ path: 'businessId', select: 'ownerId status' }) as Array<IbranchPopulate> | null;
        if (!branchModels) {
            throw createHttpError(404, 'Branches not found!')
        }

        res.status(201).json(branchModels)
    } catch (error) {
        next(error)
    }

}

export const getEmployees: RequestHandler<IBranchId, unknown, unknown, unknown> = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const { branchId } = req.params

    try {
        assertIsDefined(authenticatedUserId)
        if (!branchId) {
            throw createHttpError(400, "Parameter Missing")
        }
        if (!mongoose.isValidObjectId(branchId)) {
            throw createHttpError(404, 'Invalid branch id!')
        }
        const branchModels = await BranchModel.findById({ _id: branchId })
            .populate({ path: 'businessId', select: 'ownerId status' }) as IbranchPopulate | null;
        if (!branchModels) {
            throw createHttpError(404, 'Branches not found!')
        }
        if (!branchModels.businessId.ownerId.equals(authenticatedUserId)) {
            throw createHttpError(401, 'You cannot access this business!')
        }
        const employees = await EmployeeModel.find({ branchId: branchId });
        if (!employees) {
            throw createHttpError(404, 'employees not found!')
        }
        res.status(201).json(employees)
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
        const filename = req.file?.filename;
        const newBusiness = await BusinessModel.create({ name, description, ownerId: authenticatedUserId, filename });

        res.status(201).json(newBusiness)
    } catch (error) {
        next(error)
    }

}
interface BranchBody {
    name?: string,
    businessId?: Schema.Types.ObjectId,
    openingTime?: string,
    closingTime?: string,
    lateTime?: string,
}

export const createBranch: RequestHandler<unknown, unknown, BranchBody, unknown> = async (req, res, next) => {
    const { name, businessId, openingTime, closingTime, lateTime } = req.body;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId)
        if (!name || !businessId || !openingTime || !closingTime || !lateTime) {
            throw createHttpError(400, "Parameter Missing")
        }

        validateBranchRegex(name, businessId, openingTime, closingTime, lateTime)

        const business = await BusinessModel.findById(businessId).exec();

        if (!business) {
            throw createHttpError(404, 'Business not found!')
        }
        if (!business.ownerId.equals(authenticatedUserId)) {
            throw createHttpError(401, 'You cannot access this business!')
        }
        if (!business.status) {
            throw createHttpError(401, 'Your business is locked!')
        }

        const newBranch = await BranchModel.create({ name, businessId, attendanceCode: uuidv4(), openingTime, closingTime, lateTime });
        await BusinessModel.updateOne(
            { _id: businessId },
            { $push: { branches: newBranch._id } }
        ).exec();

        res.status(201).json(newBranch)
    } catch (error) {
        next(error)
    }

}
interface EmployeeBody {
    username?: string
    email?: string
    fullName?: string
    telephone?: string
    employeeCpr?: number
    branchId?: Schema.Types.ObjectId
}

export const createEmployee: RequestHandler<unknown, unknown, EmployeeBody, unknown> = async (req, res, next) => {
    const {
        username,
        email,
        fullName,
        telephone,
        employeeCpr,
        branchId

    } = req.body;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId)
        if (!username || !email || !fullName || !telephone || !employeeCpr || !branchId) {

            throw createHttpError(400, "Parameter Missing")
        }
        validateEmployeeRegex(branchId, employeeCpr, username, email, fullName, telephone)
        const branch = await BranchModel.findById(branchId)
            .populate({ path: 'businessId', select: 'ownerId status' })
            .exec() as IbranchPopulate | null;
        if (!branch) {
            throw createHttpError(404, 'Branch not found!')
        }
        if (!branch.businessId.ownerId.equals(authenticatedUserId)) {
            throw createHttpError(401, 'You cannot access this business!')
        }
        if (!branch.businessId.status) {
            throw createHttpError(401, 'Your business is locked!')
        }

        const existingUsername = await UserModel.findOne({ username }).exec();
        if (existingUsername) {
            throw createHttpError(409, "Username already taken. Please choose a different one.");
        }

        const existingEmail = await UserModel.findOne({ email }).exec();
        if (existingEmail) {
            throw createHttpError(409, "Email already taken. Please choose a different one.");
        }
        const generatedPassword = generatePassword();
        const passwordHashed = await bcrypt.hash(generatedPassword, 10)
        const newEmployee = await EmployeeModel.create({
            username,
            email,
            passwordHashed,
            fullName,
            telephone,
            password: passwordHashed,
            employeeCpr,
            branchId
        });
        const subject = "New employee"
        const text = `Your username is ${username} & password is ${generatedPassword}`
        if (!sendEmail(email, subject, text)) {
            throw createHttpError(500, 'Failed to send email.');
        }
        res.status(201).json(newEmployee)
    } catch (error) {
        next(error)
    }

}
interface AdminBody {
    username?: string
    email?: string
    fullName?: string
    telephone?: string
    adminCpr?: number
    businessId?: Schema.Types.ObjectId
}

export const createAdmin: RequestHandler<unknown, unknown, AdminBody, unknown> = async (req, res, next) => {
    const {
        username,
        email,
        fullName,
        telephone,
        adminCpr,
        businessId

    } = req.body;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId)
        if (!username || !email || !fullName || !telephone || !adminCpr || !businessId) {

            throw createHttpError(400, "Parameter Missing")
        }
        validateEmployeeRegex(businessId, adminCpr, username, email, fullName, telephone)

        const business = await BusinessModel.findById(businessId).exec()
        if (!business) {
            throw createHttpError(404, 'Business not found!')
        }
        if (!business.ownerId.equals(authenticatedUserId)) {
            throw createHttpError(401, 'You cannot access this business!')
        }
        if (!business.status) {
            throw createHttpError(401, 'Your business is locked!')
        }

        const existingUsername = await UserModel.findOne({ username }).exec();
        if (existingUsername) {
            throw createHttpError(409, "Username already taken. Please choose a different one.");
        }

        const existingEmail = await UserModel.findOne({ email }).exec();
        if (existingEmail) {
            throw createHttpError(409, "Email already taken. Please choose a different one.");
        }
        const generatedPassword = generatePassword();
        const passwordHashed = await bcrypt.hash(generatedPassword, 10)
        const newEmployee = await AdminModel.create({
            username,
            email,
            passwordHashed,
            fullName,
            telephone,
            password: passwordHashed,
            adminCpr,
            businessId
        });
        const subject = "New Admin"
        const text = `Your username is ${username} & password is ${generatedPassword}`
        if (!sendEmail(email, subject, text)) {
            throw createHttpError(500, 'Failed to send email.');
        }
        res.status(201).json(newEmployee)
    } catch (error) {
        next(error)
    }

}



interface IBranchId {
    branchId?: Schema.Types.ObjectId,
}

interface IbranchPopulate extends Document {
    name: string,
    businessId: {
        _id: Types.ObjectId;
        ownerId: Types.ObjectId;
        status: boolean;
    }
    openingTime?: string,
    closingTime?: string,
    lateTime?: string
}

export const deleteBranch: RequestHandler<unknown, unknown, IBranchId, unknown> = async (req, res, next) => {
    const { branchId } = req.body;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId)
        if (!branchId) {
            throw createHttpError(400, "Parameter Missing")
        }
        if (!mongoose.isValidObjectId(branchId)) {
            throw createHttpError(404, 'Invalid business id!')
        }
        const branch = await BranchModel.findById(branchId)
            .populate({ path: 'businessId', select: 'ownerId status' })
            .exec() as IbranchPopulate | null;

        if (!branch) {
            throw createHttpError(404, 'Branch not found!')
        }

        if (!branch.businessId.ownerId.equals(authenticatedUserId)) {
            throw createHttpError(401, 'You cannot access this business!')
        }
        if (!branch.businessId.status) {
            throw createHttpError(401, 'Your business is locked!')
        }
        const businessId = branch.businessId;

        await branch.deleteOne();
        await BusinessModel.updateOne(
            { _id: businessId },
            { $pull: { branches: branchId } }
        ).exec();
        res.sendStatus(204);
    } catch (error) {
        next(error)
    }

}
export interface IBusinessId {
    businessId?: Schema.Types.ObjectId,
}

export const deleteBusiness: RequestHandler<unknown, unknown, IBusinessId, unknown> = async (req, res, next) => {
    const { businessId } = req.body;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId)
        if (!businessId) {
            throw createHttpError(400, "Parameter Missing")
        }
        if (!mongoose.isValidObjectId(businessId)) {
            throw createHttpError(404, 'Invalid business id!')
        }
        const business = await BusinessModel.findById(businessId).exec();

        if (!business) {
            throw createHttpError(404, 'Business not found!')
        }

        if (!business.ownerId.equals(authenticatedUserId)) {
            throw createHttpError(401, 'You cannot access this business!')
        }
        await BusinessModel.findOneAndDelete({ _id: businessId }).exec();
        res.sendStatus(204);
    } catch (error) {
        next(error)
    }

}
interface IAdminId {
    adminId?: Schema.Types.ObjectId,
}
export const deleteAdmin: RequestHandler<unknown, unknown, IAdminId, unknown> = async (req, res, next) => {
    const { adminId } = req.body;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId)
        if (!adminId) {
            throw createHttpError(400, "Parameter Missing")
        }
        if (!mongoose.isValidObjectId(adminId)) {
            throw createHttpError(404, 'Invalid admin id!')
        }
        const admin = await AdminModel.findById({ _id: adminId })
            .populate({ path: 'businessId', select: "ownerId" }).exec();
        if (!admin) {
            throw createHttpError(404, 'Admin not found!')
        }

        if (!admin.businessId.ownerId.equals(authenticatedUserId)) {
            throw createHttpError(401, 'You cannot access this business!')
        }
        await admin.deleteOne();
        res.sendStatus(204);
    } catch (error) {
        next(error)
    }

}
export const deleteEmployee: RequestHandler<unknown, unknown, IEmployeeId, unknown> = async (req, res, next) => {
    const { employeeId } = req.body;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId)
        if (!employeeId) {
            throw createHttpError(400, "Parameter Missing")
        }
        if (!mongoose.isValidObjectId(employeeId)) {
            throw createHttpError(404, 'Invalid employee id!')
        }
        const employee = await EmployeeModel.findById({ _id: employeeId })
            .populate({ path: 'branchId', select: 'businessId' })
            .exec();
        if (!employee) {
            throw createHttpError(404, 'Employee not found!')
        }
        const business = await BusinessModel.findById({ _id: employee.branchId.businessId })

        if (!business?.ownerId.equals(authenticatedUserId)) {
            throw createHttpError(401, 'You cannot access this business!')
        }
        await employee.deleteOne();
        res.sendStatus(204);
    } catch (error) {
        next(error)
    }

}




interface EditBusinessBody {
    name?: string,
    description?: string,
    businessId?: Schema.Types.ObjectId,

}
export const editBusiness: RequestHandler<unknown, unknown, EditBusinessBody, unknown> = async (req, res, next) => {
    const { name, description, businessId } = req.body;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId)
        if (!name || !businessId || !description) {
            throw createHttpError(400, "Parameter Missing")
        }
        if (!mongoose.isValidObjectId(businessId)) {
            throw createHttpError(404, 'Invalid business id!')
        }
        validateBusinessRegex(name, description)

        const business = await BusinessModel.findById(businessId).exec();

        if (!business) {
            throw createHttpError(404, 'Business not found!')
        }
        if (!business.ownerId.equals(authenticatedUserId)) {
            throw createHttpError(401, 'You cannot access this business!')
        }
        if (!business.status) {
            throw createHttpError(401, 'Your business is locked!')
        }
        business.name = name;
        business.description = description
        await business.save();

        res.status(200).json(business)
    } catch (error) {
        next(error)
    }

}
interface EditBranchBody {
    name?: string,
    branchId?: Schema.Types.ObjectId,
    openingTime?: string,
    closingTime?: string,
    lateTime?: string
}

export const editBranch: RequestHandler<unknown, unknown, EditBranchBody, unknown> = async (req, res, next) => {
    const { name, branchId, openingTime, closingTime, lateTime } = req.body;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId)
        if (!name || !branchId || !openingTime || !closingTime || !lateTime) {
            throw createHttpError(400, "Parameter Missing")
        }
        validateBranchRegex(name, branchId, openingTime, closingTime, lateTime)

        const branch = await BranchModel.findById(branchId)
            .populate({ path: 'businessId', select: 'ownerId status' })
            .exec() as IbranchPopulate | null;

        if (!branch) {
            throw createHttpError(404, 'Branch not found!')
        }

        if (!branch.businessId.ownerId.equals(authenticatedUserId)) {
            throw createHttpError(401, 'You cannot access this business!')
        }
        if (!branch.businessId.status) {
            throw createHttpError(401, 'Your business is locked!')
        }

        branch.name = name;
        branch.openingTime = openingTime;
        branch.closingTime = closingTime;
        branch.lateTime = lateTime;
        await branch.save();

        res.status(200).json(branch)
    } catch (error) {
        next(error)
    }

}

interface IEmployeeId extends IBranchId {
    employeeId?: Types.ObjectId
}
export const editEmployeeBranch: RequestHandler<unknown, unknown, IEmployeeId, unknown> = async (req, res, next) => {
    const { branchId, employeeId } = req.body;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId)
        if (!branchId || !employeeId) {
            throw createHttpError(400, "Parameter Missing")
        }
        if (!mongoose.isValidObjectId(branchId)) {
            throw createHttpError(404, 'Invalid branch id!')
        }
        if (!mongoose.isValidObjectId(employeeId)) {
            throw createHttpError(404, 'Invalid employee id!')
        }
        const branch = await BranchModel.findById(branchId)
            .populate({ path: 'businessId', select: 'ownerId status' })
            .exec() as IbranchPopulate | null;

        if (!branch) {
            throw createHttpError(404, 'Branch not found!')
        }

        if (!branch.businessId.ownerId.equals(authenticatedUserId)) {
            throw createHttpError(401, 'You cannot access this business!')
        }
        if (!branch.businessId.status) {
            throw createHttpError(401, 'Your business is locked!')
        }

        const employee = await EmployeeModel.findById(employeeId).populate({ path: 'branchId', select: 'businessId' }).exec();

        if (!employee) {
            throw createHttpError(404, 'Employee not found!')
        }


        if (!branch.businessId._id.equals(employee.branchId.businessId)) {
            throw createHttpError(401, 'Employee does not belong to this business!')
        }
        employee.branchId = branchId;
        await employee.save();

        res.status(200).json(employee)
    } catch (error) {
        next(error)
    }


}