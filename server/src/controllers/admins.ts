import { RequestHandler } from "express";
import { assertIsDefined } from "../util/assertIsDefined";
import { IBusinessId } from "./business";
import createHttpError from "http-errors";
import mongoose, { Schema, Types } from "mongoose";
import { CouponModel, couponType } from "../models/coupon";
import { validateCouponRegex } from "../util/functions";
import { BusinessModel } from "../models/business";
import { businessNameRegex } from "../util/regex";
import { CategoryModel } from "../models/category";

export const getCoupons: RequestHandler<IBusinessId, unknown, unknown, unknown> = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const adminBusinessId = req.session.businessId;

    try {
        assertIsDefined(authenticatedUserId)
        assertIsDefined(adminBusinessId)
        const coupons = await CouponModel.find({ businessId: adminBusinessId });
        if (!coupons) {
            throw createHttpError(404, 'Coupons not found!')
        }
        res.status(201).json(coupons)
    } catch (error) {
        next(error)
    }

}

interface EditCouponBody {
    name?: string,
    couponId?: Schema.Types.ObjectId,
    amount?: number,
    type?: couponType,
}

interface ICouponId {
    couponId?: Schema.Types.ObjectId,
}

interface IcouponPopulate extends Document {
    save(): unknown;
    deleteOne(): unknown;
    name: string,
    businessId: {
        _id: Types.ObjectId;
        ownerId: Types.ObjectId;
        status: boolean;
    },
    amount: number,
    type: string,
}

interface INameBody {
    name?: string,
    amount?: number,
    type?: couponType,
}


export const editCoupon: RequestHandler<unknown, unknown, EditCouponBody, unknown> = async (req, res, next) => {
    const { name, couponId, amount, type } = req.body;
    const authenticatedUserId = req.session.userId;
    const adminBusinessId = req.session.businessId;
    try {
        assertIsDefined(authenticatedUserId)
        assertIsDefined(adminBusinessId)
        if (!name || !couponId || !amount || !type) {
            throw createHttpError(400, "Parameter Missing")
        }
        if (!mongoose.isValidObjectId(couponId)) {
            throw createHttpError(404, 'Invalid coupon id!')
        }
        validateCouponRegex(name, amount, type)

        const coupon = await CouponModel.findById(couponId)
            .populate({ path: 'businessId', select: 'ownerId status' })
            .exec() as IcouponPopulate | null;

        if (!coupon) {
            throw createHttpError(404, 'Coupon not found!')
        }

        if (!coupon.businessId._id.equals(adminBusinessId)) {
            throw createHttpError(401, 'You cannot access this business!')
        }
        if (!coupon.businessId.status) {
            throw createHttpError(401, 'Your business is locked!')
        }

        coupon.name = name;
        coupon.type = type;
        coupon.amount = amount;
        await coupon.save();

        res.status(200).json(coupon)
    } catch (error) {
        next(error)
    }


}

export const deleteCoupon: RequestHandler<unknown, unknown, ICouponId, unknown> = async (req, res, next) => {
    const { couponId } = req.body;
    const authenticatedUserId = req.session.userId;
    const adminBusinessId = req.session.businessId;

    try {
        assertIsDefined(authenticatedUserId)
        assertIsDefined(adminBusinessId)
        if (!couponId) {
            throw createHttpError(400, "Parameter Missing")
        }
        if (!mongoose.isValidObjectId(couponId)) {
            throw createHttpError(404, 'Invalid coupon id!')
        }
        const coupon = await CouponModel.findById(couponId)
            .populate({ path: 'businessId', select: 'ownerId status' })
            .exec() as IcouponPopulate | null;

        if (!coupon) {
            throw createHttpError(404, 'Coupon not found!')
        }

        if (!coupon.businessId._id.equals(adminBusinessId)) {
            throw createHttpError(401, 'You cannot access this business!')
        }
        if (!coupon.businessId.status) {
            throw createHttpError(401, 'Your business is locked!')
        }

        await coupon.deleteOne();
        res.sendStatus(204);
    } catch (error) {
        next(error)
    }

}

export const createCoupon: RequestHandler<unknown, unknown, INameBody, unknown> = async (req, res, next) => {
    const { name, amount, type } = req.body;
    const authenticatedUserId = req.session.userId;
    const adminBusinessId = req.session.businessId;
    try {
        assertIsDefined(authenticatedUserId)
        assertIsDefined(adminBusinessId)
        if (!name || !amount || !type) {
            throw createHttpError(400, "Parameter Missing")
        }
        validateCouponRegex(name, amount, type)

        const business = await BusinessModel.findById(adminBusinessId).exec();

        if (!business) {
            throw createHttpError(404, 'Business not found!')
        }
        if (!business.status) {
            throw createHttpError(401, 'Your business is locked!')
        }
        const newCoupon = await CouponModel.create({ name, businessId: adminBusinessId, amount, type });

        res.status(201).json(newCoupon)
    } catch (error) {
        next(error)
    }

}

