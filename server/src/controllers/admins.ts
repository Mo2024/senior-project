import { RequestHandler } from "express";
import { assertIsDefined } from "../util/assertIsDefined";
import { IBranchId, IBusinessId, IbranchPopulate } from "./business";
import createHttpError from "http-errors";
import mongoose, { Schema, Types } from "mongoose";
import { CouponModel, couponType } from "../models/coupon";
import { validateCouponRegex, validateEditItemRegex, validateItemRegex } from "../util/functions";
import { BusinessModel } from "../models/business";
import { businessNameRegex } from "../util/regex";
import { CategoryModel } from "../models/category";
import { ItemModel } from "../models/item";
import { BranchModel } from "../models/branch";
import { TableModel } from "../models/table";

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
}
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

interface ICreateItemBody {
    name?: string,
    description?: string,
    price?: number,
    categoryId?: Types.ObjectId
}
export const createItem: RequestHandler<unknown, unknown, ICreateItemBody, unknown> = async (req, res, next) => {
    const { name, description, price, categoryId } = req.body;
    const authenticatedUserId = req.session.userId;
    const adminBusinessId = req.session.businessId;

    try {
        assertIsDefined(authenticatedUserId)
        assertIsDefined(adminBusinessId)

        if (!name || !description || !price || !categoryId) {
            throw createHttpError(400, "Parameter Missing")
        }

        validateItemRegex(name, description, price, categoryId)

        const category = await CategoryModel.findById(categoryId)
            .populate({ path: "businessId", select: "status" })
            .exec() as ICategoryPopulate | null;
        if (!category) {
            throw createHttpError(404, 'Category not found!')
        }
        if (!category.businessId._id.equals(adminBusinessId)) {
            throw createHttpError(401, 'You cannot access this business!')
        }
        if (!category.businessId.status) {
            throw createHttpError(401, 'Your business is locked!')
        }

        const newItem = await ItemModel.create({ name, categoryId, description, price });

        res.status(201).json(newItem)
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
export const getItems: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const adminBusinessId = req.session.businessId;

    try {
        assertIsDefined(authenticatedUserId)
        assertIsDefined(adminBusinessId)
        const matchingCategories = await CategoryModel.find({ businessId: adminBusinessId }).exec();
        const items = await ItemModel.find({ categoryId: { $in: matchingCategories } });

        if (!items) {
            throw createHttpError(404, 'Items not found!')
        }

        res.status(201).json(items)
    } catch (error) {
        next(error)
    }

}

interface IdeleteCategory {
    itemId?: Types.ObjectId
}
export interface IitemPopulate extends Document {
    deleteOne(): unknown;
    _id: Types.ObjectId;
    name: string;
    description: string;
    price: number;
    categoryId: {
        _id: Types.ObjectId;
        businessId: {
            _id: Types.ObjectId;
            status: boolean;
        };
    };
}
export const deleteItem: RequestHandler<unknown, unknown, IdeleteCategory, unknown> = async (req, res, next) => {
    const { itemId } = req.body;
    const authenticatedUserId = req.session.userId;
    const adminBusinessId = req.session.businessId;
    try {
        assertIsDefined(authenticatedUserId)
        assertIsDefined(adminBusinessId)
        if (!itemId) {
            throw createHttpError(400, "Parameter Missing")
        }
        if (!mongoose.isValidObjectId(itemId)) {
            throw createHttpError(404, 'Invalid item id!')
        }

        const item = await ItemModel.findById({ _id: itemId })
            .populate({
                path: 'categoryId',
                select: 'businessId',
                populate: {
                    path: 'businessId',
                    select: 'status',
                },
            }) as IitemPopulate | null;
        if (!item) {
            throw createHttpError(404, 'Item not found!')
        }

        if (!item.categoryId.businessId._id.equals(adminBusinessId)) {
            throw createHttpError(401, 'You cannot access this business!')
        }
        if (!item.categoryId.businessId.status) {
            throw createHttpError(401, 'Your business is locked!')
        }
        await item.deleteOne();
        res.sendStatus(204);
    } catch (error) {
        next(error)
    }

}

interface IEditItem extends INameBody {
    itemId?: Types.ObjectId
    name?: string,
    description?: string,
    price?: number,
    categoryId?: Types.ObjectId
}
export const editItem: RequestHandler<unknown, unknown, IEditItem, unknown> = async (req, res, next) => {
    const { itemId, name, description, categoryId, price } = req.body;
    const authenticatedUserId = req.session.userId;
    const adminBusinessId = req.session.businessId;
    try {
        assertIsDefined(authenticatedUserId)
        assertIsDefined(adminBusinessId)
        if (!itemId || !name || !description || !price || !categoryId) {
            throw createHttpError(400, "Parameter Missing")
        }
        validateEditItemRegex(name, description, price, categoryId, itemId)

        const category = await CategoryModel.findById(categoryId)
            .populate({ path: "businessId", select: "status" }) as ICategoryPopulate | null;
        if (!category) {
            throw createHttpError(404, 'Category not found!')
        }
        if (!category.businessId._id.equals(adminBusinessId)) {
            throw createHttpError(401, 'You cannot access this business!')
        }
        if (!category.businessId.status) {
            throw createHttpError(401, 'Your business is locked!')
        }

        const item = await ItemModel.findById(itemId).exec()

        if (!item) {
            throw createHttpError(404, 'Item not found!')
        }

        item.name = name;
        item.description = description;
        item.price = price;
        item.categoryId = categoryId;
        await item.save();

        res.status(200).json(item)
    } catch (error) {
        next(error)
    }


}
interface ICreateTable extends INameBody {
    branchId?: Types.ObjectId
}
export const createTable: RequestHandler<unknown, unknown, ICreateTable, unknown> = async (req, res, next) => {
    const { name, branchId } = req.body;
    const authenticatedUserId = req.session.userId;
    const adminBusinessId = req.session.businessId;
    try {
        assertIsDefined(authenticatedUserId)
        assertIsDefined(adminBusinessId)
        if (!name || !branchId) {
            throw createHttpError(400, "Parameter Missing")
        }
        if (!businessNameRegex.test(name)) {
            throw createHttpError(400, 'Invalid  Name!');
        }
        if (!mongoose.isValidObjectId(branchId)) {
            throw createHttpError(404, 'Invalid branch id!')
        }
        const branch = await BranchModel.findById(branchId)
            .populate({ path: 'businessId', select: "status" })
            .exec() as IbranchPopulate | null;

        if (!branch) {
            throw createHttpError(404, 'Business not found!')
        }
        if (!branch.businessId._id.equals(adminBusinessId)) {
            throw createHttpError(401, 'You cannot access this business!')
        }
        if (!branch.businessId.status) {
            throw createHttpError(401, 'Your business is locked!')
        }
        const newTable = await TableModel.create({ name, branchId });

        res.status(201).json(newTable)
    } catch (error) {
        next(error)
    }

}
interface IEditTable extends INameBody {
    tableId?: Types.ObjectId
}
interface ITablePopulate {
    save(): unknown;
    deleteOne(): unknown;
    _id: Types.ObjectId;
    branchId: {
        _id: Types.ObjectId;
        businessId: {
            _id: Types.ObjectId;
            status: boolean;
        };
    };
    name: string;
}

export const editTable: RequestHandler<unknown, unknown, IEditTable, unknown> = async (req, res, next) => {
    const { name, tableId } = req.body;
    const authenticatedUserId = req.session.userId;
    const adminBusinessId = req.session.businessId;
    try {
        assertIsDefined(authenticatedUserId)
        assertIsDefined(adminBusinessId)
        if (!name || !tableId) {
            throw createHttpError(400, "Parameter Missing")
        }
        if (!businessNameRegex.test(name)) {
            throw createHttpError(400, 'Invalid  Name!');
        }
        if (!mongoose.isValidObjectId(tableId)) {
            throw createHttpError(404, 'Invalid table id!')
        }
        const table = await TableModel.findById(tableId)
            .populate({
                path: 'branchId',
                select: "businessId",
                populate: {
                    path: "businessId",
                    select: "status"
                }
            })
            .exec() as ITablePopulate | null;

        if (!table) {
            throw createHttpError(404, 'Table not found!')
        }
        if (!table.branchId.businessId._id.equals(adminBusinessId)) {
            throw createHttpError(401, 'You cannot access this business!')
        }
        if (!table.branchId.businessId.status) {
            throw createHttpError(401, 'Your business is locked!')
        }
        table.name = name;
        await table.save();
        res.status(201).json(table)
    } catch (error) {
        next(error)
    }

}

interface IDeleteTable {
    tableId?: Types.ObjectId
}

export const deleteTable: RequestHandler<unknown, unknown, IDeleteTable, unknown> = async (req, res, next) => {
    const { tableId } = req.body;
    const authenticatedUserId = req.session.userId;
    const adminBusinessId = req.session.businessId;
    try {
        assertIsDefined(authenticatedUserId)
        assertIsDefined(adminBusinessId)
        if (!tableId) {
            throw createHttpError(400, "Parameter Missing")
        }
        if (!mongoose.isValidObjectId(tableId)) {
            throw createHttpError(404, 'Invalid item id!')
        }

        const table = await TableModel.findById(tableId)
            .populate({
                path: 'branchId',
                select: "businessId",
                populate: {
                    path: "businessId",
                    select: "status"
                }
            })
            .exec() as ITablePopulate | null;

        if (!table) {
            throw createHttpError(404, 'Table not found!')
        }
        if (!table.branchId.businessId._id.equals(adminBusinessId)) {
            throw createHttpError(401, 'You cannot access this business!')
        }
        if (!table.branchId.businessId.status) {
            throw createHttpError(401, 'Your business is locked!')
        }

        await table.deleteOne();
        res.sendStatus(204);
    } catch (error) {
        next(error)
    }

}



export const getTables: RequestHandler<IBranchId, unknown, unknown, unknown> = async (req, res, next) => {
    const { branchId } = req.params
    const authenticatedUserId = req.session.userId;
    const adminBusinessId = req.session.businessId;

    try {
        assertIsDefined(authenticatedUserId)
        assertIsDefined(adminBusinessId)
        if (!branchId) {
            throw createHttpError(400, "Parameter Missing")
        }
        if (!mongoose.isValidObjectId(branchId)) {
            throw createHttpError(404, 'Invalid business id!')
        }
        const branch = await BranchModel.findById(branchId).exec();
        if (!branch) {
            throw createHttpError(404, 'Branch not found!')
        }
        if (!branch.businessId.equals(adminBusinessId)) {
            throw createHttpError(401, 'You cannot access this business!')
        }
        const tables = await TableModel.find({ branchId }).exec()
        if (!tables) {
            throw createHttpError(404, 'Tables not found!')
        }
        res.status(201).json(tables)
    } catch (error) {
        next(error)
    }

}

export const getBranches: RequestHandler<unknown, unknown, unknown, unknown> = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const adminBusinessId = req.session.businessId;

    try {
        assertIsDefined(authenticatedUserId)
        assertIsDefined(adminBusinessId)

        const branchModels = await BranchModel.find({ businessId: adminBusinessId })
        if (!branchModels) {
            throw createHttpError(404, 'Branches not found!')
        }

        res.status(201).json(branchModels)
    } catch (error) {
        next(error)
    }

}