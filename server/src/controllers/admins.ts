import { RequestHandler } from "express";
import { assertIsDefined } from "../util/assertIsDefined";
import { IBusinessId } from "./business";
import createHttpError from "http-errors";
import mongoose, { Schema, Types } from "mongoose";
import { CouponModel, couponType } from "../models/coupon";
import { validateCouponRegex } from "../util/functions";
import { BusinessModel } from "../models/business";

export const getCoupons: RequestHandler<IBusinessId, unknown, unknown, unknown> = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const { businessId } = req.params

    try {
        assertIsDefined(authenticatedUserId)
        if (!businessId) {
            throw createHttpError(400, "Parameter Missing")
        }
        if (!mongoose.isValidObjectId(businessId as Schema.Types.ObjectId)) {
            throw createHttpError(404, 'Invalid business id!')
        }
        const coupons = await CouponModel.find({ businessId: businessId });
        console.log(coupons)
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

interface CouponBody {
    name?: string,
    businessId?: Schema.Types.ObjectId,
    amount?: number,
    type?: couponType,
}


export const editCoupon: RequestHandler<unknown, unknown, EditCouponBody, unknown> = async (req, res, next) => {
    const { name, couponId, amount, type } = req.body;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId)
        if (!name || !couponId || !amount || !type) {
            throw createHttpError(400, "Parameter Missing")
        }
        validateCouponRegex(name, couponId, amount, type)

        const coupon = await CouponModel.findById(couponId)
            .populate({ path: 'businessId', select: 'ownerId status' })
            .exec() as IcouponPopulate | null;

        if (!coupon) {
            throw createHttpError(404, 'Coupon not found!')
        }

        if (!coupon.businessId.ownerId.equals(authenticatedUserId)) {
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

    try {
        assertIsDefined(authenticatedUserId)
        if (!couponId) {
            throw createHttpError(400, "Parameter Missing")
        }
        if (!mongoose.isValidObjectId(couponId)) {
            throw createHttpError(404, 'Invalid business id!')
        }
        const coupon = await CouponModel.findById(couponId)
            .populate({ path: 'businessId', select: 'ownerId status' })
            .exec() as IcouponPopulate | null;

        if (!coupon) {
            throw createHttpError(404, 'Coupon not found!')
        }

        if (!coupon.businessId.ownerId.equals(authenticatedUserId)) {
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

export const createCoupon: RequestHandler<unknown, unknown, CouponBody, unknown> = async (req, res, next) => {
    const { name, businessId, amount, type } = req.body;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId)
        if (!name || !businessId || !amount || !type) {
            throw createHttpError(400, "Parameter Missing")
        }
        validateCouponRegex(name, businessId, amount, type)

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
        const newCoupon = await CouponModel.create({ name, businessId, amount, type });

        res.status(201).json(newCoupon)
    } catch (error) {
        next(error)
    }

}