interface INameBody {
    name?: string,
}//interface for create actaegeory etc!
export const createCategory: RequestHandler<unknown, unknown, INameBody, unknown> = async (req, res, next) => {
    const { name } = req.body;
    const authenticatedUserId = req.session.userId;
    const adminBusinessId = req.session.businessId;

    try {
        assertIsDefined(authenticatedUserId)
        assertIsDefined(adminBusinessId)
        if (!name) {
            throw createHttpError(400, "Parameter Missing")
        }
        if (!businessNameRegex.test(name)) {
            throw createHttpError(400, 'Invalid Business name');
        }

        const business = await BusinessModel.findById(adminBusinessId).exec();

        if (!business) {
            throw createHttpError(404, 'Business not found!')
        }
        if (!business._id.equals(adminBusinessId)) {
            throw createHttpError(401, 'You cannot access this business!')
        }
        if (!business.status) {
            throw createHttpError(401, 'Your business is locked!')
        }

        const newCategory = await CategoryModel.create({ name, businessId: adminBusinessId });

        res.status(201).json(newCategory)
    } catch (error) {
        next(error)
    }

}
interface ICategoryPopulate extends Document {
    save(): unknown;
    deleteOne(): unknown;
    name: string,
    businessId: {
        _id: Types.ObjectId;
        ownerId: Types.ObjectId;
        status: boolean;
    },
}

export const getCategories: RequestHandler<IBusinessId, unknown, unknown, unknown> = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const adminBusinessId = req.session.businessId;

    try {
        assertIsDefined(authenticatedUserId)
        assertIsDefined(adminBusinessId)
        const categories = await CategoryModel.find({ businessId: adminBusinessId })
            .populate({ path: "businessId", select: "ownerId" }) as Array<ICategoryPopulate> | null;
        if (!categories) {
            throw createHttpError(404, 'Categories not found!')
        }
        res.status(201).json(categories)
    } catch (error) {
        next(error)
    }

}

interface IdeleteCategory {
    categoryId: Types.ObjectId
}
export const deleteCategory: RequestHandler<unknown, unknown, IdeleteCategory, unknown> = async (req, res, next) => {
    const { categoryId } = req.body;
    const authenticatedUserId = req.session.userId;
    const adminBusinessId = req.session.businessId;
    try {
        assertIsDefined(authenticatedUserId)
        assertIsDefined(adminBusinessId)
        if (!categoryId) {
            throw createHttpError(400, "Parameter Missing")
        }
        if (!mongoose.isValidObjectId(categoryId)) {
            throw createHttpError(404, 'Invalid category id!')
        }

        const category = await CategoryModel.findById({ _id: categoryId })
            .populate({ path: "businessId", select: "ownerId status" }) as ICategoryPopulate | null;

        if (!category) {
            throw createHttpError(404, 'Coupon not found!')
        }

        if (!category.businessId._id.equals(adminBusinessId)) {
            throw createHttpError(401, 'You cannot access this business!')
        }
        if (!category.businessId.status) {
            throw createHttpError(401, 'Your business is locked!')
        }
        await category.deleteOne();
        res.sendStatus(204);
    } catch (error) {
        next(error)
    }

}

interface IEditCategory extends INameBody {
    categoryId: Types.ObjectId
}

export const editCategory: RequestHandler<unknown, unknown, IEditCategory, unknown> = async (req, res, next) => {
    const { name, categoryId } = req.body;
    const authenticatedUserId = req.session.userId;
    const adminBusinessId = req.session.businessId;
    try {
        assertIsDefined(authenticatedUserId)
        assertIsDefined(adminBusinessId)
        if (!name) {
            throw createHttpError(400, "Parameter Missing")
        }
        if (!businessNameRegex.test(name)) {
            throw createHttpError(400, 'Invalid Branch name');
        }
        if (!mongoose.isValidObjectId(categoryId)) {
            throw createHttpError(404, 'Invalid coupon id!')
        }

        const category = await CategoryModel.findById(categoryId)
            .populate({ path: 'businessId', select: 'ownerId status' })
            .exec() as ICategoryPopulate | null;

        if (!category) {
            throw createHttpError(404, 'Coupon not found!')
        }
        if (!category.businessId._id.equals(adminBusinessId)) {
            throw createHttpError(401, 'You cannot access this business!')
        }
        if (!category.businessId.status) {
            throw createHttpError(401, 'Your business is locked!')
        }

        category.name = name;
        await category.save();

        res.status(200).json(category)
    } catch (error) {
        next(error)
    }


}