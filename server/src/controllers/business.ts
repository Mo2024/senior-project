import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { BusinessModel } from '../models/business';
import { assertIsDefined } from '../util/assertIsDefined';
import { validateBusinessRegex } from "../util/functions";
import { businessNameRegex } from "../util/regex";
import mongoose, { ObjectId, Schema, Document, Types } from "mongoose";
import { BranchModel } from "../models/branch";

export const getBusinesses: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId)
        const businessModels = await BusinessModel.find({ ownerId: authenticatedUserId }).populate('branches').exec();

        res.status(201).json(businessModels)
    } catch (error) {
        next(error)
    }

}
export const getBranches: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const { businessId } = req.body

    try {
        assertIsDefined(authenticatedUserId)
        const branchModels = await BranchModel.find({ businessId: businessId });
        res.status(201).json(branchModels)
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
interface BranchBody {
    name?: string,
    businessId?: Schema.Types.ObjectId,
}

export const createBranch: RequestHandler<unknown, unknown, BranchBody, unknown> = async (req, res, next) => {
    const { name, businessId } = req.body;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId)
        if (!name || !businessId) {
            throw createHttpError(400, "Parameter Missing")
        }
        if (!mongoose.isValidObjectId(businessId)) {
            throw createHttpError(404, 'Invalid business id!')
        }
        if (!businessNameRegex.test(name)) {
            throw createHttpError(400, 'Invalid Branch name');
        }

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
        const newBranch = await BranchModel.create({ name, businessId });
        await BusinessModel.updateOne(
            { _id: businessId },
            { $push: { branches: newBranch._id } }
        ).exec();

        res.status(201).json(newBranch)
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
        _id: ObjectId;
        ownerId: Types.ObjectId;
        status: boolean;
    }

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
interface IBusinessId {
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
        const updatedBusiness = await BusinessModel.updateOne(
            { _id: businessId },
            { name, description }
        ).exec();

        res.status(200).json(updatedBusiness)
    } catch (error) {
        next(error)
    }

}
interface EditBranchBody {
    name?: string,
    branchId?: Schema.Types.ObjectId,
}

export const editBranch: RequestHandler<unknown, unknown, EditBranchBody, unknown> = async (req, res, next) => {
    const { name, branchId } = req.body;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId)
        if (!branchId || !name) {
            throw createHttpError(400, "Parameter Missing")
        }
        if (!mongoose.isValidObjectId(branchId)) {
            throw createHttpError(404, 'Invalid business id!')
        }
        if (!businessNameRegex.test(name)) {
            throw createHttpError(400, 'Invalid Branch name');
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
        const updatedBranch = await BranchModel.updateOne(
            { _id: branchId },
            { name }
        ).exec();

        res.status(200).json(updatedBranch)
    } catch (error) {
        next(error)
    }

}